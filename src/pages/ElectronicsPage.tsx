import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppStore } from '@/stores/useAppStore';
import CategoryFilters from '@/components/shared/CategoryFilters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Моковые данные для электроники
const mockElectronicsListings = [
  {
    id: '1',
    title: 'Apple iPhone 13 Pro 128GB',
    price: 450000,
    currency: 'KZT',
    location: 'Алматы',
    condition: 'Новый',
    brand: 'Apple',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-15',
    seller: {
      name: 'Магазин "ТехноМир"',
      type: 'dealer'
    }
  },
  {
    id: '2',
    title: 'Samsung Galaxy S21 Ultra 256GB',
    price: 380000,
    currency: 'KZT',
    location: 'Астана',
    condition: 'Б/у',
    brand: 'Samsung',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-14',
    seller: {
      name: 'Алексей',
      type: 'private'
    }
  },
  {
    id: '3',
    title: 'Ноутбук Lenovo ThinkPad X1 Carbon',
    price: 650000,
    currency: 'KZT',
    location: 'Алматы',
    condition: 'Б/у',
    brand: 'Lenovo',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-13',
    seller: {
      name: 'Компьютерный центр',
      type: 'dealer'
    }
  },
  {
    id: '4',
    title: 'Sony PlayStation 5 Digital Edition',
    price: 280000,
    currency: 'KZT',
    location: 'Шымкент',
    condition: 'Новый',
    brand: 'Sony',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-12',
    seller: {
      name: 'GameStore',
      type: 'dealer'
    }
  }
];

export function ElectronicsPage() {
  const { language } = useAppStore();
  const [filteredListings, setFilteredListings] = useState(mockElectronicsListings);
  const [activeFilters, setActiveFilters] = useState({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Обработчик изменения фильтров
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    
    // Подсчет количества активных фильтров
    let count = 0;
    if (filters.subcategory) count++;
    if (filters.priceFrom) count++;
    if (filters.priceTo) count++;
    if (filters.region) count++;
    if (filters.city) count++;
    if (filters.condition) count++;
    if (filters.brand) count++;
    if (filters.withPhoto) count++;
    if (filters.withDiscount) count++;
    if (filters.withDelivery) count++;
    if (filters.customFilters && Object.keys(filters.customFilters).length > 0) {
      count += Object.keys(filters.customFilters).length;
    }
    
    setActiveFiltersCount(count);
    
    // Применение фильтров к листингам
    let filtered = [...mockElectronicsListings];
    
    // Фильтрация по цене
    if (filters.priceFrom) {
      filtered = filtered.filter(item => item.price >= parseInt(filters.priceFrom));
    }
    if (filters.priceTo) {
      filtered = filtered.filter(item => item.price <= parseInt(filters.priceTo));
    }
    
    // Фильтрация по региону
    if (filters.region) {
      filtered = filtered.filter(item => item.location.includes(filters.region));
    }
    
    // Фильтрация по состоянию
    if (filters.condition) {
      filtered = filtered.filter(item => item.condition === filters.condition);
    }
    
    // Фильтрация по бренду
    if (filters.brand) {
      filtered = filtered.filter(item => item.brand === filters.brand);
    }
    
    setFilteredListings(filtered);
  };
  
  // Обработчик сброса фильтров
  const handleReset = () => {
    setActiveFilters({});
    setActiveFiltersCount(0);
    setFilteredListings(mockElectronicsListings);
  };
  
  // Обработчик поиска
  const handleSearch = () => {
    console.log('Поиск с фильтрами:', activeFilters);
    // В реальном приложении здесь был бы запрос к API
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            {language === 'ru' ? 'Электроника' : 'Электроника'}
          </h1>
          
          <div className="flex gap-8">
            {/* Левая колонка с фильтрами */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <CategoryFilters 
                  category="electronics"
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  onSearch={handleSearch}
                  activeFiltersCount={activeFiltersCount}
                  availableFilters={{
                    subcategories: [
                      'Смартфоны', 'Ноутбуки', 'Планшеты', 'Компьютеры', 
                      'Аудиотехника', 'Телевизоры', 'Фотоаппараты', 'Игровые приставки'
                    ],
                    regions: ['Алматы', 'Астана', 'Шымкент', 'Актобе', 'Караганда', 'Тараз'],
                    cities: {
                      'Алматы': ['Алматы'],
                      'Астана': ['Астана'],
                      'Шымкент': ['Шымкент'],
                      'Актобе': ['Актобе'],
                      'Караганда': ['Караганда', 'Темиртау'],
                      'Тараз': ['Тараз']
                    },
                    conditions: ['Новый', 'Б/у'],
                    brands: ['Apple', 'Samsung', 'Xiaomi', 'Lenovo', 'Sony', 'LG', 'Huawei', 'Asus'],
                    customFilters: {
                      'Память': ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
                      'Гарантия': ['Есть', 'Нет']
                    }
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
              </div>
              
              {/* Плитка объявлений */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(listing => (
                  <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Изображение товара
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{listing.title}</h3>
                      <p className="text-xl font-bold text-blue-600 mb-2">
                        {listing.price.toLocaleString()} {listing.currency}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{listing.location}</span>
                        <span className="text-sm text-gray-500">{listing.condition}</span>
                      </div>
                    </div>
                  </Card>
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

export default ElectronicsPage;
