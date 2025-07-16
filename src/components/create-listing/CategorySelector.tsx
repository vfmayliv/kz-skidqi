
import React, { useEffect, memo } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Home, Loader2 } from 'lucide-react';
import { useCategorySteps, CategoryStep } from '@/hooks/useCategorySteps';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryCard = memo(({ 
  category, 
  onClick, 
  isSelected = false 
}: { 
  category: CategoryStep; 
  onClick: () => void;
  isSelected?: boolean;
}) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
      isSelected && "ring-2 ring-primary"
    )}
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{category.name_ru}</h3>
          <p className="text-xs text-muted-foreground">{category.name_kz}</p>
        </div>
        {category.hasChildren && (
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
        )}
      </div>
    </CardContent>
  </Card>
));

CategoryCard.displayName = 'CategoryCard';

const Breadcrumb = memo(({ 
  categoryPath, 
  onNavigate 
}: { 
  categoryPath: any[]; 
  onNavigate: (stepIndex: number) => void;
}) => (
  <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onNavigate(-1)}
      className="h-8 px-2"
    >
      <Home className="h-4 w-4" />
    </Button>
    
    {categoryPath.map((pathItem, index) => (
      <React.Fragment key={pathItem.category.id}>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(index)}
          className="h-8 px-2 text-xs"
        >
          {pathItem.category.name_ru}
        </Button>
      </React.Fragment>
    ))}
  </div>
));

Breadcrumb.displayName = 'Breadcrumb';

export const CategorySelector: React.FC<CategorySelectorProps> = memo(({
  selectedCategoryId,
  onCategoryChange
}) => {
  const {
    currentCategories,
    categoryPath,
    loading,
    error,
    loadMainCategories,
    loadSubcategories,
    goBack
  } = useCategorySteps();

  useEffect(() => {
    loadMainCategories();
  }, [loadMainCategories]);

  const handleCategoryClick = async (category: CategoryStep) => {
    if (category.hasChildren) {
      // Если у категории есть дочерние элементы, загружаем их
      await loadSubcategories(category.id, category);
    } else {
      // Если это конечная категория, выбираем её
      onCategoryChange(category.id.toString());
    }
  };

  const handleBreadcrumbNavigation = async (stepIndex: number) => {
    await goBack(stepIndex);
  };

  if (error) {
    return (
      <div className="mb-4">
        <Label>Категория *</Label>
        <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
          <p className="text-sm text-destructive">
            Ошибка загрузки категорий: {error}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadMainCategories}
            className="mt-2"
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Label className="text-base font-medium mb-3 block">Категория *</Label>
      
      {/* Хлебные крошки */}
      {categoryPath.length > 0 && (
        <Breadcrumb 
          categoryPath={categoryPath} 
          onNavigate={handleBreadcrumbNavigation}
        />
      )}

      {/* Заголовок текущего уровня */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {categoryPath.length === 0 
            ? 'Выберите основную категорию'
            : `Выберите подкатегорию в "${categoryPath[categoryPath.length - 1].category.name_ru}"`
          }
        </h3>
      </div>

      {/* Индикатор загрузки */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Загрузка категорий...</span>
        </div>
      )}

      {/* Сетка категорий */}
      {!loading && currentCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category)}
              isSelected={selectedCategoryId === category.id.toString()}
            />
          ))}
        </div>
      )}

      {/* Сообщение о пустом списке */}
      {!loading && currentCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Категории не найдены</p>
        </div>
      )}

      {/* Выбранная категория */}
      {selectedCategoryId && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Выбранная категория:</p>
              <p className="text-xs text-muted-foreground mt-1">
                {categoryPath.map(p => p.category.name_ru).join(' → ')}
                {categoryPath.length > 0 && ' → '}
                {currentCategories.find(c => c.id.toString() === selectedCategoryId)?.name_ru}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategoryChange('')}
              className="text-xs"
            >
              Очистить
            </Button>
          </div>
        </div>
      )}

      {/* Кнопка "Назад" */}
      {categoryPath.length > 0 && (
        <div className="mt-4 flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBreadcrumbNavigation(categoryPath.length - 2)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>
      )}
    </div>
  );
});

CategorySelector.displayName = 'CategorySelector';
