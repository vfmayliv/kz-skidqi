
import { create } from 'zustand';
import { 
  TransportFilters,
  VehicleType,
  EngineType,
  TransmissionType,
  DriveType,
  BodyType,
  SteeringWheelType,
  VehicleFeature,
  SortOptions
} from '@/types/listingType';

type TransportFiltersState = {
  filters: TransportFilters;
  activeFiltersCount: number;
  
  // Actions
  setFilter: <K extends keyof TransportFilters>(key: K, value: TransportFilters[K]) => void;
  setFilters: (filters: Partial<TransportFilters>) => void;
  resetFilters: () => void;
  calculateActiveFiltersCount: () => number;
};

// Initial filters state
const initialFilters: TransportFilters = {
  vehicleType: null,
  brandId: null,
  modelId: null,
  yearRange: { min: null, max: null },
  priceRange: { min: null, max: null },
  mileageRange: { min: null, max: null },
  engineVolumeRange: { min: null, max: null },
  engineType: null,
  transmission: null,
  driveType: null,
  bodyType: null,
  condition: null,
  color: null,
  fuelType: null,
  hasPhoto: null,
  dealerOnly: null,
  customsCleared: null,
  inStock: null,
  exchangePossible: null,
  withoutAccidents: null,
  withServiceHistory: null,
  steeringWheel: null,
  features: null,
  cities: null,
  sortBy: null
};

export const useTransportFiltersStore = create<TransportFiltersState>()((set, get) => ({
  filters: initialFilters,
  activeFiltersCount: 0,
  
  setFilter: (key, value) => {
    set((state) => {
      const newFilters = {
        ...state.filters,
        [key]: value
      };
      
      return {
        filters: newFilters,
        activeFiltersCount: calculateActiveFiltersCount(newFilters)
      };
    });
  },
  
  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = {
        ...state.filters,
        ...newFilters
      };
      
      return {
        filters: updatedFilters,
        activeFiltersCount: calculateActiveFiltersCount(updatedFilters)
      };
    });
  },
  
  resetFilters: () => {
    set({
      filters: initialFilters,
      activeFiltersCount: 0
    });
  },
  
  calculateActiveFiltersCount: () => {
    return calculateActiveFiltersCount(get().filters);
  }
}));

// Helper function to calculate active filters count
function calculateActiveFiltersCount(filters: TransportFilters): number {
  return Object.keys(filters).reduce((count, key) => {
    const filterKey = key as keyof TransportFilters;
    const filterValue = filters[filterKey];
    
    if (filterKey === 'priceRange' || filterKey === 'yearRange' || filterKey === 'mileageRange' || 
        filterKey === 'engineVolumeRange') {
      const range = filterValue as { min: number | null, max: number | null };
      if ((range.min !== null && range.min > 0) || (range.max !== null && range.max < 1000000000)) {
        return count + 1;
      }
      return count;
    }
    
    if (filterValue !== null && filterValue !== undefined) {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        return count + 1;
      } else if (!Array.isArray(filterValue) && filterValue !== null) {
        return count + 1;
      }
    }
    
    return count;
  }, 0);
}
