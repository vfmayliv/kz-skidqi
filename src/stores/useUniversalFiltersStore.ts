
import { create } from 'zustand';

export interface UniversalFiltersState {
  condition?: 'new' | 'used' | 'any';
  priceRange: {
    min?: number | null;
    max?: number | null;
  };
  location: {
    regionId?: number;
    cityId?: number;
  };
  hasPhotos: boolean;
  hasDiscount: boolean;
  hasDelivery: boolean;
}

interface UniversalFiltersStore {
  filters: UniversalFiltersState;
  setFilters: (filters: UniversalFiltersState) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
}

const initialFilters: UniversalFiltersState = {
  condition: undefined,
  priceRange: {
    min: null,
    max: null,
  },
  location: {
    regionId: undefined,
    cityId: undefined,
  },
  hasPhotos: false,
  hasDiscount: false,
  hasDelivery: false,
};

export const useUniversalFiltersStore = create<UniversalFiltersStore>((set, get) => ({
  filters: initialFilters,
  
  setFilters: (filters) => set({ filters }),
  
  resetFilters: () => set({ filters: initialFilters }),
  
  get activeFiltersCount() {
    const { filters } = get();
    let count = 0;
    
    if (filters.condition && filters.condition !== 'any') count++;
    if (filters.priceRange.min !== null && filters.priceRange.min !== undefined) count++;
    if (filters.priceRange.max !== null && filters.priceRange.max !== undefined) count++;
    if (filters.location.regionId !== undefined) count++;
    if (filters.location.cityId !== undefined) count++;
    if (filters.hasPhotos) count++;
    if (filters.hasDiscount) count++;
    if (filters.hasDelivery) count++;
    
    return count;
  },
}));
