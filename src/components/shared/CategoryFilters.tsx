import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export interface CategoryFiltersProps {
  category: string;
  onFilterChange?: (filters: any) => void;
  onReset?: () => void;
  onSearch?: () => void;
  activeFiltersCount?: number;
  availableFilters?: {
    subcategories?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    regions?: string[];
    cities?: Record<string, string[]>;
    conditions?: string[];
    brands?: string[];
    customFilters?: Record<string, string[]>;
  };
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  category,
  onFilterChange,
  onReset,
  onSearch,
  activeFiltersCount = 0,
  availableFilters
}) => {
  const { t } = useTranslation();
  
  // Базовые фильтры, общие для всех категорий
  const [filters, setFilters] = useState({
    subcategory: '',
    priceFrom: '',
    priceTo: '',
    region: '',
    city: '',
    condition: '',
    brand: '',
    withPhoto: true,
    withDiscount: false,
    withDelivery: false,
    sortBy: 'newest',
    // Дополнительные фильтры для конкретных категорий
    customFilters: {} as Record<string, string>
  });
  
  // Обработчик изменения фильтров
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Обработчик сброса всех фильтров
  const handleReset = () => {
    setFilters({
      subcategory: '',
      priceFrom: '',
      priceTo: '',
      region: '',
      city: '',
      condition: '',
      brand: '',
      withPhoto: true,
      withDiscount: false,
      withDelivery: false,
      sortBy: 'newest',
      customFilters: {}
    });
    
    if (onReset) {
      onReset();
    }
  };
  
  // Обработчик поиска
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };
  
  // Получаем доступные города для выбранного региона
  const availableCities = filters.region && availableFilters?.cities 
    ? availableFilters.cities[filters.region] || [] 
    : [];
  
  // Получаем заголовок категории
  const getCategoryTitle = () => {
    const titles: Record<string, { ru: string, kz: string }> = {
      'beauty': { ru: 'Красота и здоровье', kz: 'Сұлулық және денсаулық' },
      'electronics': { ru: 'Электроника', kz: 'Электроника' },
      'fashion': { ru: 'Одежда и аксессуары', kz: 'Киім және аксессуарлар' },
      'food': { ru: 'Еда', kz: 'Тамақ' },
      'free': { ru: 'Бесплатно', kz: 'Тегін' },
      'hobby': { ru: 'Хобби', kz: 'Хобби' },
      'home': { ru: 'Дом и сад', kz: 'Үй және бақша' },
      'kids': { ru: 'Детские товары', kz: 'Балалар тауарлары' },
      'pets': { ru: 'Домашние животные', kz: 'Үй жануарлары' },
      'pharmacy': { ru: 'Аптека', kz: 'Дәріхана' },
      'services': { ru: 'Услуги', kz: 'Қызметтер' }
    };
    
    return titles[category] || { ru: category, kz: category };
  };
  
  const categoryTitle = getCategoryTitle();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t('filters', 'Фильтры')}
        </h3>
        
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            {t('reset', 'Сбросить')} ({activeFiltersCount})
          </Button>
        )}
      </div>
      
      <Separator />
      
      {/* Подкатегории */}
      {availableFilters?.subcategories && availableFilters.subcategories.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">{t('subcategory', 'Подкатегория')}</h4>
          <Select
            value={filters.subcategory}
            onValueChange={(value) => handleFilterChange('subcategory', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('select_subcategory', 'Выберите подкатегорию')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t('all_subcategories', 'Все подкатегории')}
              </SelectItem>
              {availableFilters.subcategories.map((subcategory) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Цена */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">{t('price', 'Цена')}</h4>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder={t('from', 'от')}
              value={filters.priceFrom}
              onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder={t('to', 'до')}
              value={filters.priceTo}
              onChange={(e) => handleFilterChange('priceTo', e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Регион и город */}
      {availableFilters?.regions && availableFilters.regions.length > 0 && (
        <Accordion type="single" collapsible defaultValue="region">
          <AccordionItem value="region" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <h4 className="font-medium text-sm">{t('location', 'Местоположение')}</h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Select
                  value={filters.region}
                  onValueChange={(value) => {
                    handleFilterChange('region', value);
                    handleFilterChange('city', ''); // Сбрасываем город при смене региона
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('select_region', 'Выберите регион')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      {t('all_regions', 'Все регионы')}
                    </SelectItem>
                    {availableFilters.regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {filters.region && availableCities.length > 0 && (
                  <Select
                    value={filters.city}
                    onValueChange={(value) => handleFilterChange('city', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('select_city', 'Выберите город')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">
                        {t('all_cities', 'Все города')}
                      </SelectItem>
                      {availableCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Состояние товара */}
      {availableFilters?.conditions && availableFilters.conditions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">{t('condition', 'Состояние')}</h4>
          <Select
            value={filters.condition}
            onValueChange={(value) => handleFilterChange('condition', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('select_condition', 'Выберите состояние')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t('any_condition', 'Любое состояние')}
              </SelectItem>
              {availableFilters.conditions.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Бренд */}
      {availableFilters?.brands && availableFilters.brands.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm">{t('brand', 'Бренд')}</h4>
          <Select
            value={filters.brand}
            onValueChange={(value) => handleFilterChange('brand', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('select_brand', 'Выберите бренд')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {t('all_brands', 'Все бренды')}
              </SelectItem>
              {availableFilters.brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Дополнительные фильтры для конкретных категорий */}
      {availableFilters?.customFilters && Object.keys(availableFilters.customFilters).length > 0 && (
        <Accordion type="single" collapsible defaultValue="custom">
          <AccordionItem value="custom" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline">
              <h4 className="font-medium text-sm">{t('additional_filters', 'Дополнительные фильтры')}</h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {Object.entries(availableFilters.customFilters).map(([filterName, options]) => (
                  <div key={filterName} className="space-y-2">
                    <h5 className="text-sm">{filterName}</h5>
                    <Select
                      value={filters.customFilters[filterName] || ''}
                      onValueChange={(value) => {
                        const newCustomFilters = { ...filters.customFilters, [filterName]: value };
                        handleFilterChange('customFilters', newCustomFilters);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('select', 'Выберите')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {t('all', 'Все')}
                        </SelectItem>
                        {options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Дополнительные опции */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="withPhoto" 
            checked={filters.withPhoto}
            onCheckedChange={(checked) => handleFilterChange('withPhoto', checked)}
          />
          <label htmlFor="withPhoto" className="text-sm cursor-pointer">
            {t('with_photo', 'Только с фото')}
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="withDiscount" 
            checked={filters.withDiscount}
            onCheckedChange={(checked) => handleFilterChange('withDiscount', checked)}
          />
          <label htmlFor="withDiscount" className="text-sm cursor-pointer">
            {t('with_discount', 'Со скидкой')}
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="withDelivery" 
            checked={filters.withDelivery}
            onCheckedChange={(checked) => handleFilterChange('withDelivery', checked)}
          />
          <label htmlFor="withDelivery" className="text-sm cursor-pointer">
            {t('with_delivery', 'С доставкой')}
          </label>
        </div>
      </div>
      
      {/* Сортировка */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">{t('sort_by', 'Сортировка')}</h4>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange('sortBy', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('sort', 'Сортировать')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              {t('newest', 'Сначала новые')}
            </SelectItem>
            <SelectItem value="oldest">
              {t('oldest', 'Сначала старые')}
            </SelectItem>
            <SelectItem value="price_asc">
              {t('price_asc', 'Сначала дешевые')}
            </SelectItem>
            <SelectItem value="price_desc">
              {t('price_desc', 'Сначала дорогие')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Кнопка поиска */}
      <Button 
        className="w-full"
        onClick={handleSearch}
      >
        {t('search', 'Поиск')}
      </Button>
    </div>
  );
};

export default CategoryFilters;
