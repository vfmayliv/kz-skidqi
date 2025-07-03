import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useSupabase } from '@/contexts/SupabaseContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Save, MapPin } from 'lucide-react';
import { processImageForUpload, createImagePreviewUrl, revokeImagePreviewUrl } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { useCategoryHierarchy } from '@/hooks/useCategoryHierarchy';
import { useLocationData } from '@/hooks/useLocationData';
import { uploadImagestoSupabase, saveListingToSupabase } from '@/utils/listingUtils';
import { CategorySelector } from '@/components/create-listing/CategorySelector';
import { CategoryFilters } from '@/components/create-listing/CategoryFilters';

// Define a form data interface that matches our form structure
interface CreateListingFormData {
  title: string;
  description: string;
  originalPrice: number;
  categoryId: string | null;
  regionId: string;
  cityId: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  status: string;
  userId: string;
  filters: Record<string, any>;
}

const CreateListing = () => {
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories: categoryTree, loading: categoriesLoading } = useCategoryHierarchy();
  const { regions, cities, loading: locationsLoading } = useLocationData();

  const [selectedCategories, setSelectedCategories] = useState<(any | null)[]>([null, null, null]);
  const [formData, setFormData] = useState<CreateListingFormData>({
    title: '',
    description: '',
    originalPrice: 0,
    categoryId: null,
    regionId: '',
    cityId: '',
    address: '',
    latitude: null,
    longitude: null,
    images: [],
    status: 'draft',
    userId: user?.id || '',
    filters: {},
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Проверяем аутентификацию при загрузке компонента
  useEffect(() => {
    if (!user) {
      toast({ 
        title: 'Необходима авторизация', 
        description: 'Для создания объявления необходимо войти в систему.',
        variant: 'destructive' 
      });
      navigate('/login');
      return;
    }
    
    setFormData(prev => ({ ...prev, userId: user.id }));
  }, [user, navigate, toast]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const processedFiles = await Promise.all(files.map(file => processImageForUpload(file)));
      const validFiles = processedFiles.filter((file): file is File => file !== null);
      
      const newImagePreviews = validFiles.map(file => createImagePreviewUrl(file));
      setImageFiles(prev => [...prev, ...validFiles]);
      setImagePreviews(prev => [...prev, ...newImagePreviews]);
    }
  };

  const removeImage = (index: number) => {
    revokeImagePreviewUrl(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Обработка выбора категории
  const handleCategoryChange = (level: number, categoryId: string) => {
    const category = findCategoryById(categoryTree, categoryId);
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[level] = category;
    
    // Очищаем подкатегории при изменении родительской категории
    for (let i = level + 1; i < newSelectedCategories.length; i++) {
      newSelectedCategories[i] = null;
    }
    
    setSelectedCategories(newSelectedCategories);
    
    // Устанавливаем categoryId в formData
    if (category) {
      setFormData(prev => ({ ...prev, categoryId: categoryId }));
    }
  };

  // Вспомогательная функция для поиска категории по ID
  const findCategoryById = (categories: any[], id: string): any | null => {
    for (const category of categories) {
      if (category.id.toString() === id) {
        return category;
      }
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Обработка изменения фильтров
  const handleFilterChange = (filterKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterKey]: value
      }
    }));
  };

  // Получаем последнюю выбранную категорию для фильтров
  const getSelectedCategory = () => {
    for (let i = selectedCategories.length - 1; i >= 0; i--) {
      if (selectedCategories[i]) {
        return selectedCategories[i];
      }
    }
    return null;
  };

  const handlePublish = async () => {
    if (!user) {
      toast({ title: 'Ошибка', description: 'Для публикации объявления необходимо авторизоваться.', variant: 'destructive' });
      return;
    }

    // Валидация обязательных полей
    if (!formData.title || !formData.description || !formData.categoryId) {
      toast({ 
        title: 'Ошибка валидации', 
        description: 'Заполните все обязательные поля: название, описание и категорию.',
        variant: 'destructive' 
      });
      return;
    }

    toast({ title: 'Публикация...', description: 'Загружаем изображения и сохраняем объявление.' });

    try {
      const imageUrls = await uploadImagestoSupabase(imageFiles);
      
      const finalListingData = {
        title: formData.title,
        description: formData.description,
        regular_price: formData.originalPrice || 0,
        category_id: parseInt(formData.categoryId),
        user_id: user.id,
        city_id: formData.cityId ? parseInt(formData.cityId) : undefined,
        region_id: formData.regionId ? parseInt(formData.regionId) : undefined,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: imageUrls,
        status: 'active',
      };

      const listingId = await saveListingToSupabase(finalListingData);

      if (listingId) {
        toast({ title: 'Успех!', description: 'Ваше объявление успешно опубликовано.' });
        navigate(`/property/${listingId}`);
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось сохранить объявление. Пожалуйста, попробуйте позже.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Ошибка при публикации:', error);
      toast({ title: 'Ошибка', description: 'Произошла ошибка при публикации объявления.', variant: 'destructive' });
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast({ title: 'Ошибка', description: 'Для сохранения черновика необходимо авторизоваться.', variant: 'destructive' });
      return;
    }

    toast({ title: 'Сохранение черновика...', description: 'Загружаем изображения и сохраняем черновик.' });

    try {
      const imageUrls = await uploadImagestoSupabase(imageFiles);
      
      const draftData = {
        title: formData.title || '',
        description: formData.description || '',
        regular_price: formData.originalPrice || 0,
        category_id: formData.categoryId ? parseInt(formData.categoryId) : 1,
        user_id: user.id,
        city_id: formData.cityId ? parseInt(formData.cityId) : undefined,
        region_id: formData.regionId ? parseInt(formData.regionId) : undefined,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: imageUrls,
        status: 'draft',
      };

      const listingId = await saveListingToSupabase(draftData);

      if (listingId) {
        toast({ title: 'Черновик сохранен', description: 'Вы можете вернуться к нему позже в личном кабинете.' });
        navigate('/user/listings');
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось сохранить черновик.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Ошибка при сохранении черновика:', error);
      toast({ title: 'Ошибка', description: 'Произошла ошибка при сохранении черновика.', variant: 'destructive' });
    }
  };

  if (!user) {
    return null; // Компонент перенаправит на страницу входа
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Создание объявления</h2>
                
                {/* Category Selection */}
                <CategorySelector
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                />
                
                {/* Title */}
                <div className="mb-4">
                  <Label htmlFor="title">Название *</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    placeholder="Введите название объявления"
                  />
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <Label htmlFor="description">Описание *</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Подробное описание"
                    rows={4}
                  />
                </div>
                
                {/* Price */}
                <div className="mb-4">
                  <Label htmlFor="price">Цена</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formData.originalPrice || 0} 
                    onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>

                {/* Category Filters */}
                <CategoryFilters
                  selectedCategory={getSelectedCategory()}
                  formData={formData}
                  onFilterChange={handleFilterChange}
                />
                
                {/* Location */}
                {!locationsLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Регион</Label>
                      <Select onValueChange={(value) => setFormData({...formData, regionId: value, cityId: ''})} value={formData.regionId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите регион" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map(region => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name_ru}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Город</Label>
                      <Select 
                        onValueChange={(value) => setFormData({...formData, cityId: value})} 
                        value={formData.cityId} 
                        disabled={!formData.regionId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите город" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities
                            .filter(c => c.region_id.toString() === formData.regionId)
                            .map(city => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name_ru}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {/* Address */}
                <div className="mb-4">
                  <Label htmlFor="address">Адрес</Label>
                  <Input 
                    id="address" 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Укажите адрес"
                  />
                </div>
                
                {/* Image Upload */}
                <div>
                  <Label>Изображения</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Нажмите, чтобы загрузить изображения</p>
                    <input 
                      type="file" 
                      multiple 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`preview ${index}`} 
                          className="h-32 w-full object-cover rounded-md" 
                        />
                        <button 
                          onClick={() => removeImage(index)} 
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Button 
                  className="w-full mb-4" 
                  onClick={handlePublish}
                  disabled={!formData.title || !formData.description || !formData.categoryId}
                >
                  Опубликовать
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleSaveDraft}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить черновик
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateListing;
