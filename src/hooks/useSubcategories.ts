
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

        // Преобразуем данные к формату Category
        const transformedData: Category[] = (data || []).map(item => ({
          id: item.id, // Оставляем как UUID string
          name_ru: item.name_ru,
          name_kz: item.name_kz,
          slug: item.slug,
          parent_id: item.parent_id,
          level: item.level,
          is_active: true,
          sort_order: 0
        }));

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
