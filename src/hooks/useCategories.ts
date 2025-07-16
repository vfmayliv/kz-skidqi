
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

        // Преобразуем UUID в number для совместимости с существующим кодом
        const transformedData = data?.map(item => ({
          ...item,
          id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16),
          parent_id: item.parent_id ? parseInt(item.parent_id.replace(/-/g, '').substring(0, 8), 16) : null
        })) || [];

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
  const getSubcategories = async (parentId: number) => {
    setLoading(true);
    try {
      // Преобразуем number обратно в UUID для запроса
      const parentUuid = data?.find(cat => 
        parseInt(cat.id.replace(/-/g, '').substring(0, 8), 16) === parentId
      )?.id;

      if (!parentUuid) return [];

      const { data, error } = await supabase
        .from('listing_categories')
        .select('*')
        .eq('parent_id', parentUuid)
        .order('name_ru', { ascending: true });

      if (error) {
        throw error;
      }

      // Преобразуем UUID в number для совместимости
      const transformedData = data?.map(item => ({
        ...item,
        id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16),
        parent_id: item.parent_id ? parseInt(item.parent_id.replace(/-/g, '').substring(0, 8), 16) : null
      })) || [];

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

      // Преобразуем UUID в number для совместимости
      return {
        ...data,
        id: parseInt(data.id.replace(/-/g, '').substring(0, 8), 16),
        parent_id: data.parent_id ? parseInt(data.parent_id.replace(/-/g, '').substring(0, 8), 16) : null
      };
    } catch (err: any) {
      console.error(`Ошибка при поиске категории ${slug}:`, err);
      return null;
    }
  };

  // Получение полного пути категорий (для хлебных крошек)
  const getCategoryPath = async (categoryId: number) => {
    const path: Category[] = [];
    let currentId = categoryId;

    while (currentId) {
      try {
        // Найдем UUID по числовому ID
        const categoryUuid = categories.find(cat => 
          parseInt(cat.id.replace(/-/g, '').substring(0, 8), 16) === currentId
        )?.id;

        if (!categoryUuid) break;

        const { data, error } = await supabase
          .from('listing_categories')
          .select('*')
          .eq('id', categoryUuid)
          .single();

        if (error || !data) {
          break;
        }

        // Преобразуем для совместимости
        const transformedData = {
          ...data,
          id: parseInt(data.id.replace(/-/g, '').substring(0, 8), 16),
          parent_id: data.parent_id ? parseInt(data.parent_id.replace(/-/g, '').substring(0, 8), 16) : null
        };

        path.unshift(transformedData);
        currentId = transformedData.parent_id as number;
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
