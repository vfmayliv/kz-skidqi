
import { UniversalFilters } from '@/components/filters/UniversalFilters';
import { CategoryTreeFilter } from '@/components/filters/CategoryTreeFilter';
import { useUniversalFiltersStore } from '@/stores/useUniversalFiltersStore';

interface CategoryFiltersSectionProps {
  categoryId: string;
  shouldShowCategoryTree: boolean;
  shouldShowUniversalFilters: boolean;
  selectedSubcategory?: string;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSearch: () => void;
  FiltersComponent?: React.ComponentType<any>;
}

export function CategoryFiltersSection({
  categoryId,
  shouldShowCategoryTree,
  shouldShowUniversalFilters,
  selectedSubcategory,
  onSubcategorySelect,
  onSearch,
  FiltersComponent
}: CategoryFiltersSectionProps) {
  const { filters, setFilters, resetFilters } = useUniversalFiltersStore();

  // Ensure filters match the expected interface
  const adaptedFilters = {
    priceRange: { 
      min: filters.priceRange?.min || null, 
      max: filters.priceRange?.max || null 
    },
    condition: filters.condition || 'any',
    hasPhotos: filters.hasPhotos,
    hasDiscount: filters.hasDiscount,
    hasDelivery: filters.hasDelivery
  };

  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      {/* Universal Filters с интегрированным Category Tree Filter */}
      {shouldShowUniversalFilters && (
        <UniversalFilters
          filters={adaptedFilters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          onSearch={onSearch}
          categoryTreeFilter={shouldShowCategoryTree ? (
            <CategoryTreeFilter
              categoryId={categoryId}
              onCategorySelect={onSubcategorySelect}
              selectedCategoryId={selectedSubcategory}
            />
          ) : undefined}
        />
      )}
      
      {/* Custom Category Filters */}
      {FiltersComponent && (
        <FiltersComponent
          filters={{}}
          onFilterChange={() => {}}
          onReset={() => {}}
          onSearch={onSearch}
          districts={[]}
          config={{
            cities: [],
            onCityChange: () => {},
            selectedCity: null
          }}
          brands={[]}
          activeFiltersCount={0}
        />
      )}
    </div>
  );
}
