
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCategoryHierarchy } from '@/hooks/useCategoryHierarchy';

interface CategorySelectorProps {
  selectedCategories: (any | null)[];
  onCategoryChange: (level: number, categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoryChange
}) => {
  const { categories: categoryTree, loading: categoriesLoading } = useCategoryHierarchy();

  // Вспомогательная функция для поиска категории по ID
  const findCategoryById = (categories: any[], id: string): any | null => {
    for (const category of categories) {
      if (category.id.toString() === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Получаем доступные подкатегории для текущего уровня
  const getAvailableCategories = (level: number) => {
    if (level === 0) {
      // Для первого уровня возвращаем корневые категории
      return categoryTree;
    }
    
    // Для последующих уровней возвращаем дочерние категории предыдущего выбранного элемента
    const parentCategory = selectedCategories[level - 1];
    return parentCategory?.children || [];
  };

  // Получаем максимальный уровень для отображения селектов
  const getMaxDisplayLevel = () => {
    for (let i = 0; i < selectedCategories.length; i++) {
      if (!selectedCategories[i]) {
        return i;
      }
    }
    return selectedCategories.length;
  };

  if (categoriesLoading) {
    return (
      <div className="mb-4">
        <Label>Категория *</Label>
        <div className="text-sm text-gray-500">Загрузка категорий...</div>
      </div>
    );
  }

  const maxLevel = getMaxDisplayLevel();
  const levelLabels = ['Выберите категорию', 'Выберите подкатегорию', 'Выберите подкатегорию'];

  return (
    <div className="mb-4">
      <Label>Категория *</Label>
      <div className="space-y-3">
        {/* Динамически создаем селекты для каждого уровня */}
        {Array.from({ length: maxLevel + 1 }, (_, level) => {
          const availableCategories = getAvailableCategories(level);
          const selectedValue = selectedCategories[level]?.id?.toString() || '';
          
          // Показываем селект только если есть доступные категории
          if (availableCategories.length === 0) return null;

          return (
            <div key={level}>
              <Select 
                value={selectedValue}
                onValueChange={(value) => onCategoryChange(level, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={levelLabels[level] || `Уровень ${level + 1}`} />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name_ru}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Показываем путь выбранных категорий */}
              {selectedCategories[level] && (
                <div className="text-xs text-gray-500 mt-1">
                  Выбрано: {selectedCategories[level].name_ru}
                  {selectedCategories[level].children && selectedCategories[level].children.length > 0 && (
                    <span className="ml-2 text-blue-600">
                      ({selectedCategories[level].children.length} подкатегорий доступно)
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Показываем полный путь выбранных категорий */}
        {selectedCategories.some(cat => cat !== null) && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <div className="text-sm font-medium text-gray-700 mb-1">Выбранный путь:</div>
            <div className="text-sm text-gray-600">
              {selectedCategories
                .filter(cat => cat !== null)
                .map(cat => cat.name_ru)
                .join(' → ')
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
