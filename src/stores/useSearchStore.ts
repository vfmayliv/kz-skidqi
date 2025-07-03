
import { create } from 'zustand';
import { mockListings, Listing } from '@/data/mockListings';
import { useAppStore } from './useAppStore';

type SearchFilters = {
  category: string | null;
  priceRange: { min: number | null; max: number | null };
  city: string | null;
  isFeatured: boolean | null;
  hasDiscount: boolean | null;
};

type SearchState = {
  searchTerm: string;
  searchResults: Listing[];
  filters: SearchFilters;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  performSearch: (term?: string) => void;
};

export const useSearchStore = create<SearchState>()((set, get) => {
  // Initial filters configuration
  const getInitialFilters = (): SearchFilters => {
    const { language, selectedCity } = useAppStore.getState();
    return {
      category: null,
      priceRange: { min: null, max: null },
      city: selectedCity ? selectedCity[language] : null,
      isFeatured: null,
      hasDiscount: null,
    };
  };
  
  return {
    searchTerm: '',
    searchResults: [],
    filters: getInitialFilters(),
    
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    
    setFilters: (newFilters: Partial<SearchFilters>) => {
      set((state) => {
        // Ensure category is not an empty string and handle 'all' value
        let updatedCategory = newFilters.category;
        if (updatedCategory === '' || updatedCategory === 'all') {
          updatedCategory = null;
        }
        
        // Ensure city is not an empty string and handle 'all' value
        let updatedCity = newFilters.city;
        if (updatedCity === '' || updatedCity === 'all') {
          updatedCity = null;
        }
        
        const updated = {
          ...state,
          filters: {
            ...state.filters,
            ...newFilters,
            // Handle cleaned values
            category: updatedCategory !== undefined ? updatedCategory : state.filters.category,
            city: updatedCity !== undefined ? updatedCity : state.filters.city,
            // Handle nested priceRange object
            priceRange: {
              ...state.filters.priceRange,
              ...(newFilters.priceRange || {})
            }
          }
        };
        return updated;
      });
      
      // Re-run search with updated filters
      setTimeout(() => get().performSearch(), 0);
    },
    
    resetFilters: () => {
      set(state => ({
        ...state,
        filters: getInitialFilters()
      }));
      setTimeout(() => get().performSearch(), 0);
    },
    
    performSearch: (term?: string) => {
      const state = get();
      const { language } = useAppStore.getState();
      const currentTerm = term !== undefined ? term : state.searchTerm;
      
      let results = [...mockListings];
      console.log('Starting search with filters:', state.filters);
      
      // Search by term (in title and description)
      if (currentTerm.trim()) {
        const normalizedTerm = currentTerm.toLowerCase();
        results = results.filter(listing => 
          listing.title[language].toLowerCase().includes(normalizedTerm) || 
          listing.description[language].toLowerCase().includes(normalizedTerm)
        );
        console.log('After term filter, results count:', results.length);
      }
      
      // Apply category filter
      if (state.filters.category && state.filters.category !== 'all') {
        results = results.filter(listing => listing.categoryId === state.filters.category);
        console.log('After category filter, results count:', results.length);
      }
      
      // Apply price range filter
      if (state.filters.priceRange.min !== null) {
        results = results.filter(listing => listing.discountPrice >= (state.filters.priceRange.min || 0));
        console.log('After min price filter, results count:', results.length);
      }
      
      if (state.filters.priceRange.max !== null) {
        results = results.filter(listing => listing.discountPrice <= (state.filters.priceRange.max || Infinity));
        console.log('After max price filter, results count:', results.length);
      }
      
      // Apply city filter
      if (state.filters.city && state.filters.city !== 'all') {
        results = results.filter(listing => listing.city[language] === state.filters.city);
        console.log('After city filter, results count:', results.length);
      }
      
      // Apply featured filter
      if (state.filters.isFeatured !== null) {
        results = results.filter(listing => listing.isFeatured === state.filters.isFeatured);
        console.log('After featured filter, results count:', results.length);
      }
      
      // Apply discount filter
      if (state.filters.hasDiscount !== null) {
        results = results.filter(listing => 
          state.filters.hasDiscount ? listing.discount > 0 : listing.discount === 0
        );
        console.log('After discount filter, results count:', results.length);
      }
      
      console.log('Final results count:', results.length);
      set({ searchResults: results });
    }
  };
});
