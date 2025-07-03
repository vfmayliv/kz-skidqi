import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { usePropertyListings } from '@/hooks/usePropertyListings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { List, Map } from 'lucide-react';
import MapView from '@/components/property/MapView';
import { getFiltersForDeal, SegmentWithPropertyTypes } from '@/lib/filters';

export default function PropertyPage() {
  const { filters, setFilters, setDealType, setSegment } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // We will trigger the search manually
  const [activeFilters, setActiveFilters] = useState(filters);
  const { listings, loading, error, refetch } = usePropertyListings(activeFilters);
  
  const [viewMode, setViewMode] = useState('list');
  const [filtersConfig, setFiltersConfig] = useState<SegmentWithPropertyTypes[]>([]);

  // Effect to sync URL params to state on initial load
  useEffect(() => {
    const urlDealType = searchParams.get('dealType');
    const urlSegment = searchParams.get('segment');
    
    // Set initial deal type, defaulting to 'sale'
    const initialDealType = urlDealType || 'sale';
    setDealType(initialDealType);

    if (urlSegment) {
      setSegment(urlSegment);
    }
    
    // Trigger initial search with filters from URL/defaults
    setActiveFilters(usePropertyFiltersStore.getState().filters);

  }, []); // Runs only once on mount

  // Effect to load filter configuration when dealType changes
  useEffect(() => {
    if (filters.dealType) {
      const loadFilters = async () => {
        const config = await getFiltersForDeal(filters.dealType);
        setFiltersConfig(config);
      };
      loadFilters();
    }
  }, [filters.dealType]);

  // Effect to update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.dealType) params.set('dealType', filters.dealType);
    if (filters.segment) params.set('segment', filters.segment);
    setSearchParams(params, { replace: true });
  }, [filters.dealType, filters.segment, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    // This function is now primarily for live updates in the store
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Set the active filters to the current state and trigger a refetch
    setActiveFilters(filters);
    refetch();
  };

  const processedListings = useMemo(() => {
    if (!listings || !Array.isArray(listings)) return [];
    return listings.map(listing => ({ ...listing, price: Number(listing.price) }));
  }, [listings]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Недвижимость</h1>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} defaultValue="list">
              <ToggleGroupItem value="list" aria-label="Toggle list">
                <List className="h-4 w-4 mr-2" />Список
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Toggle map">
                <Map className="h-4 w-4 mr-2" />Карта
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <PropertyFilters 
            config={filtersConfig} 
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
          
          <>
            {loading && <div className="text-center py-8">Загрузка объявлений...</div>}
            {error && <div className="text-center text-red-500">Ошибка: {error.message}</div>}
            
            {!loading && viewMode === 'list' && processedListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
                {processedListings.map(listing => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
            
            {!loading && viewMode === 'map' && (
              <MapView listings={processedListings} />
            )}
            
            {!loading && !error && processedListings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Подходящих объявлений не найдено.</p>
                <p className="text-sm text-gray-400 mt-2">Попробуйте изменить критерии поиска или сбросьте фильтры.</p>
              </div>
            )}
          </>
        </div>
      </main>
      <Footer />
    </div>
  );
}