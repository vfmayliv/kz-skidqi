
import React, { useMemo } from 'react';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useAppStore } from '@/stores/useAppStore';
import { SegmentWithPropertyTypes, FullFilterConfig, PropertyTypeWithFilters } from '@/lib/filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, X } from 'lucide-react';

interface PropertyFiltersProps { 
  config: SegmentWithPropertyTypes[];
  onFilterChange: (filters: any) => void;
  onSearch: () => void;
}

const dealTypes = [
  { id: 'sale', name: { ru: 'Купить', kz: 'Сатып алу' } },
  { id: 'rent', name: { ru: 'Снять', kz: 'Жалға алу' } },
];

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ config, onFilterChange, onSearch }) => {
  const { language } = useAppStore();
  const { dealType, segment, propertyType, values, setDealType, setSegment, setPropertyType, setFilterValue, resetFilters } = usePropertyFiltersStore();

  const handleDealTypeChange = (value: string) => {
    if (value) {
      setDealType(value);
      setSegment('');
      setPropertyType('');
    }
  };

  const handleSegmentChange = (value: string) => {
    if (value) {
      setSegment(value);
      setPropertyType('');
    }
  };
  
  const handlePropertyTypeChange = (value: string) => {
    if (value) {
      setPropertyType(value);
    }
  };

  const handleValueChange = (filterId: string, value: any) => {
    setFilterValue(filterId, value);
  };
  
  const handleReset = () => {
    resetFilters();
  }

  const activeSegments = useMemo(() => {
    return config.map(s => ({ id: s.id, name: { ru: s.name_ru, kz: s.name_kz } }));
  }, [config]);

  const availablePropertyTypes = useMemo(() => {
    if (!segment) return [];
    const selectedSegment = config.find(s => s.id === segment);
    return selectedSegment ? selectedSegment.property_types : [];
  }, [config, segment]);
  
  const selectedPropertyTypeDetails = useMemo(() => {
    if (!propertyType) return null;
    return availablePropertyTypes.find(pt => pt.id === propertyType);
  }, [availablePropertyTypes, propertyType]);


  const renderFilter = (filter: FullFilterConfig) => {
    const filterLabel = language === 'ru' ? filter.name_ru : filter.name_kz;
    const rangeValue = values[filter.id] || {};

    switch (filter.type) {
      case 'range':
        return (
          <div key={filter.id} className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">{filterLabel}</label>
            <Input
              type="number"
              placeholder="от"
              className="w-24"
              value={rangeValue.from || ''}
              onChange={(e) => handleValueChange(filter.id, { ...rangeValue, from: e.target.value ? Number(e.target.value) : undefined})}
            />
            <Input
              type="number"
              placeholder="до"
              className="w-24"
              value={rangeValue.to || ''}
              onChange={(e) => handleValueChange(filter.id, { ...rangeValue, to: e.target.value ? Number(e.target.value) : undefined})}
            />
          </div>
        );
      case 'select':
        return (
          <div key={filter.id}>
            <Select onValueChange={(value) => handleValueChange(filter.id, value)} value={values[filter.id] || ''}>
              <SelectTrigger className="w-auto min-w-[180px] flex-shrink-0">
                <SelectValue placeholder={filterLabel} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map(option => (
                  <SelectItem key={option.id} value={option.value}>
                    {language === 'ru' ? option.name_ru : option.name_kz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'boolean':
        return (
          <div key={filter.id} className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id={filter.id} 
              checked={!!values[filter.id]}
              onCheckedChange={(checked) => handleValueChange(filter.id, checked)}
            />
            <Label htmlFor={filter.id}>{filterLabel}</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg mb-8">
      <div className="flex flex-wrap gap-x-4 gap-y-3 items-center">
        <ToggleGroup type="single" value={dealType} onValueChange={handleDealTypeChange} className="bg-muted p-1 rounded-md">
          {dealTypes.map(dt => (
            <ToggleGroupItem key={dt.id} value={dt.id} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3">
              {dt.name[language]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        
        {dealType && activeSegments.length > 0 && (
          <ToggleGroup type="single" value={segment} onValueChange={handleSegmentChange} className="bg-muted p-1 rounded-md">
            {activeSegments.map(s => (
              <ToggleGroupItem key={s.id} value={s.id} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3">
                {s.name[language]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        
        {segment && availablePropertyTypes.length > 0 && (
          <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
            <SelectTrigger className="w-auto min-w-[180px] flex-shrink-0">
              <SelectValue placeholder="Тип недвижимости" />
            </SelectTrigger>
            <SelectContent>
              {availablePropertyTypes.map(pt => (
                <SelectItem key={pt.id} value={pt.id}>
                  {language === 'ru' ? pt.name_ru : pt.name_kz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedPropertyTypeDetails && (
        <div className="space-y-4 pt-4 mt-4 border-t">
          <h3 className="font-semibold">{language === 'ru' ? selectedPropertyTypeDetails.name_ru : selectedPropertyTypeDetails.name_kz}</h3>
          <div className="flex flex-wrap gap-4 items-end">
            {selectedPropertyTypeDetails.filters.map(renderFilter)}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4 pt-4 border-t justify-end">
        <Button onClick={onSearch}>
          <Search className="mr-2 h-4 w-4" /> Поиск
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <X className="mr-2 h-4 w-4"/> Сбросить
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;
