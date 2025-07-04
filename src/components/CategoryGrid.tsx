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

// Функция для получения компонента иконки
const getIconComponent = (iconName: string | null | undefined) => {
  if (!iconName) return LucideIcons.LayoutGrid;
  
  try {
    // Проверяем, является ли iconName уже валидным именем компонента
    // @ts-ignore - Динамический доступ к компонентам
    if (LucideIcons[iconName]) {
      // @ts-ignore
      return LucideIcons[iconName];
    }
    
    // Пытаемся сконвертировать имя из kebab-case в PascalCase
    const formattedIconName = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
    
    // @ts-ignore
    return LucideIcons[formattedIconName] || LucideIcons.LayoutGrid;
  } catch (error) {
    console.error('Ошибка при получении иконки:', error);
    return LucideIcons.LayoutGrid;
  }
};

// Отображение категорий в виде карточек
const CategoryCard = ({ icon: Icon, name, loading = false }) => (
  <div className="flex flex-col items-center justify-center h-full">
    {loading ? (
      <>
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 animate-pulse w-16 rounded"></div>
      </>
    ) : (
      <>
        <Icon className="w-10 h-10 mb-2 text-primary" />
        <span className="text-sm font-medium text-center">{name}</span>
      </>
    )}
  </div>
);

// Компонент для одной кнопки категории в сетке
const CategoryGridItem = ({ category }: { category: Category }) => {
  const { language, t } = useAppWithTranslations();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  // Категории, которые являются прямыми ссылками (без всплывающего меню)
  const directLinkSlugs = ['property', 'transport', 'free'];

  // Получаем подкатегории для данной категории
  const { categories: subcategories, loading: subcategoriesLoading } = useSubcategories(category.id);

  // Получаем компонент иконки
  const IconComponent = getIconComponent(category.icon);

  // Выводим информацию для отладки
  useEffect(() => {
    console.log(`Категория: ${category.name}, Icon: ${category.icon}`);
  }, [category]);

  // Если категория в списке directLinkSlugs, то создаем просто ссылку без всплывающего меню
  if (directLinkSlugs.includes(category.slug)) {
    return (
      <Link to={`/listings/${category.slug}`} className="text-center">
        <Button 
          variant="outline" 
          className="h-24 w-full p-2 flex flex-col items-center justify-center hover:bg-gray-50 border border-gray-200"
        >
          <CategoryCard 
            icon={IconComponent} 
            name={category.name || `Категория ${category.id}`}
          />
        </Button>
      </Link>
    );
  }

  // Для остальных категорий добавляем всплывающее меню с подкатегориями
  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-24 w-full p-2 flex flex-col items-center justify-center hover:bg-gray-50 border border-gray-200"
        >
          <CategoryCard 
            icon={IconComponent} 
            name={category.name || `Категория ${category.id}`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="font-medium mb-2 pb-2 border-b">{category.name || `Категория ${category.id}`}</div>
        {subcategoriesLoading ? (
          <div className="p-2 text-center text-gray-500">Загрузка...</div>
        ) : subcategories.length > 0 ? (
          <div className="grid gap-1 max-h-80 overflow-y-auto">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/listings/${subcategory.slug}`}
                className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => setPopoverOpen(false)}
              >
                {subcategory.name || `Подкатегория ${subcategory.id}`}
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-2 text-center text-gray-500">Нет подкатегорий</div>
        )}
      </PopoverContent>
    </Popover>
  );
};

// Основной компонент сетки категорий
const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const { language, t } = useAppWithTranslations();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Получаем все активные категории
        const { data: allData, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        
        // Для отладки выводим все полученные категории
        console.log('Все категории из БД:', allData);

        // Отбираем основные категории по массиву MAIN_CATEGORY_IDS
        const mainCats = allData
          .filter(cat => MAIN_CATEGORY_IDS.includes(cat.id))
          .sort((a, b) => a.sort_order - b.sort_order);
        
        if (mainCats.length > 0) {
          setMainCategories(mainCats);
          console.log('Отфильтрованные основные категории:', mainCats);
        } else {
          // Запасной вариант - берем первые 13 категорий
          setMainCategories(allData.slice(0, 13));
          console.log('Используем первые 13 категорий:', allData.slice(0, 13));
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