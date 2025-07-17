
import { useState, useCallback } from 'react';
import { 
  loadMainCategories as loadMainCats, 
  loadSubcategories as loadSubCats,
  hasSubcategories
} from '@/utils/categoryUtils';

interface Category {
  id: string;
  name_ru: string;
  name_kz: string;
  parent_id: string | null;
  level: number;
  slug: string;
}

interface Breadcrumb {
  id: string;
  name_ru: string;
  name_kz: string;
}

export const useCategorySteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingChildren, setCheckingChildren] = useState<string | null>(null);

  const loadMainCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading main categories...');
      const mainCategories = await loadMainCats();
      console.log('Loaded main categories:', mainCategories);
      
      setCategories(mainCategories);
      setBreadcrumbs([]);
      setCurrentStep(0);
    } catch (err) {
      console.error('Error loading main categories:', err);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubcategories = useCallback(async (parentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading subcategories for parent:', parentId);
      const subcategories = await loadSubCats(parentId);
      console.log('Loaded subcategories:', subcategories);
      
      // Find the parent category to add to breadcrumbs
      const parentCategory = categories.find(cat => cat.id === parentId);
      if (parentCategory) {
        setBreadcrumbs(prev => [...prev, {
          id: parentCategory.id,
          name_ru: parentCategory.name_ru,
          name_kz: parentCategory.name_kz
        }]);
      }
      
      setCategories(subcategories);
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      console.error('Error loading subcategories:', err);
      setError('Failed to load subcategories');
    } finally {
      setLoading(false);
    }
  }, [categories]);

  const checkIfLeafCategory = useCallback(async (categoryId: string): Promise<boolean> => {
    setCheckingChildren(categoryId);
    try {
      const hasChildren = await hasSubcategories(categoryId);
      return !hasChildren;
    } catch (err) {
      console.error('Error checking if category is leaf:', err);
      return false;
    } finally {
      setCheckingChildren(null);
    }
  }, []);

  const goBack = useCallback(async () => {
    if (breadcrumbs.length === 0) return;
    
    const newBreadcrumbs = [...breadcrumbs];
    newBreadcrumbs.pop();
    setBreadcrumbs(newBreadcrumbs);
    
    if (newBreadcrumbs.length === 0) {
      // Go back to main categories
      await loadMainCategories();
    } else {
      // Load subcategories of the previous level
      const parentId = newBreadcrumbs[newBreadcrumbs.length - 1].id;
      setLoading(true);
      try {
        const subcategories = await loadSubCats(parentId);
        setCategories(subcategories);
        setCurrentStep(prev => prev - 1);
      } catch (err) {
        console.error('Error loading previous level:', err);
        setError('Failed to load previous level');
      } finally {
        setLoading(false);
      }
    }
  }, [breadcrumbs, loadMainCategories]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setBreadcrumbs([]);
    loadMainCategories();
  }, [loadMainCategories]);

  return {
    currentStep,
    categories,
    breadcrumbs,
    loading,
    error,
    checkingChildren,
    loadMainCategories,
    loadSubcategories,
    checkIfLeafCategory,
    goBack,
    reset
  };
};
