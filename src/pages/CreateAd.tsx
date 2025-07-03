
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

const CreateAd = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const { toast } = useToast();

  // Получаем все категории из базы данных
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as Category[];
    },
  });

  // Фильтруем основные категории (у которых нет parent_id)
  const mainCategories = categories.filter(cat => !cat.parent_id);
  
  // Фильтруем подкатегории для выбранной категории
  const subcategories = categories.filter(cat => cat.parent_id === selectedCategory);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(''); // Сбрасываем подкатегорию при смене категории
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !selectedCategory) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Здесь будет логика сохранения объявления в базу данных
      console.log('Данные для сохранения:', {
        ...formData,
        category_id: selectedCategory,
        subcategory_id: selectedSubcategory || null,
      });

      toast({
        title: 'Успех',
        description: 'Объявление успешно создано!',
      });

      // Сброс формы
      setFormData({ title: '', description: '', price: '' });
      setSelectedCategory('');
      setSelectedSubcategory('');
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при создании объявления',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Подать объявление
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Заголовок объявления */}
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок объявления *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Введите заголовок вашего объявления"
                  required
                />
              </div>

              {/* Выбор категории */}
              <div className="space-y-2">
                <Label>Категория *</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Выбор подкатегории */}
              {selectedCategory && subcategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Подкатегория</Label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите подкатегорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Цена */}
              <div className="space-y-2">
                <Label htmlFor="price">Цена (тенге)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="Введите цену"
                />
              </div>

              {/* Описание */}
              <div className="space-y-2">
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Опишите ваше объявление подробно"
                  rows={5}
                  required
                />
              </div>

              {/* Кнопка отправки */}
              <Button type="submit" className="w-full">
                Опубликовать объявление
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAd;
