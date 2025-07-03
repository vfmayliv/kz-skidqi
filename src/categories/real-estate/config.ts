
import { CategoryConfig } from '../shared/types';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';

export const realEstateConfig: CategoryConfig = {
  id: 'property',
  name: { 
    ru: 'Недвижимость', 
    kz: 'Жылжымайтын мүлік' 
  },
  filtersComponent: PropertyFilters,
  cardComponent: PropertyCard,
  styles: '/src/categories/real-estate/styles/style.css',
  filterConfig: {
    dealTypes: [
      { id: 'sale', label: { ru: 'Продажа', kz: 'Сату' } },
      { id: 'rent', label: { ru: 'Аренда', kz: 'Жалға алу' } }
    ],
    // Add other real estate specific filter configurations
  },
};

// Register this configuration
import { registerCategoryConfig } from '../categoryRegistry';
registerCategoryConfig(realEstateConfig);
