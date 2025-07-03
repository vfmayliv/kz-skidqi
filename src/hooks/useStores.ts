
import { useAppStore } from '@/stores/useAppStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { useTransportFiltersStore } from '@/stores/useTransportFiltersStore';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';

export const useStores = () => {
  const appStore = useAppStore();
  const searchStore = useSearchStore();
  const transportFiltersStore = useTransportFiltersStore();
  const propertyFiltersStore = usePropertyFiltersStore();
  
  return {
    app: appStore,
    search: searchStore,
    transportFilters: transportFiltersStore,
    propertyFilters: propertyFiltersStore
  };
};
