
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChildrenCategory {
  id: string;
  name_ru: string;
  name_kz: string;
  slug: string;
  parent_id: string | null;
  level: number;
  created_at: string;
  updated_at: string;
}

export function useChildrenCategories() {
  const [categories, setCategories] = useState<ChildrenCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('children_categories')
          .select('*')
          .order('name_ru', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Ошибка при загрузке детских категорий:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
