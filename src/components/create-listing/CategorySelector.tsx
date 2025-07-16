
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useCategorySteps } from '@/hooks/useCategorySteps';
import { useTranslation } from '@/hooks/use-translation';

interface CategorySelectorProps {
  onCategorySelect: (categoryId: number) => void;
  selectedCategoryId?: number;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  onCategorySelect, 
  selectedCategoryId 
}) => {
  const { t } = useTranslation();
  const {
    currentStep,
    categories,
    breadcrumbs,
    loading,
    error,
    loadMainCategories,
    loadSubcategories,
    goBack,
    reset
  } = useCategorySteps();

  useEffect(() => {
    loadMainCategories();
  }, [loadMainCategories]);

  const handleCategoryClick = async (category: any) => {
    console.log('Category clicked:', category);
    
    // If this is a leaf category (no subcategories), select it
    if (category.level >= 4) {
      onCategorySelect(category.id);
      return;
    }
    
    // Load subcategories
    await loadSubcategories(category.id);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      reset();
    } else {
      // Go back to specific level
      for (let i = breadcrumbs.length - 1; i > index; i--) {
        goBack();
      }
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>{t('error.loading.categories')}</p>
            <Button 
              variant="outline" 
              onClick={loadMainCategories}
              className="mt-2"
            >
              {t('try.again')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t('select.category')}
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => handleBreadcrumbClick(0)}
              className="hover:text-primary transition-colors"
            >
              {t('main.categories')}
            </button>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-3 w-3" />
                <button
                  onClick={() => handleBreadcrumbClick(index + 1)}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.name_ru}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}
        
        {/* Back button */}
        {breadcrumbs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('back')}
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {categories.length === 0 && !loading ? (
          <div className="text-center text-muted-foreground">
            {t('no.categories')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className="h-auto p-4 text-left justify-start"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="font-medium">{category.name_ru}</span>
                  {category.level < 4 && (
                    <Badge variant="secondary" className="mt-1">
                      {t('has.subcategories')}
                    </Badge>
                  )}
                </div>
                {category.level < 4 && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
