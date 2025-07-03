import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppStore } from '@/stores/useAppStore';
import TransportFilters from '@/components/transport/TransportFilters';
import TransportCard from '@/components/transport/TransportCard';
import { useTransportFiltersStore } from '@/stores/useTransportFiltersStore';

// Mock data for 20 car listings
const mockTransportListings = [
  {
    id: '1',
    title: 'Toyota Camry 2020',
    price: 12500000,
    currency: 'KZT',
    location: 'Алматы',
    year: 2020,
    mileage: 45000,
    brand: 'Toyota',
    model: 'Camry',
    bodyType: 'Седан',
    engineType: 'Бензин 2.5л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-15',
    seller: {
      name: 'Автосалон "Престиж"',
      type: 'dealer' as const
    }
  },
  {
    id: '2',
    title: 'Honda CR-V 2019',
    price: 11800000,
    currency: 'KZT',
    location: 'Астана',
    year: 2019,
    mileage: 52000,
    brand: 'Honda',
    model: 'CR-V',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 1.5л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-14',
    seller: {
      name: 'Иван Петров',
      type: 'private' as const
    }
  },
  {
    id: '3',
    title: 'Hyundai Elantra 2021',
    price: 9500000,
    currency: 'KZT',
    location: 'Шымкент',
    year: 2021,
    mileage: 28000,
    brand: 'Hyundai',
    model: 'Elantra',
    bodyType: 'Седан',
    engineType: 'Бензин 2.0л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-13',
    seller: {
      name: 'Автосалон "Хендай Центр"',
      type: 'dealer' as const
    }
  },
  {
    id: '4',
    title: 'Mazda CX-5 2020',
    price: 13200000,
    currency: 'KZT',
    location: 'Алматы',
    year: 2020,
    mileage: 38000,
    brand: 'Mazda',
    model: 'CX-5',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.5л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-12',
    seller: {
      name: 'Анна Смирнова',
      type: 'private' as const
    }
  },
  {
    id: '5',
    title: 'Volkswagen Jetta 2018',
    price: 8900000,
    currency: 'KZT',
    location: 'Караганда',
    year: 2018,
    mileage: 67000,
    brand: 'Volkswagen',
    model: 'Jetta',
    bodyType: 'Седан',
    engineType: 'Бензин 1.6л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-11',
    seller: {
      name: 'Автосалон "Фольксваген"',
      type: 'dealer' as const
    }
  },
  {
    id: '6',
    title: 'Kia Sportage 2019',
    price: 10800000,
    currency: 'KZT',
    location: 'Актобе',
    year: 2019,
    mileage: 44000,
    brand: 'Kia',
    model: 'Sportage',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.4л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-10',
    seller: {
      name: 'Дмитрий Козлов',
      type: 'private' as const
    }
  },
  {
    id: '7',
    title: 'BMW X3 2017',
    price: 16500000,
    currency: 'KZT',
    location: 'Алматы',
    year: 2017,
    mileage: 89000,
    brand: 'BMW',
    model: 'X3',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.0л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-09',
    seller: {
      name: 'Автосалон "БМВ Алматы"',
      type: 'dealer' as const
    }
  },
  {
    id: '8',
    title: 'Nissan Qashqai 2020',
    price: 11200000,
    currency: 'KZT',
    location: 'Павлодар',
    year: 2020,
    mileage: 35000,
    brand: 'Nissan',
    model: 'Qashqai',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.0л',
    transmission: 'Вариатор',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-08',
    seller: {
      name: 'Сергей Николаев',
      type: 'private' as const
    }
  },
  {
    id: '9',
    title: 'Audi A4 2019',
    price: 15800000,
    currency: 'KZT',
    location: 'Астана',
    year: 2019,
    mileage: 42000,
    brand: 'Audi',
    model: 'A4',
    bodyType: 'Седан',
    engineType: 'Бензин 2.0л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-07',
    seller: {
      name: 'Автосалон "Ауди Центр"',
      type: 'dealer' as const
    }
  },
  {
    id: '10',
    title: 'Mitsubishi Outlander 2018',
    price: 9800000,
    currency: 'KZT',
    location: 'Тараз',
    year: 2018,
    mileage: 58000,
    brand: 'Mitsubishi',
    model: 'Outlander',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.4л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-06',
    seller: {
      name: 'Елена Васильева',
      type: 'private' as const
    }
  },
  {
    id: '11',
    title: 'Ford Focus 2020',
    price: 8200000,
    currency: 'KZT',
    location: 'Семей',
    year: 2020,
    mileage: 31000,
    brand: 'Ford',
    model: 'Focus',
    bodyType: 'Хэтчбек',
    engineType: 'Бензин 1.6л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-05',
    seller: {
      name: 'Автосалон "Форд"',
      type: 'dealer' as const
    }
  },
  {
    id: '12',
    title: 'Subaru Forester 2019',
    price: 12800000,
    currency: 'KZT',
    location: 'Усть-Каменогорск',
    year: 2019,
    mileage: 46000,
    brand: 'Subaru',
    model: 'Forester',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.5л',
    transmission: 'Вариатор',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-04',
    seller: {
      name: 'Александр Попов',
      type: 'private' as const
    }
  },
  {
    id: '13',
    title: 'Chevrolet Captiva 2017',
    price: 7800000,
    currency: 'KZT',
    location: 'Костанай',
    year: 2017,
    mileage: 72000,
    brand: 'Chevrolet',
    model: 'Captiva',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.4л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-03',
    seller: {
      name: 'Автосалон "Шевроле"',
      type: 'dealer' as const
    }
  },
  {
    id: '14',
    title: 'Renault Duster 2020',
    price: 7900000,
    currency: 'KZT',
    location: 'Петропавловск',
    year: 2020,
    mileage: 29000,
    brand: 'Renault',
    model: 'Duster',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 1.6л',
    transmission: 'Механика',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-02',
    seller: {
      name: 'Мария Иванова',
      type: 'private' as const
    }
  },
  {
    id: '15',
    title: 'Lexus RX 2018',
    price: 22500000,
    currency: 'KZT',
    location: 'Алматы',
    year: 2018,
    mileage: 55000,
    brand: 'Lexus',
    model: 'RX',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 3.5л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2024-01-01',
    seller: {
      name: 'Автосалон "Лексус"',
      type: 'dealer' as const
    }
  },
  {
    id: '16',
    title: 'Peugeot 3008 2019',
    price: 10200000,
    currency: 'KZT',
    location: 'Атырау',
    year: 2019,
    mileage: 41000,
    brand: 'Peugeot',
    model: '3008',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 1.6л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2023-12-31',
    seller: {
      name: 'Олег Сидоров',
      type: 'private' as const
    }
  },
  {
    id: '17',
    title: 'Skoda Kodiaq 2020',
    price: 13800000,
    currency: 'KZT',
    location: 'Актау',
    year: 2020,
    mileage: 33000,
    brand: 'Skoda',
    model: 'Kodiaq',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.0л',
    transmission: 'Автомат',
    driveType: 'Полный',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2023-12-30',
    seller: {
      name: 'Автосалон "Шкода"',
      type: 'dealer' as const
    }
  },
  {
    id: '18',
    title: 'Geely Atlas 2021',
    price: 8600000,
    currency: 'KZT',
    location: 'Кызылорда',
    year: 2021,
    mileage: 22000,
    brand: 'Geely',
    model: 'Atlas',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 1.8л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2023-12-29',
    seller: {
      name: 'Нурлан Абдуллаев',
      type: 'private' as const
    }
  },
  {
    id: '19',
    title: 'Chery Tiggo 7 2020',
    price: 7400000,
    currency: 'KZT',
    location: 'Талдыкорган',
    year: 2020,
    mileage: 36000,
    brand: 'Chery',
    model: 'Tiggo 7',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 1.5л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2023-12-28',
    seller: {
      name: 'Автосалон "Чери"',
      type: 'dealer' as const
    }
  },
  {
    id: '20',
    title: 'Haval H6 2019',
    price: 8800000,
    currency: 'KZT',
    location: 'Туркестан',
    year: 2019,
    mileage: 48000,
    brand: 'Haval',
    model: 'H6',
    bodyType: 'Кроссовер',
    engineType: 'Бензин 2.0л',
    transmission: 'Автомат',
    driveType: 'Передний',
    condition: 'used' as const,
    images: ['/placeholder.svg'],
    createdAt: '2023-12-27',
    seller: {
      name: 'Айдар Касымов',
      type: 'private' as const
    }
  }
];

