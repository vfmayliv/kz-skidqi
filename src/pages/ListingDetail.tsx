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
import { mockListings } from '@/data/mockListings';
import { Listing } from '@/types/listingType';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { parseListingUrl, findListingBySlug, transliterate, getCategoryIdBySlug } from '@/utils/urlUtils';
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
  
  // Handle case where params might be undefined
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
      
      // Если есть SEO URL (category + title slug)
      if (categorySlug && titleSlug) {
        console.log('🔍 Поиск по SEO URL:', { categorySlug, titleSlug });
        
        try {
          // Получаем ID категории по slug
          const categoryId = getCategoryIdBySlug(categorySlug);
          console.log('📁 Найден ID категории:', { categorySlug, categoryId });

          if (categoryId) {
            // Ищем объявления в этой категории
            const { data: listings, error } = await supabase
              .from('listings')
              .select(`
                *,
                cities(name_ru, name_kz),
                categories(name_ru, name_kz)
              `)
              .eq('category_id', categoryId)
              .eq('status', 'active');

            if (error) {
              console.error('❌ Ошибка при поиске объявлений:', error);
            } else if (listings) {
              console.log('📋 Найдено объявлений в категории:', listings.length);
              console.log('📋 Первые 3 объявления:', listings.slice(0, 3));
              
              // Ищем объявление по совпадению slug
              for (const listingItem of listings) {
                const listingTitleSlug = transliterate(listingItem.title || '');
                console.log('🔎 Сравниваем slugs:', { 
                  generated: listingTitleSlug, 
                  target: titleSlug,
                  title: listingItem.title,
                  match: listingTitleSlug === titleSlug
                });
                
                if (listingTitleSlug === titleSlug) {
                  // Преобразуем данные из Supabase в формат Listing
                  targetListing = {
                    id: listingItem.id,
                    title: listingItem.title,
                    description: listingItem.description || '',
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
                    seller: {
                      name: 'Продавец',
                      phone: listingItem.phone || '+7 XXX XXX XX XX',
                      rating: 4.8,
                      reviews: 25,
                      memberSince: '2022',
                      response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
                      lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
                    },
                    coordinates: undefined
                  };
                  
                  console.log('✅ Найдено объявление по slug:', targetListing);
                  break;
                }
              }
              
              // Если точное совпадение не найдено, ищем частичное
              if (!targetListing && listings.length > 0) {
                console.log('🔄 Поиск частичного совпадения...');
                for (const listingItem of listings) {
                  const listingTitleSlug = transliterate(listingItem.title || '');
                  // Проверяем частичное совпадение (первые 20 символов)
                  if (listingTitleSlug.includes(titleSlug.slice(0, 20)) || titleSlug.includes(listingTitleSlug.slice(0, 20))) {
                    targetListing = {
                      id: listingItem.id,
                      title: listingItem.title,
                      description: listingItem.description || '',
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
                      seller: {
                        name: 'Продавец',
                        phone: listingItem.phone || '+7 XXX XXX XX XX',
                        rating: 4.8,
                        reviews: 25,
                        memberSince: '2022',
                        response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
                        lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
                      },
                      coordinates: undefined
                    };
                    console.log('✅ Найдено объявление по частичному совпадению:', targetListing);
                    break;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('❌ Ошибка при поиске объявления:', error);
        }

        // Fallback к мок данным, если не найдено в Supabase
        if (!targetListing) {
          console.log('🔄 Fallback к мок данным');
          const mockListing = findListingBySlug(mockListings, categorySlug, titleSlug);
          if (mockListing) {
            targetListing = {
              ...mockListing,
              seller: {
                name: mockListing.seller?.name || 'Продавец',
                phone: mockListing.seller?.phone || '+7 XXX XXX XX XX',
                rating: mockListing.seller?.rating || 4.8,
                reviews: mockListing.seller?.reviews || 25,
                memberSince: '2022',
                response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
                lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
              }
            };
          }
        }
      } 
      // Если есть старый формат URL с ID
      else if (listingId) {
        console.log('🔍 Поиск по ID:', listingId);
        
        // Пробуем найти в Supabase
        const supabaseListing = await getListingById(listingId);
        if (supabaseListing) {
          targetListing = {
            ...supabaseListing,
            seller: {
              name: 'Продавец',
              phone: supabaseListing.phone || '+7 XXX XXX XX XX',
              rating: 4.8,
              reviews: 25,
              memberSince: '2022',
              response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
              lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
            }
          };
        } else {
          // Fallback к мок данным
          const mockListing = mockListings.find(item => item.id === listingId);
          if (mockListing) {
            targetListing = {
              ...mockListing,
              seller: {
                name: mockListing.seller?.name || 'Продавец',
                phone: mockListing.seller?.phone || '+7 XXX XXX XX XX',
                rating: mockListing.seller?.rating || 4.8,
                reviews: mockListing.seller?.reviews || 25,
                memberSince: '2022',
                response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
                lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
              }
            };
          }
        }
      }

      if (!targetListing) {
        console.error('❌ Объявление не найдено');
        return;
      }

      console.log('✅ Загружено объявление:', targetListing);
      
      // Устанавливаем реальные данные продавца
      const listingWithRealSeller = {
        ...targetListing,
        seller: {
          name: 'Skidqi',
          phone: '+7 777 123 45 67',
          rating: 4.9,
          reviews: 156,
          memberSince: '2022',
          response: language === 'ru' ? 'Отвечает обычно в течении часа' : 'Әдетте бір сағат ішінде жауап береді',
          lastOnline: language === 'ru' ? 'Был онлайн сегодня' : 'Бүгін онлайн болды'
        }
      };
      
      setListing(listingWithRealSeller);
      
      // Найти похожие объявления
      const similar = mockListings
        .filter(item => item.categoryId === targetListing.categoryId && item.id !== targetListing.id)
        .slice(0, 4);
      setSimilarListings(similar);
      
      // Построить breadcrumbs
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

  // Utility functions for formatting
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
  
  // Event handlers
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title[language] || '',
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

  // Extract and ensure title and description are strings
  const title = typeof listing.title === 'string' 
    ? listing.title 
    : (listing.title && typeof listing.title === 'object' && listing.title[language]) 
      ? listing.title[language] 
      : '';
      
  const city = typeof listing.city === 'string' 
    ? listing.city 
    : (listing.city && typeof listing.city === 'object' && listing.city[language]) 
      ? listing.city[language] 
      : '';
      
  const descriptionText = listing.description ? 
    (typeof listing.description === 'string' ? listing.description : 
     (typeof listing.description === 'object' ? listing.description[language] || '' : '')) 
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
          {/* Mobile layout */}
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

          {/* Desktop layout */}
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
          
          <div className="mt-8">
            <SimilarListings 
              listings={similarListings}
              language={language}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
