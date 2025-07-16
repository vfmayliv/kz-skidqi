
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: number;
  name_ru: string;
  name_kz: string;
  parent_id: number | null;
  level: number;
  slug: string;
}

export const loadMainCategories = async (): Promise<Category[]> => {
  try {
    console.log('🔄 Loading main categories from Supabase...');
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_ru, name_kz, parent_id, level, slug')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ Error loading main categories:', error);
      throw error;
    }

    console.log('✅ Main categories loaded:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception loading main categories:', error);
    throw error;
  }
};

export const loadSubcategories = async (parentId: number): Promise<Category[]> => {
  try {
    console.log('🔄 Loading subcategories for parent:', parentId);
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_ru, name_kz, parent_id, level, slug')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('❌ Error loading subcategories:', error);
      throw error;
    }

    console.log('✅ Subcategories loaded:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Exception loading subcategories:', error);
    throw error;
  }
};

export const getCategoryPath = async (categoryId: number): Promise<Category[]> => {
  const path: Category[] = [];
  let currentId: number | null = categoryId;

  while (currentId !== null) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name_ru, name_kz, parent_id, level, slug')
      .eq('id', currentId)
      .single();

    if (error || !data) break;

    path.unshift(data);
    currentId = data.parent_id;
  }

  return path;
};