export default function TransportPage() {
  const { language } = useAppStore();
  const { filters, setFilters, resetFilters, activeFiltersCount } = useTransportFiltersStore();
  
  const [filteredListings, setFilteredListings] = useState(mockTransportListings);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleFavoriteToggle = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  const handleSearch = () => {
    console.log('Search with filters:', filters);
  };
  
  // Apply filters when they change
  useEffect(() => {
    let filtered = [...mockTransportListings];
    
    // Apply brand filter
    if (filters.brandId) {
      filtered = filtered.filter(listing => 
        listing.brand && listing.brand === filters.brandId
      );
    }
    
    // Apply price range filter
    if (filters.priceRange.min) {
      filtered = filtered.filter(listing => 
        listing.price >= filters.priceRange.min!
      );
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(listing => 
        listing.price <= filters.priceRange.max!
      );
    }
    
    // Apply year range filter
    if (filters.yearRange.min) {
      filtered = filtered.filter(listing => 
        listing.year && listing.year >= filters.yearRange.min!
      );
    }
    if (filters.yearRange.max) {
      filtered = filtered.filter(listing => 
        listing.year && listing.year <= filters.yearRange.max!
      );
    }
    
    // Apply mileage range filter
    if (filters.mileageRange.min) {
      filtered = filtered.filter(listing => 
        listing.mileage && listing.mileage >= filters.mileageRange.min!
      );
    }
    if (filters.mileageRange.max) {
      filtered = filtered.filter(listing => 
        listing.mileage && listing.mileage <= filters.mileageRange.max!
      );
    }
    
    // Apply sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'year_asc':
          filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
          break;
        case 'year_desc':
          filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
          break;
        case 'mileage_asc':
          filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
          break;
        case 'mileage_desc':
          filtered.sort((a, b) => (b.mileage || 0) - (a.mileage || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredListings(filtered);
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            {language === 'ru' ? 'Транспорт' : 'Көлік'}
          </h1>
          
          <div className="flex gap-8">
            {/* Левая колонка с фильтрами */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <TransportFilters 
                  onFilterChange={setFilters}
                  onReset={resetFilters}
                  onSearch={handleSearch}
                  activeFiltersCount={activeFiltersCount}
                  vehicleType={filters.vehicleType || 'passenger'}
                  availableFilters={{
                    brands: ['Toyota', 'Honda', 'Hyundai', 'Kia', 'Nissan', 'Mitsubishi', 'Lexus', 'BMW', 'Mercedes-Benz'],
                    models: {
                      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
                      'Honda': ['CR-V', 'Civic', 'Accord'],
                      'Hyundai': ['Tucson', 'Santa Fe', 'Accent'],
                      'Kia': ['Sportage', 'Sorento', 'Cerato'],
                      'Nissan': ['X-Trail', 'Qashqai', 'Patrol'],
                      'Mitsubishi': ['Outlander', 'Pajero', 'ASX'],
                      'Lexus': ['RX', 'LX', 'ES'],
                      'BMW': ['X5', 'X3', '5 Series'],
                      'Mercedes-Benz': ['GLE', 'E-Class', 'C-Class']
                    },
                    years: Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i),
                    bodyTypes: ['Седан', 'Хэтчбек', 'Универсал', 'Кроссовер', 'Внедорожник', 'Минивэн']
                  }}
                />
              </div>
            </div>
            
            {/* Правая колонка с объявлениями */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-medium text-gray-700">
                  Найдено {filteredListings.length} {language === 'ru' ? 'объявлений' : 'хабарландыру'}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  
                  <button 
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Плитка объявлений в 3 колонки */}
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredListings.map(listing => (
                  <TransportCard 
                    key={listing.id}
                    listing={listing}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={favorites.includes(listing.id)}
                    viewMode={viewMode}
                  />
                ))}
                
                {filteredListings.length === 0 && (
                  <div className="col-span-full py-16 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-xl font-medium text-gray-600 mb-2">
                      {language === 'ru' 
                        ? 'Объявления не найдены' 
                        : 'Хабарландырулар табылмады'}
                    </p>
                    <p className="text-gray-500">
                      {language === 'ru' 
                        ? 'Попробуйте изменить параметры поиска' 
                        : 'Іздеу параметрлерін өзгертіп көріңіз'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
