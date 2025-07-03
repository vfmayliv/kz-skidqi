
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, RotateCcw } from 'lucide-react';
import { useAppWithTranslations } from '@/stores/useAppStore';

interface UniversalFiltersProps {
  filters: {
    priceRange: { min: number | null; max: number | null };
    condition: string;
    hasPhotos: boolean;
    hasDiscount: boolean;
    hasDelivery: boolean;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
  onSearch: () => void;
  categoryTreeFilter?: React.ReactNode;
}

export function UniversalFilters({ 
  filters, 
  onFilterChange, 
  onReset, 
  onSearch,
  categoryTreeFilter 
}: UniversalFiltersProps) {
  const { language } = useAppWithTranslations();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterUpdate = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    const newPriceRange = { ...localFilters.priceRange, [type]: numValue };
    handleFilterUpdate('priceRange', newPriceRange);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.priceRange.min !== null || localFilters.priceRange.max !== null) count++;
    if (localFilters.condition !== 'any') count++;
    if (localFilters.hasPhotos) count++;
    if (localFilters.hasDiscount) count++;
    if (localFilters.hasDelivery) count++;
    return count;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Tree Filter в начале */}
        {categoryTreeFilter && (
          <>
            {categoryTreeFilter}
            <Separator />
          </>
        )}

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {language === 'ru' ? 'Цена' : 'Баға'}
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder={language === 'ru' ? 'От' : 'Бастап'}
              type="number"
              value={localFilters.priceRange.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder={language === 'ru' ? 'До' : 'Дейін'}
              type="number"
              value={localFilters.priceRange.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {language === 'ru' ? 'Состояние' : 'Жағдайы'}
          </Label>
          <Select
            value={localFilters.condition}
            onValueChange={(value) => handleFilterUpdate('condition', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">
                {language === 'ru' ? 'Любое' : 'Кез келген'}
              </SelectItem>
              <SelectItem value="new">
                {language === 'ru' ? 'Новое' : 'Жаңа'}
              </SelectItem>
              <SelectItem value="used">
                {language === 'ru' ? 'Б/у' : 'Пайдаланылған'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="has-photos" className="text-sm">
              {language === 'ru' ? 'Только с фото' : 'Тек суреттімен'}
            </Label>
            <Switch
              id="has-photos"
              checked={localFilters.hasPhotos}
              onCheckedChange={(checked) => handleFilterUpdate('hasPhotos', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="has-discount" className="text-sm">
              {language === 'ru' ? 'Со скидкой' : 'Жеңілдікпен'}
            </Label>
            <Switch
              id="has-discount"
              checked={localFilters.hasDiscount}
              onCheckedChange={(checked) => handleFilterUpdate('hasDiscount', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="has-delivery" className="text-sm">
              {language === 'ru' ? 'С доставкой' : 'Жеткізумен'}
            </Label>
            <Switch
              id="has-delivery"
              checked={localFilters.hasDelivery}
              onCheckedChange={(checked) => handleFilterUpdate('hasDelivery', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={onSearch} className="w-full" size="lg">
            <Search className="w-4 h-4 mr-2" />
            {language === 'ru' ? 'Найти' : 'Табу'}
          </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button 
              onClick={onReset} 
              variant="outline" 
              className="w-full"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === 'ru' ? 'Сбросить' : 'Тазарту'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
