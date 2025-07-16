
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

// Хук для получения категорий
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка всех категорий верхнего уровня (parent_id = null)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('listing_categories')
          .select('*')
          .is('parent_id', null)
          .order('name_ru', { ascending: true });

        if (error) {
          throw error;
        }

        // Преобразуем данные к формату Category
        const transformedData: Category[] = (data || []).map(item => ({
          id: item.id,
          name_ru: item.name_ru,
          name_kz: item.name_kz,
          slug: item.slug,
          parent_id: item.parent_id,
          level: item.level,
          is_active: true,
          sort_order: 0,
          icon: 'folder'
        }));

        setCategories(transformedData);
      } catch (err: any) {
        setError(err.message);
        console.error('Ошибка при загрузке категорий:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Получение подкатегорий для конкретной категории
  const getSubcategories = async (parentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listing_categories')
        .select('*')
        .eq('parent_id', parentId)
        .order('name_ru', { ascending: true });

      if (error) {
        throw error;
      }

      // Преобразуем данные к формату Category
      const transformedData: Category[] = (data || []).map(item => ({
        id: item.id,
        name_ru: item.name_ru,
        name_kz: item.name_kz,
        slug: item.slug,
        parent_id: item.parent_id,
        level: item.level,
        is_active: true,
        sort_order: 0,
        icon: 'folder'
      }));

      return transformedData;
    } catch (err: any) {
      setError(err.message);
      console.error(`Ошибка при загрузке подкатегорий для ${parentId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Получение категории по слагу (URL-имени)
  const getCategoryBySlug = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('listing_categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      // Преобразуем к формату Category
      return {
        id: data.id,
        name_ru: data.name_ru,
        name_kz: data.name_kz,
        slug: data.slug,
        parent_id: data.parent_id,
        level: data.level,
        is_active: true,
        sort_order: 0,
        icon: 'folder'
      } as Category;
    } catch (err: any) {
      console.error(`Ошибка при поиске категории ${slug}:`, err);
      return null;
    }
  };

  // Получение полного пути категорий (для хлебных крошек)
  const getCategoryPath = async (categoryId: string) => {
    const path: Category[] = [];
    let currentId = categoryId;

    while (currentId) {
      try {
        const { data, error } = await supabase
          .from('listing_categories')
          .select('*')
          .eq('id', currentId)
          .single();

        if (error || !data) {
          break;
        }

        // Преобразуем к формату Category
        const transformedData: Category = {
          id: data.id,
          name_ru: data.name_ru,
          name_kz: data.name_kz,
          slug: data.slug,
          parent_id: data.parent_id,
          level: data.level,
          is_active: true,
          sort_order: 0,
          icon: 'folder'
        };

        path.unshift(transformedData);
        currentId = transformedData.parent_id;
      } catch (err) {
        console.error('Ошибка при построении пути категории:', err);
        break;
      }
    }

    return path;
  };

  return { 
    categories, 
    loading, 
    error, 
    getSubcategories, 
    getCategoryBySlug,
    getCategoryPath 
  };
}
