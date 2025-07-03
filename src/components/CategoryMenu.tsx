import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

// ID или slug основных категорий верхнего уровня
const MAIN_CATEGORY_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// Компонент для одной кнопки категории
const CategoryButton = ({ category }: { category: Category }) => {
  const { language, t } = useAppWithTranslations();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  // ID категорий, которые являются ссылками, а не выпадающими меню
  // Также исключаем "Бесплатно" - найдем его ID по slug
  const excludedSlugs = ['property', 'transport', 'free'];

  // Получаем подкатегории для данной категории
  const { categories: subcategories, loading: subcategoriesLoading } = useSubcategories(category.id);

  // Получаем компонент иконки из библиотеки lucide-react
  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName) return LucideIcons.HelpCircle;
    
    // Конвертируем имя иконки в формат PascalCase
    // например 'shopping-cart' -> 'ShoppingCart'
    const formattedIconName = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
    
    // @ts-ignore - Динамический доступ к компонентам
    return LucideIcons[formattedIconName] || LucideIcons.HelpCircle;
  };

  const IconComponent = getIconComponent(category.icon_url);

  // Если slug категории в списке исключен, то будет просто ссылка 
  if (excludedSlugs.includes(category.slug)) {
    return (
      <Link to={`/listings/${category.slug}`} className="text-center">
        <Button variant="ghost" className="h-auto p-2 flex flex-col items-center justify-center">
          <IconComponent className="w-8 h-8 mb-2" />
          <span className="text-xs">{category.name}</span>
        </Button>
      </Link>
    );
  }

  // для всех остальных слагов Поповер
  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 flex flex-col items-center justify-center">
          <IconComponent className="w-8 h-8 mb-2" />
          <span className="text-xs">{category.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        {subcategoriesLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="grid gap-2">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/listings/${subcategory.slug}`}
                className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => setPopoverOpen(false)}
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Сначала попробуем получить основные категории по условию parent_id IS NULL
        const { data: parentNullData, error: parentNullError } = await supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (parentNullError) {
          console.error('Ошибка при загрузке категорий с parent_id = null:', parentNullError);
        }

        // Если получили ровно 13 категорий, используем их
        if (parentNullData && parentNullData.length === 13) {
          setMainCategories(parentNullData);
        } 
        // Иначе, получаем все категории и отбираем 13 основных по ID или другим критериям
        else {
          const { data: allData, error: allError } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('id', { ascending: true });

          if (allError) {
            console.error('Ошибка при загрузке всех категорий:', allError);
            return;
          }

          // Отбираем основные категории по массиву MAIN_CATEGORY_IDS
          // Или берём первые 13 категорий, если не найдём точное соответствие
          const mainCats = allData
            .filter(cat => MAIN_CATEGORY_IDS.includes(cat.id))
            .sort((a, b) => a.sort_order - b.sort_order);
          
          if (mainCats.length > 0) {
            setMainCategories(mainCats);
          } else {
            // Запасной вариант - берем первые 13 категорий
            setMainCategories(allData.slice(0, 13));
          }
        }

      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">Загрузка категорий...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-4">
      <div className="container mx-auto px-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-4">
        {mainCategories.map(category => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}