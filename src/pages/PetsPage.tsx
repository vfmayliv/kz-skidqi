import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppStore } from '@/stores/useAppStore';
import CategoryFilters from '@/components/shared/CategoryFilters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Моковые данные для домашних животных
const mockPetsListings = [
  {
    id: '1',
    title: 'Щенки лабрадора ретривера',
    price: 150000,
    currency: 'KZT',
    location: 'Алматы',
    breed: 'Лабрадор ретривер',
    age: '2 месяца',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-15',
    seller: {
      name: 'Питомник "Золотая лапа"',
      type: 'dealer'
    }
  },
  {
    id: '2',
    title: 'Шотландский вислоухий котенок',
    price: 80000,
    currency: 'KZT',
    location: 'Астана',
    breed: 'Шотландская вислоухая',
    age: '3 месяца',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-14',
    seller: {
      name: 'Марина',
      type: 'private'
    }
  },
  {
    id: '3',
    title: 'Аквариум с рыбками и оборудованием',
    price: 45000,
    currency: 'KZT',
    location: 'Алматы',
    category: 'Аквариумистика',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-13',
    seller: {
      name: 'Александр',
      type: 'private'
    }
  },
  {
    id: '4',
    title: 'Клетка для попугая большая',
    price: 18000,
    currency: 'KZT',
    location: 'Шымкент',
    category: 'Товары для птиц',
    images: ['/placeholder.svg'],
    createdAt: '2024-01-12',
    seller: {
      name: 'ЗооМаркет',
      type: 'dealer'
    }
  }
];

export function PetsPage() {
  const { language } = useAppStore();
  const [filteredListings, setFilteredListings] = useState(mockPetsListings);
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
    let filtered = [...mockPetsListings];
    
    // Фильтрация по подкатегории
    if (filters.subcategory) {
      filtered = filtered.filter(item => {
        if (item.category) return item.category === filters.subcategory;
        if (filters.subcategory === 'Собаки' && item.breed && item.breed.includes('лабрадор')) return true;
        if (filters.subcategory === 'Кошки' && item.breed && item.breed.includes('Шотландская')) return true;
        return false;
      });
    }
    
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
    
    // Фильтрация по породе (если есть в customFilters)
    if (filters.customFilters && filters.customFilters['Порода']) {
      filtered = filtered.filter(item => item.breed === filters.customFilters['Порода']);
    }
    
    // Фильтрация по возрасту (если есть в customFilters)
    if (filters.customFilters && filters.customFilters['Возраст']) {
      filtered = filtered.filter(item => item.age === filters.customFilters['Возраст']);
    }
    
    setFilteredListings(filtered);
  };
  
  // Обработчик сброса фильтров
  const handleReset = () => {
    setActiveFilters({});
    setActiveFiltersCount(0);
    setFilteredListings(mockPetsListings);
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
            {language === 'ru' ? 'Домашние животные' : 'Үй жануарлары'}
          </h1>
          
          <div className="flex gap-8">
            {/* Левая колонка с фильтрами */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <CategoryFilters 
                  category="pets"
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                  onSearch={handleSearch}
                  activeFiltersCount={activeFiltersCount}
                  availableFilters={{
                    subcategories: [
                      'Собаки', 'Кошки', 'Птицы', 'Грызуны', 
                      'Рыбки', 'Рептилии', 'Сельскохозяйственные животные',
                      'Товары для животных', 'Аквариумистика', 'Товары для птиц'
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
                    customFilters: {
                      'Порода': ['Лабрадор ретривер', 'Немецкая овчарка', 'Йоркширский терьер', 'Шотландская вислоухая', 'Мейн-кун', 'Сфинкс'],
                      'Возраст': ['До 1 месяца', '1-3 месяца', '3-6 месяцев', '6-12 месяцев', '1-3 года', 'Старше 3 лет'],
                      'Пол': ['Мальчик', 'Девочка']
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
                        Изображение
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2">{listing.title}</h3>
                      <p className="text-xl font-bold text-blue-600 mb-2">
                        {listing.price.toLocaleString()} {listing.currency}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{listing.location}</span>
                        {listing.breed && (
                          <span className="text-sm text-gray-500">{listing.breed}</span>
                        )}
                      </div>
                      {listing.age && (
                        <div className="mt-2">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            Возраст: {listing.age}
                          </span>
                        </div>
                      )}
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

export default PetsPage;
