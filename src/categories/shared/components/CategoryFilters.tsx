
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppWithTranslations } from '@/stores/useAppStore';

interface CategoryFiltersProps {
  config: Record<string, any>;
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

export const CategoryFilters = ({
  config,
  filters,
  onFilterChange,
  onReset
}: CategoryFiltersProps) => {
  const { language } = useAppWithTranslations();
  
  const handleSelectChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const handleCheckboxChange = (key: string, checked: boolean | "indeterminate") => {
    onFilterChange({ ...filters, [key]: checked === true });
  };
  
  const handleSliderChange = (key: string, value: number[]) => {
    onFilterChange({ 
      ...filters, 
      [key]: { min: value[0], max: value[1] } 
    });
  };
  
  const handleInputChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  return (
    <div className="space-y-6">
      {config.filterGroups?.map((group: any, index: number) => (
        <div key={index} className="space-y-4">
          <h3 className="text-sm font-medium">{group.title[language]}</h3>
          
          {group.type === 'select' && (
            <Select 
              value={filters[group.key] || ''} 
              onValueChange={(value) => handleSelectChange(group.key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={group.placeholder?.[language] || ''} />
              </SelectTrigger>
              <SelectContent>
                {group.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {group.type === 'checkbox' && group.options.map((option: any) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`${group.key}-${option.value}`} 
                checked={filters[option.value] === true}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked)}
              />
              <Label htmlFor={`${group.key}-${option.value}`}>
                {option.label[language]}
              </Label>
            </div>
          ))}
          
          {group.type === 'range' && (
            <div className="space-y-4">
              <Slider 
                defaultValue={[
                  filters[group.key]?.min || group.min, 
                  filters[group.key]?.max || group.max
                ]}
                min={group.min}
                max={group.max}
                step={group.step}
                onValueChange={(value) => handleSliderChange(group.key, value as number[])}
              />
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={filters[group.key]?.min || ''}
                  onChange={(e) => handleInputChange(`${group.key}.min`, e.target.value)}
                  placeholder={group.minLabel?.[language] || ''}
                  className="w-24"
                />
                <span>-</span>
                <Input
                  type="number"
                  value={filters[group.key]?.max || ''}
                  onChange={(e) => handleInputChange(`${group.key}.max`, e.target.value)}
                  placeholder={group.maxLabel?.[language] || ''}
                  className="w-24"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <Button onClick={onReset} variant="outline" size="sm" className="mt-4">
        {language === 'ru' ? 'Сбросить фильтры' : 'Сүзгілерді қалпына келтіру'}
      </Button>
    </div>
  );
};
