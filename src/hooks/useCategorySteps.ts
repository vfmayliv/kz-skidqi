
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryStep {
  id: number;
  name_ru: string;
  name_kz: string;
  level: number;
  parent_id?: number;
  hasChildren?: boolean;
}

export interface CategoryPath {
  step: number;
  category: CategoryStep;
}

export const useCategorySteps = () => {
  const [currentCategories, setCurrentCategories] = useState<CategoryStep[]>([]);
  const [categoryPath, setCategoryPath] = useState<CategoryPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMainCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_ru, name_kz, level, parent_id')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Проверяем, есть ли у каждой категории дочерние элементы
      const categoriesWithChildren = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', category.id)
            .eq('is_active', true);

          return {
            ...category,
            hasChildren: (count || 0) > 0
          };
        })
      );

      setCurrentCategories(categoriesWithChildren);
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка загрузки основных категорий:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubcategories = useCallback(async (parentId: number, parentCategory: CategoryStep) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_ru, name_kz, level, parent_id')
        .eq('parent_id', parentId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Проверяем, есть ли у каждой подкатегории дочерние элементы
      const categoriesWithChildren = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true })
            .eq('parent_id', category.id)
            .eq('is_active', true);

          return {
            ...category,
            hasChildren: (count || 0) > 0
          };
        })
      );

      setCurrentCategories(categoriesWithChildren);
      
      // Добавляем в путь текущую выбранную категорию
      const newStep = categoryPath.length;
      setCategoryPath(prev => [...prev, { step: newStep, category: parentCategory }]);
      
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка загрузки подкатегорий:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryPath]);

  const goBack = useCallback(async (stepIndex: number) => {
    if (stepIndex === -1) {
      // Возврат к основным категориям
      setCategoryPath([]);
      await loadMainCategories();
    } else if (stepIndex < categoryPath.length - 1) {
      // Возврат к определенному шагу
      const targetPath = categoryPath.slice(0, stepIndex + 1);
      setCategoryPath(targetPath);
      
      const targetCategory = targetPath[targetPath.length - 1].category;
      await loadSubcategories(targetCategory.id, targetCategory);
    }
  }, [categoryPath, loadMainCategories, loadSubcategories]);

  const resetSelection = useCallback(() => {
    setCategoryPath([]);
    setCurrentCategories([]);
    setError(null);
  }, []);

  const getSelectedCategory = useCallback(() => {
    return categoryPath.length > 0 ? categoryPath[categoryPath.length - 1].category : null;
  }, [categoryPath]);

  const getCurrentLevel = useCallback(() => {
    return categoryPath.length;
  }, [categoryPath]);

  return {
    currentCategories,
    categoryPath,
    loading,
    error,
    loadMainCategories,
    loadSubcategories,
    goBack,
    resetSelection,
    getSelectedCategory,
    getCurrentLevel
  };
};
