
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockListings, Listing } from '@/data/mockListings';
import { useAppContext } from './AppContext';

type SearchContextType = {
  searchTerm: string;
  searchResults: Listing[];
  filters: {
    category: string | null;
    priceRange: { min: number | null; max: number | null };
    city: string | null;
    isFeatured: boolean | null;
    hasDiscount: boolean | null;
  };
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<SearchContextType['filters']>) => void;
  resetFilters: () => void;
  performSearch: (term?: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const { language, city } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [filters, setFiltersState] = useState<SearchContextType['filters']>({
    category: null,
    priceRange: { min: null, max: null },
    city: city ? city[language] : null,
    isFeatured: null,
    hasDiscount: null,
  });

  const performSearch = (term?: string) => {
    const currentTerm = term !== undefined ? term : searchTerm;
    
    let results = [...mockListings];
    console.log('Starting search with filters:', filters);
    
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
    if (filters.category && filters.category !== 'all') {
      results = results.filter(listing => listing.categoryId === filters.category);
      console.log('After category filter, results count:', results.length);
    }
    
    // Apply price range filter
    if (filters.priceRange.min !== null) {
      results = results.filter(listing => listing.discountPrice >= (filters.priceRange.min || 0));
      console.log('After min price filter, results count:', results.length);
    }
    
    if (filters.priceRange.max !== null) {
      results = results.filter(listing => listing.discountPrice <= (filters.priceRange.max || Infinity));
      console.log('After max price filter, results count:', results.length);
    }
    
    // Apply city filter
    if (filters.city && filters.city !== 'all') {
      results = results.filter(listing => listing.city[language] === filters.city);
      console.log('After city filter, results count:', results.length);
    }
    
    // Apply featured filter
    if (filters.isFeatured !== null) {
      results = results.filter(listing => listing.isFeatured === filters.isFeatured);
      console.log('After featured filter, results count:', results.length);
    }
    
    // Apply discount filter
    if (filters.hasDiscount !== null) {
      results = results.filter(listing => 
        filters.hasDiscount ? listing.discount > 0 : listing.discount === 0
      );
      console.log('After discount filter, results count:', results.length);
    }
    
    console.log('Final results count:', results.length);
    setSearchResults(results);
  };

  const setFilters = (newFilters: Partial<SearchContextType['filters']>) => {
    setFiltersState(prev => {
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
        ...prev,
        ...newFilters,
        // Handle cleaned values
        category: updatedCategory !== undefined ? updatedCategory : prev.category,
        city: updatedCity !== undefined ? updatedCity : prev.city,
        // Handle nested priceRange object
        priceRange: {
          ...prev.priceRange,
          ...(newFilters.priceRange || {})
        }
      };
      return updated;
    });
    // Re-run search with updated filters
    setTimeout(() => performSearch(), 0);
  };

  const resetFilters = () => {
    setFiltersState({
      category: null,
      priceRange: { min: null, max: null },
      city: city ? city[language] : null,
      isFeatured: null,
      hasDiscount: null,
    });
    setTimeout(() => performSearch(), 0);
  };

  const contextValue: SearchContextType = {
    searchTerm,
    searchResults,
    filters,
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
    },
    setFilters,
    resetFilters,
    performSearch,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
