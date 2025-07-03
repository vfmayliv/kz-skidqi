
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Listing, PropertyFilters } from '@/types/listingType';

export function usePropertyListings(filters: PropertyFilters) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('listings').select('*');

      // Guided search filters
      if (filters.dealType) {
        query = query.eq('deal_type', filters.dealType);
      }
      if (filters.segment) {
        query = query.eq('segment', filters.segment);
      }

      // Property type filter
      if (filters.propertyTypes && filters.propertyTypes.length > 0) {
        query = query.in('property_type', filters.propertyTypes);
      }
      
      // Price range filter
      if (filters.priceRange) {
        if (filters.priceRange.min) {
          query = query.gte('regular_price', filters.priceRange.min);
        }
        if (filters.priceRange.max) {
          query = query.lte('regular_price', filters.priceRange.max);
        }
      }
      
      // Area filter
      if (filters.areaRange) {
        if (filters.areaRange.min) {
          query = query.gte('area', filters.areaRange.min);
        }
        if (filters.areaRange.max) {
          query = query.lte('area', filters.areaRange.max);
        }
      }

      // Rooms filter
      if (filters.rooms && filters.rooms.length > 0) {
        query = query.in('rooms', filters.rooms);
      }

      // Floor filter
      if (filters.floorRange) {
          if (filters.floorRange.min) {
              query = query.gte('floor', filters.floorRange.min);
          }
          if (filters.floorRange.max) {
              query = query.lte('floor', filters.floorRange.max);
          }
      }

      // Boolean filters
      if (typeof filters.hasBalcony === 'boolean') {
        query = query.eq('has_balcony', filters.hasBalcony);
      }
      if (typeof filters.hasElevator === 'boolean') {
        query = query.eq('has_elevator', filters.hasElevator);
      }

      // Sorting
      if (filters.sortBy) {
        const [sortField, sortOrder] = filters.sortBy.split('_');
        const isAscending = sortOrder === 'asc';
        const sortColumn = sortField === 'date' ? 'created_at' : 'regular_price';
        query = query.order(sortColumn, { ascending: isAscending });
      } else {
        // Default sort by creation date
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      setListings(data as any[] as Listing[]);

    } catch (err) {
      setError(err as Error);
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.dealType && filters.segment) {
        refetch();
    }
  }, [filters]);

  return { listings, loading, error, refetch };
}
