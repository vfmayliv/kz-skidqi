import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { transportFilterConfig } from '@/categories/transport/filterConfig';
import { useTransportData } from '@/hooks/useTransportData';
import { 
  TransportFilters as TransportFiltersType,
  BodyType,
  TransmissionType,
  EngineType,
  DriveType,
  ConditionType,
  VehicleType 
} from '@/types/listingType';
import { BrandData } from '@/data/transportData';

export interface TransportFiltersProps {
  onFilterChange?: (filters: Partial<TransportFiltersType>) => void;
  onReset?: () => void;
  onSearch?: () => void;
  brands?: BrandData[];
  activeFiltersCount?: number;
  vehicleType?: string;
  availableFilters?: {
    brands?: string[];
    models?: Record<string, string[]>;
    years?: number[];
    bodyTypes?: string[];
  };
}

const TransportFilters: React.FC<TransportFiltersProps> = ({
  onFilterChange,
  onReset,
  onSearch,
  activeFiltersCount = 0,
  vehicleType = 'passenger'
}) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(vehicleType);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  
  // Определяем тип транспорта для загрузки данных
  // Если выбрана подкатегория, используем её, иначе основную категорию
  const dataType = selectedSubcategory || selectedCategory;
  
  // Используем хук для загрузки данных из Supabase для текущего типа транспорта
  const { brands, models, loading, error } = useTransportData(dataType);
  
  const [selectedFilters, setSelectedFilters] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    bodyType: '',
    transmission: '',
    engine: '',
    drive: '',
    condition: 'all',
    withPhoto: true,
    mileageFrom: '',
    mileageTo: ''
  });

  // Мемоизированные модели для выбранного бренда
  const availableModels = useMemo(() => {
    if (!selectedFilters.brand) return [];
    return models.filter(model => model.brand_id === selectedFilters.brand);
  }, [models, selectedFilters.brand]);

  // Используем конфигурацию фильтров транспорта
  const categories = transportFilterConfig.categories || [];
  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];

  // Годы для фильтра
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  // Обработчик изменения фильтров
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...selectedFilters, [key]: value };
    
    // Сброс модели при изменении бренда
    if (key === 'brand') {
      newFilters.model = '';
    }
    
    setSelectedFilters(newFilters);
    
    if (onFilterChange) {
      // Преобразуем фильтры в формат TransportFiltersType
      const convertedFilters: Partial<TransportFiltersType> = {
        vehicleType: selectedCategory as VehicleType,
        priceRange: { min: null, max: null },
        yearRange: { min: null, max: null },
        mileageRange: { min: null, max: null },
        brandId: null
      };
      
      // Преобразуем выбор бренда
      if (newFilters.brand) {
        convertedFilters.brandId = newFilters.brand;
      }
      
      // Преобразуем ценовой диапазон
      if (newFilters.priceFrom || newFilters.priceTo) {
        convertedFilters.priceRange = {
          min: newFilters.priceFrom ? Number(newFilters.priceFrom) : null,
          max: newFilters.priceTo ? Number(newFilters.priceTo) : null
        };
      }
      
      // Преобразуем диапазон годов
      if (newFilters.yearFrom || newFilters.yearTo) {
        convertedFilters.yearRange = {
          min: newFilters.yearFrom ? Number(newFilters.yearFrom) : null,
          max: newFilters.yearTo ? Number(newFilters.yearTo) : null
        };
      }
      
      // Преобразуем диапазон пробега
      if (newFilters.mileageFrom || newFilters.mileageTo) {
        convertedFilters.mileageRange = {
          min: newFilters.mileageFrom ? Number(newFilters.mileageFrom) : null,
          max: newFilters.mileageTo ? Number(newFilters.mileageTo) : null
        };
      }
      
      // Преобразуем тип кузова с правильным типом
      if (newFilters.bodyType) {
        convertedFilters.bodyType = newFilters.bodyType as BodyType;
      }
      
      // Преобразуем трансмиссию с правильным типом
      if (newFilters.transmission) {
        convertedFilters.transmission = newFilters.transmission as TransmissionType;
      }
      
      // Преобразуем тип двигателя с правильным типом
      if (newFilters.engine) {
        convertedFilters.engineType = newFilters.engine as EngineType;
      }
      
      // Преобразуем привод с правильным типом
      if (newFilters.drive) {
        convertedFilters.driveType = newFilters.drive as DriveType;
      }
      
      // Преобразуем состояние
      if (newFilters.condition !== 'all') {
        convertedFilters.condition = newFilters.condition;
      }
      
      // Преобразуем наличие фото
      if (newFilters.withPhoto) {
        convertedFilters.hasPhoto = true;
      }
      
      onFilterChange(convertedFilters);
    }
  };

  // Обработчик смены категории
  const handleCategoryChange = (newCategory: string) => {
    console.log('Changing category to:', newCategory);
    setSelectedCategory(newCategory);
    setSelectedSubcategory(''); // Сброс подкатегории при смене основной категории
    // Сброс фильтров при смене категории
    setSelectedFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      bodyType: '',
      transmission: '',
      engine: '',
      drive: '',
      condition: 'all',
      withPhoto: true,
      mileageFrom: '',
      mileageTo: ''
    });
  };

  // Новый обработчик для подкатегорий
  const handleSubcategoryChange = (subcategoryId: string) => {
    console.log('Changing subcategory to:', subcategoryId);
    setSelectedSubcategory(subcategoryId);
    // Сброс фильтров при смене подкатегории
    setSelectedFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      bodyType: '',
      transmission: '',
      engine: '',
      drive: '',
      condition: 'all',
      withPhoto: true,
      mileageFrom: '',
      mileageTo: ''
    });
  };

  // Обработчик сброса всех фильтров
  const handleReset = () => {
    setSelectedFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      bodyType: '',
      transmission: '',
      engine: '',
      drive: '',
      condition: 'all',
      withPhoto: true,
      mileageFrom: '',
      mileageTo: ''
    });
    
    if (onReset) {
      onReset();
    }
  };

  // Функция для подсчета количества активных фильтров
  const countActiveFilters = () => {
    return Object.entries(selectedFilters).filter(([key, value]) => {
      if (key === 'withPhoto' && value === true) return true;
      if (key === 'condition' && value !== 'all') return true;
      return value !== '' && value !== false;
    }).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          {t('loading.data') || 'Загрузка данных...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">
          {t('error.loading.data') || 'Ошибка загрузки данных'}: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h2>
        
        {/* Выбор категории транспорта */}
        <Tabs 
          defaultValue={selectedCategory} 
          onValueChange={handleCategoryChange} 
          className="mb-6"
        >
          <TabsList className="w-full grid grid-cols-3 mb-4">
            {categories.slice(0, 3).map((category) => (
              <TabsTrigger 
                key={category.id}
                value={category.id} 
                className="text-xs px-2 py-2"
              >
                {t(category.label.ru)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-2">
              {category.subcategories?.map((subcat) => (
                <Button 
                  key={subcat.id}
                  variant={selectedSubcategory === subcat.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleSubcategoryChange(subcat.id)}
                >
                  {t(subcat.label.ru)}
                </Button>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <Separator className="my-4" />
      </div>

      {/* Состояние */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Состояние</label>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={selectedFilters.condition === 'all' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => handleFilterChange('condition', 'all')}
          >
            Все
          </Button>
          <Button 
            variant={selectedFilters.condition === 'new' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => handleFilterChange('condition', 'new')}
          >
            Новый
          </Button>
          <Button 
            variant={selectedFilters.condition === 'used' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => handleFilterChange('condition', 'used')}
          >
            Б/у
          </Button>
        </div>
      </div>

      <Separator />
      
      {/* Марка */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Марка</label>
        <Select 
          value={selectedFilters.brand} 
          onValueChange={(value) => handleFilterChange('brand', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите марку" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все марки</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Модель */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Модель</label>
        <Select 
          value={selectedFilters.model} 
          onValueChange={(value) => handleFilterChange('model', value)}
          disabled={!selectedFilters.brand}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите модель" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все модели</SelectItem>
            {availableModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Цена */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Цена, ₸</label>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="text" 
            placeholder="от" 
            value={selectedFilters.priceFrom}
            onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
            className="text-sm"
          />
          <Input 
            type="text" 
            placeholder="до" 
            value={selectedFilters.priceTo}
            onChange={(e) => handleFilterChange('priceTo', e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
      
      {/* Год */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Год выпуска</label>
        <div className="grid grid-cols-2 gap-2">
          <Select 
            value={selectedFilters.yearFrom} 
            onValueChange={(value) => handleFilterChange('yearFrom', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="от" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">от</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedFilters.yearTo} 
            onValueChange={(value) => handleFilterChange('yearTo', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="до" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">до</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Пробег для б/у */}
      {selectedFilters.condition === 'used' && (
        <>
          <Separator />
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Пробег, км</label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                type="text" 
                placeholder="от" 
                value={selectedFilters.mileageFrom}
                onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
                className="text-sm"
              />
              <Input 
                type="text" 
                placeholder="до" 
                value={selectedFilters.mileageTo}
                onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </>
      )}

      {/* Дополнительные фильтры для легковых автомобилей */}
      {selectedCategory === 'passenger' && (
        <>
          <Separator />
          
          {/* Тип кузова */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Тип кузова</label>
            <Select 
              value={selectedFilters.bodyType} 
              onValueChange={(value) => handleFilterChange('bodyType', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все типы</SelectItem>
                {transportFilterConfig.bodyTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{t(type.label.ru)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Коробка передач */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Коробка передач</label>
            <Select 
              value={selectedFilters.transmission} 
              onValueChange={(value) => handleFilterChange('transmission', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                {transportFilterConfig.transmissions?.map((trans) => (
                  <SelectItem key={trans.id} value={trans.id}>{t(trans.label.ru)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Тип двигателя */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Двигатель</label>
            <Select 
              value={selectedFilters.engine} 
              onValueChange={(value) => handleFilterChange('engine', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                {transportFilterConfig.engineTypes?.map((engine) => (
                  <SelectItem key={engine.id} value={engine.id}>{t(engine.label.ru)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Привод */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Привод</label>
            <Select 
              value={selectedFilters.drive} 
              onValueChange={(value) => handleFilterChange('drive', value)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                {transportFilterConfig.driveTypes?.map((drive) => (
                  <SelectItem key={drive.id} value={drive.id}>{t(drive.label.ru)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      <Separator />

      {/* Только с фото */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="withPhoto" 
          checked={selectedFilters.withPhoto}
          onCheckedChange={(checked) => 
            handleFilterChange('withPhoto', checked === true)
          }
        />
        <label htmlFor="withPhoto" className="text-sm text-gray-700">
          Только с фото
        </label>
      </div>
      
      {/* Кнопки действий */}
      <div className="space-y-3 pt-4">
        {countActiveFilters() > 0 && (
          <Button variant="outline" onClick={handleReset} className="w-full text-sm">
            Сбросить все фильтры
          </Button>
        )}
        
        <Button onClick={onSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
          Показать результаты
        </Button>
      </div>
    </div>
  );
};

export default TransportFilters;
