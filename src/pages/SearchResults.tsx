import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ListingCard } from '@/components/ListingCard';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { useSearchContext } from '@/contexts/SearchContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/data/categories';
import { cities } from '@/data/cities';
import { Separator } from '@/components/ui/separator';
import { 
  Filter, Grid3X3, List, Search, X, 
  SlidersHorizontal, RefreshCw, CheckCircle 
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Label } from "@/components/ui/label";
import { useListings } from "@/hooks/useListings";

const SearchResults = () => {
  const { language, t } = useAppWithTranslations();
  const { 
    searchTerm, 
    searchResults: contextSearchResults, 
    filters, 
    setSearchTerm, 
    setFilters, 
    resetFilters, 
    performSearch: performContextSearch 
  } = useSearchContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { getListings, listings, loading, error } = useListings();
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
  
  // Выполнение поиска с использованием Supabase
  const performSearch = async () => {
    const filterParams: any = {
      searchQuery: searchTerm
    };
    
    if (filters.category) {
      const categoryId = parseInt(filters.category);
      if (!isNaN(categoryId)) {
        filterParams.categoryId = categoryId;
      }
    }
    
    if (filters.city) {
      filterParams.city = filters.city;
    }
    
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
      filterParams.priceRange = filters.priceRange;
    }
    
    if (filters.isFeatured !== null) {
      filterParams.isPremium = filters.isFeatured;
    }
    
    // Скидка в базе данных - это поле discount_percent > 0
    if (filters.hasDiscount !== null) {
      // В будущем будет использоваться, когда API сможет фильтровать по скидкам
    }
    
    await getListings(filterParams);
  };
  
  // Initialize search from URL query parameters
  useEffect(() => {
    const term = searchParams.get('q') || '';
    const categoryId = searchParams.get('category');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured');
    const discounted = searchParams.get('discounted');
    
    // Set search term
    if (term) {
      setSearchTerm(term);
    }
    
    // Set filters
    const newFilters: any = {};
    
    if (categoryId) {
      newFilters.category = categoryId;
    }
    
    if (city) {
      newFilters.city = city;
    }
    
    if (minPrice || maxPrice) {
      newFilters.priceRange = {
        min: minPrice ? parseInt(minPrice) : null,
        max: maxPrice ? parseInt(maxPrice) : null
      };
    }
    
    if (featured) {
      newFilters.isFeatured = featured === 'true';
    }
    
    if (discounted) {
      newFilters.hasDiscount = discounted === 'true';
    }
    
    // Only update filters if we have some
    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }

    // Загружаем объявления из Supabase
    if (!hasInitialLoaded) {
      performSearch().then(() => {
        setHasInitialLoaded(true);
      });
    }
  }, []);
  
  // Update URL query parameters when search or filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set('q', searchTerm);
    }
    
    if (filters.category) {
      params.set('category', filters.category);
    }
    
    if (filters.city) {
      params.set('city', filters.city);
    }
    
    if (filters.priceRange.min !== null) {
      params.set('minPrice', filters.priceRange.min.toString());
    }
    
    if (filters.priceRange.max !== null) {
      params.set('maxPrice', filters.priceRange.max.toString());
    }
    
    if (filters.isFeatured !== null) {
      params.set('featured', filters.isFeatured.toString());
    }
    
    if (filters.hasDiscount !== null) {
      params.set('discounted', filters.hasDiscount.toString());
    }
    
    setSearchParams(params);

    // Загружаем новые объявления при изменении фильтров
    if (hasInitialLoaded) {
      performSearch();
    }
  }, [searchTerm, filters, hasInitialLoaded]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };
  
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name[language] : null;
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.city) count++;
    if (filters.priceRange.min !== null) count++;
    if (filters.priceRange.max !== null) count++;
    if (filters.isFeatured !== null) count++;
    if (filters.hasDiscount !== null) count++;
    return count;
  };
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceRange.min || 0,
    filters.priceRange.max || 1000000
  ]);
  
  // Update price range state when filters change
  useEffect(() => {
    setPriceRange([
      filters.priceRange.min || 0,
      filters.priceRange.max || 1000000
    ]);
  }, [filters.priceRange.min, filters.priceRange.max]);

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
    categoryId: listing.category_id?.toString() || '',
    subcategoryId: '',
    isFeatured: listing.is_premium || false,
    createdAt: listing.created_at,
    views: listing.views || 0
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {language === 'ru' ? 'Результаты поиска' : 'Іздеу нәтижелері'}
          </h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  <span className="hidden sm:inline">
                    {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
                  </span>
                  {getActiveFiltersCount() > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>
                    {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
                  </SheetTitle>
                  <SheetDescription>
                    {language === 'ru' 
                      ? 'Настройте параметры поиска'
                      : 'Іздеу параметрлерін реттеңіз'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  {/* Category filter */}
                  <div className="space-y-2">
                    <Label>
                      {language === 'ru' ? 'Категория' : 'Санат'}
                    </Label>
                    <Select
                      value={filters.category || "all"}
                      onValueChange={(value) => {
                        console.log("Setting category filter to:", value);
                        setFilters({ category: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ru' ? 'Все категории' : 'Барлық санаттар'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {language === 'ru' ? 'Все категории' : 'Барлық санаттар'}
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* City filter */}
                  <div className="space-y-2">
                    <Label>
                      {language === 'ru' ? 'Город' : 'Қала'}
                    </Label>
                    <Select
                      value={filters.city || "all"}
                      onValueChange={(value) => {
                        console.log("Setting city filter to:", value);
                        setFilters({ city: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ru' ? 'Все города' : 'Барлық қалалар'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {language === 'ru' ? 'Все города' : 'Барлық қалалар'}
                        </SelectItem>
                        {cities.map((city, index) => (
                          <SelectItem key={index} value={city[language]}>
                            {city[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Price range filter */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        {language === 'ru' ? 'Диапазон цен' : 'Баға диапазоны'}
                      </Label>
                      <div className="pt-2">
                        <Slider
                          value={priceRange}
                          max={1000000}
                          step={1000}
                          onValueChange={(values) => {
                            setPriceRange(values as [number, number]);
                          }}
                          onValueCommit={(values) => {
                            const [min, max] = values as [number, number];
                            console.log("Setting price range to:", min, max);
                            setFilters({
                              priceRange: {
                                min: min > 0 ? min : null,
                                max: max < 1000000 ? max : null
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder={language === 'ru' ? 'От' : 'Бастап'}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const newRange: [number, number] = [
                            isNaN(value) ? 0 : value,
                            priceRange[1]
                          ];
                          setPriceRange(newRange);
                          setFilters({
                            priceRange: {
                              min: newRange[0] > 0 ? newRange[0] : null,
                              max: filters.priceRange.max
                            }
                          });
                        }}
                      />
                      <span>—</span>
                      <Input
                        type="number"
                        placeholder={language === 'ru' ? 'До' : 'Дейін'}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          const newRange: [number, number] = [
                            priceRange[0],
                            isNaN(value) ? 1000000 : value
                          ];
                          setPriceRange(newRange);
                          setFilters({
                            priceRange: {
                              min: filters.priceRange.min,
                              max: newRange[1] < 1000000 ? newRange[1] : null
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Discount & Featured filters */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="has-discount"
                        checked={filters.hasDiscount === true}
                        onCheckedChange={(checked) => {
                          console.log("Setting hasDiscount filter to:", checked);
                          setFilters({ hasDiscount: checked ? true : null });
                        }}
                      />
                      <label
                        htmlFor="has-discount"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {language === 'ru' ? 'Только со скидкой' : 'Тек жеңілдікпен'}
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="is-featured"
                        checked={filters.isFeatured === true}
                        onCheckedChange={(checked) => {
                          console.log("Setting isFeatured filter to:", checked);
                          setFilters({ isFeatured: checked ? true : null });
                        }}
                      />
                      <label
                        htmlFor="is-featured"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {language === 'ru' ? 'Только рекомендуемые' : 'Тек ұсынылатын'}
                      </label>
                    </div>
                  </div>
                </div>
                
                <SheetFooter className="sm:justify-between">
                  <SheetClose asChild>
                    <Button variant="outline" onClick={resetFilters}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {language === 'ru' ? 'Сбросить' : 'Қалпына келтіру'}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button onClick={performSearch}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {language === 'ru' ? 'Применить' : 'Қолдану'}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-1">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === 'ru' ? 'Поиск объявлений...' : 'Хабарландыруларды іздеу...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">
            {language === 'ru' ? 'Найти' : 'Табу'}
          </Button>
        </form>
        
        {/* Active filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Активные фильтры:' : 'Белсенді сүзгілер:'}
            </span>
            
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getCategoryName(filters.category)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({ category: null })}
                />
              </Badge>
            )}
            
            {filters.city && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.city}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({ city: null })}
                />
              </Badge>
            )}
            
            {filters.priceRange.min !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {language === 'ru' ? 'От' : 'Бастап'} {filters.priceRange.min} ₸
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({ 
                    priceRange: { ...filters.priceRange, min: null } 
                  })}
                />
              </Badge>
            )}
            
            {filters.priceRange.max !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {language === 'ru' ? 'До' : 'Дейін'} {filters.priceRange.max} ₸
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({ 
                    priceRange: { ...filters.priceRange, max: null } 
                  })}
                />
              </Badge>
            )}
            
            {filters.hasDiscount === true && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {language === 'ru' ? 'Со скидкой' : 'Жеңілдікпен'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({ hasDiscount: null })}
                />
              </Badge>
            )}
            
            {filters.isFeatured === true && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {language === 'ru' ? 'Рекомендуемые' : 'Ұсынылатын'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({ isFeatured: null })}
                />
              </Badge>
            )}
            
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm">
              {language === 'ru' ? 'Сбросить все' : 'Барлығын тазалау'}
            </Button>
          </div>
        )}
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {language === 'ru' 
              ? `Найдено объявлений: ${adaptedListings.length}`
              : `Табылған хабарландырулар: ${adaptedListings.length}`}
          </p>
        </div>
        
        {/* Search results */}
        {loading && !hasInitialLoaded ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : adaptedListings.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" 
              : "space-y-4"
          }>
            {adaptedListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">
              {language === 'ru' 
                ? 'По вашему запросу ничего не найдено'
                : 'Сіздің сұрауыңыз бойынша ештеңе табылмады'}
            </p>
            <p className="text-muted-foreground">
              {language === 'ru' 
                ? 'Попробуйте изменить параметры поиска или сбросить фильтры'
                : 'Іздеу параметрлерін өзгертіп көріңіз немесе сүзгілерді қалпына келтіріңіз'}
            </p>
            <Button onClick={resetFilters} className="mt-4">
              {language === 'ru' ? 'Сбросить фильтры' : 'Сүзгілерді қалпына келтіру'}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
