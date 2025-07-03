
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/ListingCard';
import { useListings } from '@/hooks/useListings';
import { useAppWithTranslations } from '@/stores/useAppStore';

export function EnhancedFeaturedListings() {
  const { t, language } = useAppWithTranslations();
  const [activeTab, setActiveTab] = useState<string>('featured');
  const { getListings, listings, loading, error } = useListings();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Загружаем объявления только один раз при инициализации
    if (!isInitialized) {
      console.log('🏠 Загружаем объявления для главной страницы...');
      getListings({}, 'newest', 16, 0).finally(() => {
        setIsInitialized(true);
      });
    }
  }, [isInitialized, getListings]);

  // Фильтруем премиум объявления для вкладки "Избранные"
  const featuredListings = listings.filter(listing => listing.is_premium);
  
  // Сортируем по дате создания для вкладки "Новые"
  const latestListings = [...listings].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Адаптируем данные из Supabase к интерфейсу ListingCard
  const adaptListing = (listing: any) => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    imageUrl: listing.images?.[0] || '/placeholder.svg',
    originalPrice: listing.regular_price || 0,
    discountPrice: listing.discount_price || listing.regular_price || 0,
    discount: listing.discount_percent || 0,
    city: listing.cities?.name_ru || 'Не указан',
    categoryId: listing.category_id?.toString() || '',
    subcategoryId: '',
    isFeatured: listing.is_premium || false,
    createdAt: listing.created_at,
    views: listing.views || 0
  });

  if (error) {
    console.error('❌ Error loading listings:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Center the heading and position it above the tabs */}
      <h2 className="text-2xl font-bold mb-4 text-center">{t('listings')}</h2>
      
      <Tabs defaultValue="featured" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="featured">
              <span className="hidden md:inline">{t('featuredAds')}</span>
              <span className="md:hidden">{language === 'ru' ? 'Избранные' : 'Таңдаулы'}</span>
            </TabsTrigger>
            <TabsTrigger value="latest">
              <span className="hidden md:inline">{t('latestAds')}</span>
              <span className="md:hidden">{language === 'ru' ? 'Новые' : 'Жаңа'}</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="link" asChild>
            <Link to="/search">
              <span className="hidden md:inline">{t('allAds')}</span>
              <span className="md:hidden">{language === 'ru' ? 'Все' : 'Барлық'}</span>
            </Link>
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {language === 'ru' ? 'Ошибка загрузки:' : 'Жүктеу қатесі:'} {error}
          </div>
        )}
        
        <TabsContent value="featured" className="mt-0">
          {loading && !isInitialized ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {language === 'ru' ? 'Загружаем данные из Supabase...' : 'Supabase дерегінен деректер жүктеу...'}
              </p>
            </div>
          ) : (
            <>
              {/* Grid with 4 columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredListings.slice(0, 8).map(listing => (
                  <ListingCard key={listing.id} listing={adaptListing(listing)} />
                ))}
              </div>
              
              {!loading && featuredListings.length === 0 && isInitialized && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'ru' ? 'Премиум объявлений не найдено' : 'Премиум хабарландырулар табылмады'}
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="latest" className="mt-0">
          {loading && !isInitialized ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {language === 'ru' ? 'Загружаем данные из Supabase...' : 'Supabase дерегінен деректер жүктеу...'}
              </p>
            </div>
          ) : (
            <>
              {/* Grid with 4 columns */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {latestListings.slice(0, 8).map(listing => (
                  <ListingCard key={listing.id} listing={adaptListing(listing)} />
                ))}
              </div>
              
              {!loading && latestListings.length === 0 && isInitialized && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'ru' ? 'Объявлений не найдено' : 'Хабарландырулар табылмады'}
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
