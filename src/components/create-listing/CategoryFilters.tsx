
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getFiltersForDeal } from '@/lib/filters';
import { useQuery } from '@tanstack/react-query';

interface CategoryFiltersProps {
  selectedCategory: any;
  formData: any;
  onFilterChange: (filterKey: string, value: any) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  formData,
  onFilterChange
}) => {
  // Получаем фильтры для выбранной категории
  const { data: categoryFilters, isLoading } = useQuery({
    queryKey: ['category-filters', selectedCategory?.id],
    queryFn: () => getFiltersForDeal('sale'), // По умолчанию для продажи
    enabled: !!selectedCategory,
  });

  if (!selectedCategory) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mb-4">
        <Label>Дополнительные параметры</Label>
        <div className="text-sm text-gray-500">Загрузка фильтров...</div>
      </div>
    );
  }

  if (!categoryFilters || categoryFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 space-y-4">
      <Label className="text-lg font-semibold">Дополнительные параметры</Label>
      
      {categoryFilters.map((segment: any) => (
        <div key={segment.id} className="space-y-3">
          <h4 className="font-medium text-gray-700">{segment.name_ru}</h4>
          
          {segment.property_types?.map((propertyType: any) => (
            <div key={propertyType.id} className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600">{propertyType.name_ru}</h5>
              
              {propertyType.filters?.map((filter: any) => (
                <div key={filter.id} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Label htmlFor={filter.id} className="text-sm">
                    {filter.name_ru}
                  </Label>
                  
                  {filter.type === 'range' && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="От"
                        value={formData.filters?.[filter.id]?.min || ''}
                        onChange={(e) => onFilterChange(filter.id, {
                          ...formData.filters?.[filter.id],
                          min: e.target.value
                        })}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="До"
                        value={formData.filters?.[filter.id]?.max || ''}
                        onChange={(e) => onFilterChange(filter.id, {
                          ...formData.filters?.[filter.id],
                          max: e.target.value
                        })}
                        className="flex-1"
                      />
                    </div>
                  )}
                  
                  {filter.type === 'select' && (
                    <Select 
                      onValueChange={(value) => onFilterChange(filter.id, value)}
                      value={formData.filters?.[filter.id] || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options?.map((option: any) => (
                          <SelectItem key={option.id} value={option.value}>
                            {option.name_ru}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {filter.type === 'boolean' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.id}
                        checked={formData.filters?.[filter.id] || false}
                        onCheckedChange={(checked) => onFilterChange(filter.id, checked)}
                      />
                      <Label htmlFor={filter.id} className="text-sm">
                        Да
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
