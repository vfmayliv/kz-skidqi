
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

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

  const IconComponent = getIconComponent(category.icon);

  // Получаем имя категории в зависимости от языка
  const categoryName = language === 'ru' ? category.name_ru : category.name_kz;

  // Если slug категории в списке исключен, то будет просто ссылка 
  if (excludedSlugs.includes(category.slug)) {
    return (
      <Link to={`/listings/${category.slug}`} className="text-center">
        <Button variant="ghost" className="h-auto p-2 flex flex-col items-center justify-center">
          <IconComponent className="w-8 h-8 mb-2" />
          <span className="text-xs">{categoryName}</span>
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
          <span className="text-xs">{categoryName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        {subcategoriesLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="grid gap-2">
            {subcategories.map((subcategory) => {
              const subcategoryName = language === 'ru' ? subcategory.name_ru : subcategory.name_kz;
              return (
                <Link
                  key={subcategory.id}
                  to={`/listings/${subcategory.slug}`}
                  className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  onClick={() => setPopoverOpen(false)}
                >
                  {subcategoryName}
                </Link>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export const CategoryMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Получаем основные категории по условию parent_id IS NULL из listing_categories
        const { data: parentNullData, error: parentNullError } = await supabase
          .from('listing_categories')
          .select('*')
          .is('parent_id', null)
          .order('name_ru', { ascending: true });

        if (parentNullError) {
          console.error('Ошибка при загрузке категорий с parent_id = null:', parentNullError);
        }

        // Если получили категории, используем их
        if (parentNullData && parentNullData.length > 0) {
          // Преобразуем данные к нужному формату
          const transformedData: Category[] = parentNullData.map(item => ({
            id: item.id,
            name_ru: item.name_ru,
            name_kz: item.name_kz,
            slug: item.slug,
            parent_id: item.parent_id,
            level: item.level,
            is_active: true,
            sort_order: 0,
            icon: 'folder' // Дефолтная иконка
          }));
          
          setMainCategories(transformedData.slice(0, 13)); // Берем первые 13
        } 
        // Иначе, получаем все категории и отбираем основные
        else {
          const { data: allData, error: allError } = await supabase
            .from('listing_categories')
            .select('*')
            .order('name_ru', { ascending: true });

          if (allError) {
            console.error('Ошибка при загрузке всех категорий:', allError);
            return;
          }

          if (allData && allData.length > 0) {
            // Преобразуем данные к нужному формату
            const transformedData: Category[] = allData.map(item => ({
              id: item.id,
              name_ru: item.name_ru,
              name_kz: item.name_kz,
              slug: item.slug,
              parent_id: item.parent_id,
              level: item.level,
              is_active: true,
              sort_order: 0,
              icon: 'folder' // Дефолтная иконка
            }));
            
            setMainCategories(transformedData.slice(0, 13)); // Берем первые 13
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
};

export default CategoryMenu;
