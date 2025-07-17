
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name_ru: string;
  name_kz: string;
  parent_id: string | null;
  level: number;
  slug: string;
}

export const loadMainCategories = async (): Promise<Category[]> => {
  try {
    console.log('🔄 Loading main categories from Supabase...');
    
    const { data, error } = await supabase
      .from('listing_categories')
      .select('id, name_ru, name_kz, parent_id, level, slug')
      .is('parent_id', null)
      .order('name_ru', { ascending: true });

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

export const loadSubcategories = async (parentId: string): Promise<Category[]> => {
  try {
    console.log('🔄 Loading subcategories for parent:', parentId);
    
    const { data, error } = await supabase
      .from('listing_categories')
      .select('id, name_ru, name_kz, parent_id, level, slug')
      .eq('parent_id', parentId)
      .order('name_ru', { ascending: true });

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

export const hasSubcategories = async (categoryId: string): Promise<boolean> => {
  try {
    console.log('🔄 Checking subcategories for category:', categoryId);
    
    const { count, error } = await supabase
      .from('listing_categories')
      .select('id', { count: 'exact', head: true })
      .eq('parent_id', categoryId);

    if (error) {
      console.error('❌ Error checking subcategories:', error);
      return false;
    }

    const hasChildren = (count || 0) > 0;
    console.log(`✅ Category ${categoryId} has children:`, hasChildren);
    return hasChildren;
  } catch (error) {
    console.error('❌ Exception checking subcategories:', error);
    return false;
  }
};

export const getCategoryPath = async (categoryId: string): Promise<Category[]> => {
  const path: Category[] = [];
  let currentId: string | null = categoryId;

  while (currentId !== null) {
    const { data, error } = await supabase
      .from('listing_categories')
      .select('id, name_ru, name_kz, parent_id, level, slug')
      .eq('id', currentId)
      .single();

    if (error || !data) break;

    path.unshift(data);
    currentId = data.parent_id;
  }

  return path;
};
