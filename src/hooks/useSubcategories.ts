
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

/**
 * Хук для получения дочерних категорий первого уровня для указанного родителя.
 * @param parentId - ID родительской категории.
 * @returns Объект с категориями, состоянием загрузки и ошибкой.
 */
export function useSubcategories(parentId: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentId === null) {
      setCategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('listing_categories')
          .select('*')
          .eq('parent_id', parentId)
          .order('name_ru', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        // Преобразуем UUID в number для совместимости
        const transformedData = data?.map(item => ({
          ...item,
          id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16), // Преобразуем UUID в число
          parent_id: item.parent_id ? parseInt(item.parent_id.replace(/-/g, '').substring(0, 8), 16) : null
        })) || [];

        setCategories(transformedData);
      } catch (err: any) {
        console.error('Ошибка при загрузке подкатегорий:', err);
        setError(err.message || 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [parentId]);

  return { categories, loading, error };
}
