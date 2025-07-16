
import { supabase } from '@/integrations/supabase/client';
import { CategoryStep } from '@/hooks/useCategorySteps';

export const loadMainCategories = async (): Promise<CategoryStep[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name_ru, name_kz, level, parent_id')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Ошибка загрузки основных категорий: ${error.message}`);
  }

  return data || [];
};

export const loadSubcategories = async (parentId: number): Promise<CategoryStep[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name_ru, name_kz, level, parent_id')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(`Ошибка загрузки подкатегорий: ${error.message}`);
  }

  return data || [];
};

export const checkCategoryHasChildren = async (categoryId: number): Promise<boolean> => {
  const { count, error } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('parent_id', categoryId)
    .eq('is_active', true);

  if (error) {
    console.error('Ошибка проверки дочерних категорий:', error);
    return false;
  }

  return (count || 0) > 0;
};

export const getCategoryById = async (categoryId: number): Promise<CategoryStep | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name_ru, name_kz, level, parent_id')
    .eq('id', categoryId)
    .single();

  if (error) {
    console.error('Ошибка получения категории:', error);
    return null;
  }

  return data;
};

export const buildCategoryPath = async (categoryId: number): Promise<CategoryStep[]> => {
  const path: CategoryStep[] = [];
  let currentId = categoryId;

  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;
    
    path.unshift(category);
    currentId = category.parent_id || 0;
  }

  return path;
};
