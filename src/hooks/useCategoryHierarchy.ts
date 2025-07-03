
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useCategoryHierarchy() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔄 Fetching categories from Supabase...');
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('❌ Error fetching categories:', error);
          throw error;
        }

        console.log('✅ Categories fetched:', data?.length || 0);
        
        // Построение иерархии категорий
        const categoryMap = new Map();
        const rootCategories: any[] = [];

        // Создаем карту всех категорий
        data?.forEach(category => {
          categoryMap.set(category.id, { ...category, children: [] });
        });

        // Строим иерархию
        data?.forEach(category => {
          const categoryWithChildren = categoryMap.get(category.id);
          if (category.parent_id) {
            const parent = categoryMap.get(category.parent_id);
            if (parent) {
              parent.children.push(categoryWithChildren);
            }
          } else {
            rootCategories.push(categoryWithChildren);
          }
        });

        setCategories(rootCategories);
        setError(null);
      } catch (err: any) {
        console.error('💥 Error in useCategoryHierarchy:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
