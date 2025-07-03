
import { ReactElement } from 'react';

export interface CategoryConfig {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
  filtersComponent: React.ComponentType<any>;
  cardComponent: React.ComponentType<any>;
  pageComponent?: React.ComponentType<any>;
  styles?: string;
  filterConfig?: any;
}

export interface CategoryComponentProps {
  categoryId: string;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}
