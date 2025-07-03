
import { CategoryConfig } from './shared/types';
import { categories } from '@/data/categories';
import { ListingCard } from '@/components/ListingCard';
import { CategoryFilters } from './shared/components/CategoryFilters';

// This registry will be populated with all category configurations
export const categoryRegistry: Record<string, CategoryConfig> = {};

// Initialize the registry with basic data from the existing categories
export const initializeCategoryRegistry = () => {
  // Loop through all categories from the data
  categories.forEach(category => {
    categoryRegistry[category.id] = {
      id: category.id,
      name: category.name,
      // Use default components until actual ones are registered
      filtersComponent: CategoryFilters,
      cardComponent: ListingCard,
      styles: `/src/categories/${category.id}/styles/style.css`,
      filterConfig: {},
    };
  });
};

// Call this function to initialize the registry
initializeCategoryRegistry();

// Getter function to access category configurations
export const getCategoryConfig = (categoryId: string): CategoryConfig | undefined => {
  return categoryRegistry[categoryId];
};

// Function to register a new category configuration or update an existing one
export const registerCategoryConfig = (config: CategoryConfig) => {
  categoryRegistry[config.id] = config;
};
