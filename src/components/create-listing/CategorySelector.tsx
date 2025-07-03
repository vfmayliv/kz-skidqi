
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

  if (categoriesLoading) {
    return (
      <div className="mb-4">
        <Label>Категория *</Label>
        <div className="text-sm text-gray-500">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Label>Категория *</Label>
      <div className="space-y-2">
        {/* Основные категории */}
        <Select onValueChange={(value) => onCategoryChange(0, value)}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {categoryTree.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name.ru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Подкатегории первого уровня */}
        {selectedCategories[0]?.subcategories && selectedCategories[0].subcategories.length > 0 && (
          <Select onValueChange={(value) => onCategoryChange(1, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите подкатегорию" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategories[0].subcategories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name.ru}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Подкатегории второго уровня */}
        {selectedCategories[1]?.subcategories && selectedCategories[1].subcategories.length > 0 && (
          <Select onValueChange={(value) => onCategoryChange(2, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите подкатегорию" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategories[1].subcategories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name.ru}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
