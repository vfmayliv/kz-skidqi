
import { useParams } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { ListingCard } from '@/components/ListingCard';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { CategoryPageHeader } from '@/components/category/CategoryPageHeader';
import { CategoryFiltersSection } from '@/components/category/CategoryFiltersSection';
import { CategoryListingsSection } from '@/components/category/CategoryListingsSection';
import { useCategoryLogic } from '@/hooks/useCategoryLogic';
import { getCategoryName } from '@/utils/categoryNames';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useAppWithTranslations();
  
  // Используем slug напрямую как categoryId
  const categoryId = slug;
  
  const {
    loading,
    error,
    isInitialized,
    selectedSubcategory,
    adaptedListings,
    handleSearch,
    handleSubcategorySelect
  } = useCategoryLogic(categoryId);

  const config = categoryId ? getCategoryConfig(categoryId) : null;

  // Show category tree for categories with Supabase subcategories
  const shouldShowCategoryTree = categoryId === 'kids' || 
    categoryId === 'pharmacy' || 
    categoryId === 'fashion' || 
    categoryId === 'food' || 
    categoryId === 'electronics' ||
    categoryId === 'home' ||
    categoryId === 'services' ||
    categoryId === 'pets' ||
    categoryId === 'hobby' ||
    categoryId === 'beauty';

  // Skip universal filters for transport and property categories
  const shouldShowUniversalFilters = categoryId && 
    categoryId !== 'transport' && 
    categoryId !== 'property';

  // Fall back to default components if no config is found
  const FiltersComponent = config?.filtersComponent;
  const CardComponent = config?.cardComponent || ListingCard;

  if (!categoryId) {
    return (
      <CategoryPageLayout>
        <div className="container mx-auto px-4 py-8">
          <div>{language === 'ru' ? 'Категория не найдена' : 'Санат табылмады'}</div>
        </div>
      </CategoryPageLayout>
    );
  }

  const categoryName = config?.name?.[language] || getCategoryName(categoryId, language);

  return (
    <CategoryPageLayout>
      <CategoryPageHeader categoryName={categoryName} />
      
      <div className="container mx-auto px-4 pb-8">
        <div className="flex gap-8">
          <CategoryFiltersSection
            categoryId={categoryId}
            shouldShowCategoryTree={shouldShowCategoryTree}
            shouldShowUniversalFilters={shouldShowUniversalFilters}
            selectedSubcategory={selectedSubcategory}
            onSubcategorySelect={handleSubcategorySelect}
            onSearch={handleSearch}
            FiltersComponent={FiltersComponent}
          />
          
          <CategoryListingsSection
            adaptedListings={adaptedListings}
            loading={loading}
            isInitialized={isInitialized}
            error={error}
            CardComponent={CardComponent}
          />
        </div>
      </div>
    </CategoryPageLayout>
  );
}
