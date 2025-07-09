
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { ListingGallery } from '@/components/listing-detail/ListingGallery';
import { ListingHeader } from '@/components/listing-detail/ListingHeader';
import { ListingPrice } from '@/components/listing-detail/ListingPrice';
import { ListingDescription } from '@/components/listing-detail/ListingDescription';
import { ListingStats } from '@/components/listing-detail/ListingStats';
import { SellerInfo } from '@/components/listing-detail/SellerInfo';
import { SafetyTips } from '@/components/listing-detail/SafetyTips';
import { SimilarListings } from '@/components/listing-detail/SimilarListings';
import LocationMap from '@/components/listing-detail/LocationMap';
import { Listing } from '@/types/listingType';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { transliterate, getCategoryIdBySlug } from '@/utils/urlUtils';
import { useListings } from '@/hooks/useListings';
import { supabase } from '@/integrations/supabase/client';

// Extended seller interface
interface ExtendedSeller {
  name: string;
  phone: string;
  rating: number;
  reviews?: number;
  memberSince: string;
  response: string;
  lastOnline: string;
}

// Extended listing interface
interface ExtendedListing extends Omit<Listing, 'seller'> {
  seller: ExtendedSeller;
  images?: string[];
}

export default function ListingDetail() {
  const params = useParams<{ 
    id?: string; 
    categorySlug?: string; 
    titleSlug?: string; 
  }>();
  
  const { id: listingId, categorySlug, titleSlug } = params || {};
  const { language } = useAppWithTranslations();
  const location = useLocation();
  const [listing, setListing] = useState<ExtendedListing | null>(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState<{label: string, link?: string}[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const { getListingById } = useListings();

  useEffect(() => {
    const loadListing = async () => {
      let targetListing = null;
      
      console.log('🔍 Загрузка объявления:', { listingId, categorySlug, titleSlug });
      
      // Если есть SEO URL (category + title slug)
      if (categorySlug && titleSlug) {
        console.log('🔍 Поиск по SEO URL:', { categorySlug, titleSlug });
        
        try {
          // Сначала попробуем найти по категории slug
          let categoryId = getCategoryIdBySlug(categorySlug);
          
          // Если не нашли точное соответствие, попробуем найти в базе по всем активным объявлениям
          if (!categoryId) {
            console.log('📁 Категория не найдена в маппинге, ищем по всем объявлениям');
            const { data: allListings, error } = await supabase
              .from('listings')
              .select(`
                *,
                cities(name_ru, name_kz),
                categories(name_ru, name_kz)
              `)
              .eq('status', 'active');

            if (!error && allListings) {
              console.log('📋 Найдено объявлений для поиска:', allListings.length);
              
              // Ищем объявление по совпадению slug заголовка
              for (const listingItem of allListings) {
                const listingTitleSlug = transliterate(listingItem.title || '');
                console.log('🔎 Сравниваем slugs:', { 
                  generated: listingTitleSlug, 
                  target: titleSlug,
                  title: listingItem.title,
                  match: listingTitleSlug === titleSlug
                });
                
                if (listingTitleSlug === titleSlug) {
                  targetListing = {
                    id: listingItem.id,
                    userId: listingItem.user_id,
                    title: listingItem.title,
                    description: listingItem.description || '',
                    price: listingItem.regular_price || 0,
                    originalPrice: listingItem.regular_price || 0,
                    discountPrice: listingItem.discount_price || listingItem.regular_price || 0,
                    discount: listingItem.discount_percent || 0,
                    city: listingItem.cities?.name_ru || '',
                    categoryId: listingItem.category_id?.toString() || '4',
                    createdAt: listingItem.created_at,
                    imageUrl: listingItem.images?.[0] || '/placeholder.svg',
                    images: listingItem.images || ['/placeholder.svg'],
                    isFeatured: listingItem.is_premium || false,
                    views: listingItem.views || 0,
                    regionId: listingItem.region_id?.toString() || '',
                    cityId: listingItem.city_id?.toString() || '',
                    microdistrictId: listingItem.microdistrict_id?.toString() || '',
                    seller: {
                      name: 'Skidqi',
                      phone: listingItem.phone || '+7 777 123 45 67',
                      rating: 4.9,
                      reviews: 156,
                      memberSince: '2022',
                      response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
                      lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
                    },
                    coordinates: undefined
                  };
                  
                  console.log('✅ Найдено объявление:', targetListing);
                  break;
                }
              }
            }
          } else {
            // Стандартный поиск по categoryId
            const { data: listings, error } = await supabase
              .from('listings')
              .select(`
                *,
                cities(name_ru, name_kz),
                categories(name_ru, name_kz)
              `)
              .eq('category_id', categoryId)
              .eq('status', 'active');

            if (!error && listings && listings.length > 0) {
              console.log('📋 Найдено объявлений в категории:', listings.length);
              
              // Ищем объявление по совпадению slug
              for (const listingItem of listings) {
                const listingTitleSlug = transliterate(listingItem.title || '');
                console.log('🔎 Сравниваем slugs в категории:', { 
                  generated: listingTitleSlug, 
                  target: titleSlug,
                  title: listingItem.title,
                  match: listingTitleSlug === titleSlug
                });
                
                if (listingTitleSlug === titleSlug) {
                  targetListing = {
                    id: listingItem.id,
                    userId: listingItem.user_id,
                    title: listingItem.title,
                    description: listingItem.description || '',
                    price: listingItem.regular_price || 0,
                    originalPrice: listingItem.regular_price || 0,
                    discountPrice: listingItem.discount_price || listingItem.regular_price || 0,
                    discount: listingItem.discount_percent || 0,
                    city: listingItem.cities?.name_ru || '',
                    categoryId: categorySlug,
                    createdAt: listingItem.created_at,
                    imageUrl: listingItem.images?.[0] || '/placeholder.svg',
                    images: listingItem.images || ['/placeholder.svg'],
                    isFeatured: listingItem.is_premium || false,
                    views: listingItem.views || 0,
                    regionId: listingItem.region_id?.toString() || '',
                    cityId: listingItem.city_id?.toString() || '',
                    microdistrictId: listingItem.microdistrict_id?.toString() || '',
                    seller: {
                      name: 'Skidqi',
                      phone: listingItem.phone || '+7 777 123 45 67',
                      rating: 4.9,
                      reviews: 156,
                      memberSince: '2022',
                      response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
                      lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
                    },
                    coordinates: undefined
                  };
                  
                  console.log('✅ Найдено объявление в категории:', targetListing);
                  break;
                }
              }
            }
          }
        } catch (error) {
          console.error('❌ Ошибка при поиске объявления:', error);
        }
      } 
      // Если есть старый формат URL с ID
      else if (listingId) {
        console.log('🔍 Поиск по ID:', listingId);
        
        const supabaseListing = await getListingById(listingId);
        if (supabaseListing) {
          targetListing = {
            ...supabaseListing,
            seller: {
              name: 'Skidqi',
              phone: supabaseListing.phone || '+7 777 123 45 67',
              rating: 4.9,
              reviews: 156,
              memberSince: '2022',
              response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
              lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
            }
          };
        }
      }

      if (!targetListing) {
        console.error('❌ Объявление не найдено');
        return;
      }

      console.log('✅ Итоговое объявление:', targetListing);
      setListing(targetListing);
      
      // Найти похожие объявления в Supabase
      if (targetListing.categoryId) {
        try {
          const categoryId = getCategoryIdBySlug(targetListing.categoryId);
          if (categoryId) {
            const { data: similarData, error } = await supabase
              .from('listings')
              .select('*')
              .eq('category_id', categoryId)
              .eq('status', 'active')
              .neq('id', targetListing.id)
              .limit(4);

            if (!error && similarData) {
              const similar = similarData.map(item => ({
                id: item.id,
                userId: item.user_id,
                title: item.title,
                description: item.description || '',
                price: item.regular_price || 0,
                originalPrice: item.regular_price || 0,
                discountPrice: item.discount_price || item.regular_price || 0,
                discount: item.discount_percent || 0,
                city: item.city_id?.toString() || '',
                categoryId: targetListing.categoryId,
                createdAt: item.created_at,
                imageUrl: item.images?.[0] || '/placeholder.svg',
                views: item.views || 0,
                isFeatured: item.is_premium || false,
                regionId: item.region_id?.toString() || '',
                cityId: item.city_id?.toString() || '',
                microdistrictId: item.microdistrict_id?.toString() || ''
              }));
              setSimilarListings(similar);
            }
          }
        } catch (error) {
          console.error('❌ Ошибка при поиске похожих объявлений:', error);
        }
      }
      
      const categoryItems = [];
      
      categoryItems.push({
        label: language === 'ru' ? 'Главная' : 'Басты бет',
        link: '/'
      });
      
      if (targetListing.categoryId) {
        const categoryConfig = getCategoryConfig(targetListing.categoryId);
        if (categoryConfig) {
          categoryItems.push({
            label: categoryConfig.name[language] || targetListing.categoryId,
            link: `/category/${targetListing.categoryId}`
          });
        }
      }
      
      setBreadcrumbItems(categoryItems);
    };

    loadListing();
  }, [listingId, categorySlug, titleSlug, language, location.pathname, getListingById]);

  const formatPrice = (price: number) => {
    if (price === 0) return language === 'ru' ? 'Бесплатно' : 'Тегін';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₸';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: typeof listing?.title === 'string' ? listing.title : '',
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    }
  };
  
  const handleShowPhone = () => {
    setIsPhoneVisible(true);
  };

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            {language === 'ru' ? 'Объявление не найдено' : 'Хабарландыру табылмады'}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = typeof listing.title === 'string' 
    ? listing.title 
    : '';
      
  const city = typeof listing.city === 'string' 
    ? listing.city 
    : '';
      
  const descriptionText = listing.description ? 
    (typeof listing.description === 'string' ? listing.description : '') 
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <BreadcrumbNavigation 
        items={breadcrumbItems} 
        currentPage={title} 
      />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="lg:hidden space-y-4">
            <ListingGallery 
              images={listing.images || [listing.imageUrl]} 
              title={title}
              language={language}
            />
            <ListingHeader 
              title={title}
              city={city}
              createdAt={listing.createdAt}
              views={listing.views}
              id={listing.id}
              price={listing.discountPrice}
              originalPrice={listing.originalPrice}
              discount={listing.discount}
              isFeatured={listing.isFeatured || false}
              isFavorite={isFavorite}
              language={language}
              formatPrice={formatPrice}
              formatDate={formatDate}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
              isMobile={true}
            />
            <ListingPrice 
              price={listing.discountPrice}
              originalPrice={listing.originalPrice}
              discount={listing.discount}
              formatPrice={formatPrice}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
            <SellerInfo 
              name={listing.seller.name}
              phone={listing.seller.phone}
              rating={listing.seller.rating}
              deals={listing.seller.reviews || 156}
              memberSince={listing.seller.memberSince}
              response={listing.seller.response}
              lastOnline={listing.seller.lastOnline}
              isPhoneVisible={isPhoneVisible}
              language={language}
              onShowPhone={handleShowPhone}
              isMobile={true}
            />
            <ListingDescription 
              description={descriptionText} 
              language={language}
            />
            <ListingStats 
              createdAt={listing.createdAt}
              id={listing.id}
              views={listing.views}
              isFavorite={isFavorite}
              language={language}
              formatDate={formatDate}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
              isMobile={true}
            />
            <LocationMap 
              city={city} 
              coordinates={listing.coordinates}
              language={language}
            />
            <SafetyTips language={language} />
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <ListingGallery 
                images={listing.images || [listing.imageUrl]} 
                title={title}
                language={language}
              />
              <ListingHeader 
                title={title}
                city={city}
                createdAt={listing.createdAt}
                views={listing.views}
                id={listing.id}
                price={listing.discountPrice}
                originalPrice={listing.originalPrice}
                discount={listing.discount}
                isFeatured={listing.isFeatured || false}
                isFavorite={isFavorite}
                language={language}
                formatPrice={formatPrice}
                formatDate={formatDate}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
              <ListingDescription 
                description={descriptionText} 
                language={language}
              />
            </div>
            <div className="space-y-6">
              <SellerInfo 
                name={listing.seller.name}
                phone={listing.seller.phone}
                rating={listing.seller.rating}
                deals={listing.seller.reviews || 156}
                memberSince={listing.seller.memberSince}
                response={listing.seller.response}
                lastOnline={listing.seller.lastOnline}
                isPhoneVisible={isPhoneVisible}
                language={language}
                onShowPhone={handleShowPhone}
              />
              <SafetyTips language={language} />
              <LocationMap 
                city={city} 
                coordinates={listing.coordinates}
                language={language}
              />
              <ListingStats 
                createdAt={listing.createdAt}
                id={listing.id}
                views={listing.views}
                isFavorite={isFavorite}
                language={language}
                formatDate={formatDate}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
            </div>
          </div>
          
          {similarListings.length > 0 && (
            <div className="mt-8">
              <SimilarListings 
                listings={similarListings}
                language={language}
                formatPrice={formatPrice}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
