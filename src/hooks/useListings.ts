
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/contexts/SupabaseContext';

// Типы для параметров фильтрации объявлений
type ListingFilters = {
  categoryId?: number;
  cityId?: number;
  microdistrictId?: number;
  priceMin?: number;
  priceMax?: number;
  priceRange?: { min?: number; max?: number; };
  condition?: string;
  searchQuery?: string;
  isPremium?: boolean;
  isFree?: boolean;
};

// Типы для параметров сортировки
type SortOptions = 'newest' | 'price_asc' | 'price_desc' | 'discount';

// Функция для очистки значений от Zustand proxy объектов
const cleanFilterValue = (value: any): any => {
  if (value && typeof value === 'object' && value._type === 'undefined') {
    return undefined;
  }
  if (value && typeof value === 'object' && value.value !== undefined) {
    return value.value;
  }
  return value;
};

// Функция для очистки объекта фильтров
const cleanFilters = (filters: any): ListingFilters => {
  const cleaned: any = {};
  
  Object.keys(filters).forEach(key => {
    const value = cleanFilterValue(filters[key]);
    if (value !== undefined && value !== null && value !== '') {
      // Особая обработка для priceRange
      if (key === 'priceRange') {
        const priceMin = cleanFilterValue(value.min);
        const priceMax = cleanFilterValue(value.max);
        if (priceMin !== undefined) {
          cleaned['priceMin'] = priceMin;
        }
        if (priceMax !== undefined) {
          cleaned['priceMax'] = priceMax;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });

  return cleaned;
};

// Interface for pagination metadata
type PaginationMeta = {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
};

export function useListings() {
  const { user } = useSupabase();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<any | null>(null);

  // Get all listings with filtering, sorting, and pagination
  const getListings = async (filters: any = {}, sort: string = 'newest', limit: number = 50, offset: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching listings with filters:', filters);

      let query = supabase.from('listings').select(`
        *,
        cities(name_ru, name_kz),
        categories(name_ru, name_kz)
      `, { count: 'exact' });

      // Apply filters
      if (filters.categoryId) {
        console.log('📂 Applying category filter:', filters.categoryId);
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
      }
      if (filters.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }
      
      // Only show active listings
      query = query.eq('status', 'active');
      
      // Sorting
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'price_asc') {
        query = query.order('regular_price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('regular_price', { ascending: false });
      }
      
      // Первый запрос для получения общего количества
      const { count } = await query;
      
      // Если offset больше общего количества записей, сбрасываем на 0
      const safeOffset = (count && offset >= count) ? 0 : offset;
      
      // Pagination с безопасным offset
      query = query.range(safeOffset, safeOffset + limit - 1);

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('❌ Supabase query error:', queryError);
        throw queryError;
      }

      console.log('✅ Listings fetched successfully:', data?.length || 0);
      console.log('📊 Raw data from Supabase:', data);
      
      setListings(data || []);
      setPaginationMeta({
        totalItems: count || 0,
        currentPage: Math.floor(safeOffset / limit) + 1,
        itemsPerPage: limit,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (err: any) {
      console.error('💥 Error fetching listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get a single listing by ID
  const getListingById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching listing:', err);
      return null;
    }
  };

  // Create a new listing
  const createListing = async (listingData: any) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (err: any) {
      console.error('Error creating listing:', err);
      return null;
    }
  };

  // Update an existing listing
  const updateListing = async (id: string, listingData: any) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(listingData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0] || null;
    } catch (err: any) {
      console.error('Error updating listing:', err);
      return null;
    }
  };

  // Delete a listing
  const deleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      return false;
    }
  };

  // Получение объявлений текущего пользователя
  const getUserListings = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching user listings:', err);
      return [];
    }
  };

  return {
    listings,
    loading,
    error,
    paginationMeta,
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    getUserListings,
  };
}
