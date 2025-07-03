
import { useState, useEffect } from 'react';
import { useListings } from '@/hooks/useListings';
import { useUniversalFiltersStore } from '@/stores/useUniversalFiltersStore';

export function useCategoryLogic(categoryId: string | undefined) {
  const { getListings, listings, loading, error } = useListings();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
  const { filters } = useUniversalFiltersStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Исправленный маппинг ID категорий для соответствия данным в Supabase
  const getCategoryIdNumber = (categoryStr: string): number | undefined => {
    const categoryMap: Record<string, number> = {
      'electronics': 1, // Изменено обратно на 1 для правильного соответствия
      'fashion': 2,
      'home': 3,
      'transport': 4,
      'property': 5,
      'kids': 6,
      'pharmacy': 7,
      'food': 8,
      'services': 9,
      'pets': 10,
      'hobby': 11,
      'beauty': 12
    };
    return categoryMap[categoryStr];
  };

  // Единственный useEffect для инициализации и загрузки данных
  useEffect(() => {
    if (!categoryId || isInitialized) return;

    const numericCategoryId = getCategoryIdNumber(categoryId);
    console.log(`🔍 Инициализация загрузки объявлений для категории: ${categoryId} (ID: ${numericCategoryId})`);
    
    if (numericCategoryId) {
      // Передаем только минимально необходимые фильтры для инициализации
      const filterParams = {
        categoryId: numericCategoryId
      };
      
      console.log('📋 Параметры фильтрации при инициализации:', filterParams);
      console.log('🎯 Загружаем объявления для категории Electronics (ID: 1)');
      
      // Используем правильные параметры пагинации
      getListings(filterParams, 'newest', 50, 0).finally(() => {
        setIsInitialized(true);
      });
    } else {
      console.warn(`❌ Неизвестная категория: ${categoryId}`);
      setIsInitialized(true);
    }
  }, [categoryId, getListings]);

  // Отдельный useEffect для обновления при изменении фильтров
  useEffect(() => {
    if (!isInitialized || !categoryId) return;

    const numericCategoryId = getCategoryIdNumber(categoryId);
    if (numericCategoryId) {
      const filterParams = {
        categoryId: numericCategoryId,
        priceRange: filters.priceRange,
        condition: filters.condition !== 'any' ? filters.condition : undefined
      };
      
      console.log('🔄 Параметры фильтрации при обновлении:', filterParams);
      // Используем правильные параметры пагинации
      getListings(filterParams, 'newest', 50, 0);
    }
  }, [filters, isInitialized, categoryId, getListings]);

  const handleSearch = () => {
    console.log('🔍 Search triggered with filters:', filters, 'subcategory:', selectedSubcategory);
    if (categoryId) {
      const numericCategoryId = getCategoryIdNumber(categoryId);
      if (numericCategoryId) {
        getListings({
          categoryId: numericCategoryId,
          priceRange: filters.priceRange,
          condition: filters.condition !== 'any' ? filters.condition : undefined
        }, 'newest', 50, 0);
      }
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? undefined : subcategoryId);
  };

  // Адаптируем данные из Supabase к интерфейсу ListingCard
  const adaptedListings = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    imageUrl: listing.images?.[0] || '/placeholder.svg',
    originalPrice: listing.regular_price || 0,
    discountPrice: listing.discount_price || listing.regular_price || 0,
    discount: listing.discount_percent || 0,
    city: (listing as any).cities?.name_ru || 'Не указан',
    categoryId: categoryId || '',
    subcategoryId: '',
    isFeatured: listing.is_premium || false,
    createdAt: listing.created_at,
    views: listing.views || 0
  }));

  console.log(`📊 Отображаем ${adaptedListings.length} адаптированных объявлений для категории ${categoryId}`);
  console.log('📋 Данные объявлений из Supabase:', listings);
  console.log('✨ Адаптированные объявления для отображения:', adaptedListings);

  return {
    listings,
    loading,
    error,
    isInitialized,
    selectedSubcategory,
    adaptedListings,
    handleSearch,
    handleSubcategorySelect,
    getCategoryIdNumber
  };
}
