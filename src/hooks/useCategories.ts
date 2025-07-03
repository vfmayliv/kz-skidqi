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
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .order('sort_order', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data);
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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', parentId)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data;
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
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        throw error;
      }

      return data;
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
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', currentId)
          .single();

        if (error || !data) {
          break;
        }

        path.unshift(data); // Добавляем в начало массива
        currentId = data.parent_id as number; // Переходим к родителю
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
