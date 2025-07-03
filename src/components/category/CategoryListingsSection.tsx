
import { useAppWithTranslations } from '@/stores/useAppStore';
import { ListingCard } from '@/components/ListingCard';

interface CategoryListingsSectionProps {
  adaptedListings: any[];
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
  CardComponent: React.ComponentType<any>;
}

export function CategoryListingsSection({
  adaptedListings,
  loading,
  isInitialized,
  error,
  CardComponent
}: CategoryListingsSectionProps) {
  const { language, t } = useAppWithTranslations();

  return (
    <div className="flex-1">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Ошибка загрузки: {error}
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600">
          {loading && !isInitialized ? 
            (language === 'ru' ? 'Загружаем...' : 'Жүктеу...') :
            `${language === 'ru' ? 'Найдено' : 'Табылды'} ${adaptedListings.length} ${language === 'ru' ? 'объявлений' : 'хабарландыру'}`
          }
        </p>
      </div>
      
      {/* Listings grid - строго 3 колонки */}
      {loading && !isInitialized ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {adaptedListings.map(listing => (
            <CardComponent key={listing.id} listing={listing} />
          ))}
        </div>
      )}
      
      {!loading && adaptedListings.length === 0 && isInitialized && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('noListingsFound', 'Объявлений не найдено')}</p>
          <p className="text-sm text-gray-400 mt-2">
            {language === 'ru' ? 
              'Попробуйте изменить фильтры или выбрать другую категорию' : 
              'Сүзгілерді өзгертіп көріңіз немесе басқа санатты таңдаңыз'
            }
          </p>
        </div>
      )}
    </div>
  );
}
