
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { useListings } from '@/hooks/useListings';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { ListingCard } from '@/components/ListingCard';

export default function SubcategoryPage() {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const [searchParams] = useSearchParams();
  const { language, t } = useAppWithTranslations();
  const { getListings, listings, loading, error } = useListings();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Маппинг ID категорий от строковых к числовым
  const getCategoryIdNumber = (categoryStr: string): number | undefined => {
    const categoryMap: Record<string, number> = {
      'electronics': 1,
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
  
  useEffect(() => {
    // Загрузка объявлений из Supabase только один раз при инициализации
    if (!categoryId || isInitialized) return;

    const numericCategoryId = getCategoryIdNumber(categoryId);
    console.log(`Инициализация загрузки объявлений для подкатегории: ${categoryId}/${subcategoryId} (ID: ${numericCategoryId})`);
    
    if (numericCategoryId) {
      // Здесь также можно добавить логику для фильтрации по подкатегории
      // когда бэкенд будет поддерживать эту функциональность
      getListings({ 
        categoryId: numericCategoryId
      }).finally(() => {
        setIsInitialized(true);
      });
    } else {
      console.warn(`Неизвестная категория: ${categoryId}`);
      setIsInitialized(true);
    }
  }, [categoryId, subcategoryId]); // Только categoryId и subcategoryId в зависимостях
  
  // Get category config to display proper names
  const config = categoryId ? getCategoryConfig(categoryId) : null;
  const categoryName = config?.name?.[language] || categoryId || '';
  
  // Determine subcategory name (в реальном приложении нужно получать это из данных подкатегорий)
  const subcategoryName = subcategoryId || '';

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
    subcategoryId: subcategoryId || '',
    isFeatured: listing.is_premium || false,
    createdAt: listing.created_at,
    views: listing.views || 0
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbNavigation 
        items={[
          { label: language === 'ru' ? 'Категории' : 'Санаттар', link: '/category' },
          { label: categoryName, link: `/category/${categoryId}` }
        ]}
        currentPage={subcategoryName}
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">{subcategoryName}</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Ошибка загрузки: {error}
            </div>
          )}
          
          {loading && !isInitialized ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {adaptedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
          
          {!loading && adaptedListings.length === 0 && isInitialized && (
            <div className="text-center py-8">
              <p className="text-gray-500">{t('noListingsFound', 'Объявлений не найдено')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
