
import { CategoryConfig } from '../shared/types';
import TransportCard from '@/components/transport/TransportCard';
import TransportFilters from '@/components/transport/TransportFilters';
import TransportCategoryPage from './components/TransportCategoryPage';
import { transportFilterConfig } from './filterConfig';

export const transportConfig: CategoryConfig = {
  id: 'transport',
  name: { 
    ru: 'Транспорт', 
    kz: 'Көлік' 
  },
  filtersComponent: TransportFilters,
  cardComponent: TransportCard,
  pageComponent: TransportCategoryPage,
  styles: '/src/categories/transport/styles/style.css',
  filterConfig: transportFilterConfig,
};

// Register this configuration
import { registerCategoryConfig } from '../categoryRegistry';
registerCategoryConfig(transportConfig);
