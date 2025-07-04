import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

// ID основных категорий
const MAIN_CATEGORY_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// Компонент карточки категории для улучшения переиспользуемости
interface CategoryCardProps {
  icon: React.ElementType;
  name: string;
  loading?: boolean;
}

const CategoryCard = ({ icon: Icon, name, loading = false }: CategoryCardProps) => {
  if (loading) {
    return (
      <>
        <div className="h-8 w-8 mb-2 animate-pulse bg-gray-200 rounded-full"></div>
        <div className="h-4 w-16 animate-pulse bg-gray-200 rounded"></div>
      </>
    );
  }

  return (
    <>
      <Icon className="h-6 w-6 mb-2" />
      <span className="text-xs text-center">{name}</span>
    </>
  );
};

// Компонент для одной категории в сетке
const CategoryGridItem = ({ category }: { category: Category }) => {
  const { language, t } = useAppWithTranslations();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  // Категории, для которых не нужно выпадающее меню - прямой переход
  const excludedSlugs = ['property', 'transport', 'free'];

  // Получаем подкатегории для данной категории
  const { categories: subcategories, loading: subcategoriesLoading } = useSubcategories(category.id);

  // Получаем компонент иконки - используем тот же подход, что и в CategoryMenu
  let IconComponent = LucideIcons.LayoutGrid; // Иконка по умолчанию
  try {
    // Проверяем, является ли иконка уже именем компонента
    // @ts-ignore - Динамический доступ к компонентам
    if (category.icon && LucideIcons[category.icon]) {
      // @ts-ignore
      IconComponent = LucideIcons[category.icon];
    } else if (category.icon) {
      // Пытаемся преобразовать kebab-case в PascalCase
      const formattedIconName = category.icon
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
      
      // @ts-ignore
      if (LucideIcons[formattedIconName]) {
        // @ts-ignore
        IconComponent = LucideIcons[formattedIconName];
      }
    }
  } catch (error) {
    console.error('Ошибка при получении иконки:', error);
  }

  // Проверка на исключаемые категории (прямые ссылки без подкатегорий)
  const isExcluded = excludedSlugs.includes(category.slug || '');

  if (isExcluded) {
    return (
      <Link to={`/category/${category.slug}`}>
        <Button 
          variant="outline" 
          className="h-24 w-full p-2 flex flex-col items-center justify-center border border-gray-200"
        >
          <CategoryCard icon={IconComponent} name={category.name || `Категория ${category.id}`} />
        </Button>
      </Link>
    );
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-24 w-full p-2 flex flex-col items-center justify-center border border-gray-200"
          onClick={() => setPopoverOpen(true)}
        >
          <CategoryCard icon={IconComponent} name={category.name || `Категория ${category.id}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="font-medium mb-2">{category.name}</div>
        <div className="grid grid-cols-2 gap-2">
          {subcategoriesLoading ? (
            <div>Загрузка подкатегорий...</div>
          ) : subcategories && subcategories.length > 0 ? (
            subcategories.map(subcat => (
              <Link 
                key={subcat.id} 
                to={`/category/${category.slug}/${subcat.slug}`} 
                className="hover:underline"
                onClick={() => setPopoverOpen(false)}
              >
                {subcat.name}
              </Link>
            ))
          ) : (
            <div>Нет подкатегорий</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Основной компонент сетки категорий
const CategoryGrid = () => {
  const [loading, setLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const { language, t } = useAppWithTranslations();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Получаем все категории из БД
        const { data: allData, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        
        console.log('Получены категории:', allData);
        
        if (allData) {
          // Фильтруем только основные категории по ID из массива MAIN_CATEGORY_IDS
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
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-4">{language === 'ru' ? 'Категории' : 'Санаттар'}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 13 }).map((_, index) => (
              <Button 
                key={index}
                variant="outline" 
                className="h-24 w-full p-2 flex flex-col items-center justify-center border border-gray-200"
                disabled
              >
                <CategoryCard loading={true} icon={LucideIcons.LayoutGrid} name="" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">{language === 'ru' ? 'Категории' : 'Санаттар'}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mainCategories.map(category => (
            <CategoryGridItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;