
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';

interface Category {
  id: number;
  name_ru: string;
  name_kk: string;
  parent_id: number | null;
  level: number;
  children?: Category[];
}

interface CategoryTreeSelectorProps {
  selectedCategories: number[];
  onCategoriesChange: (categoryIds: number[]) => void;
  multiSelect?: boolean;
}

export const CategoryTreeSelector = ({ 
  selectedCategories, 
  onCategoriesChange, 
  multiSelect = true 
}: CategoryTreeSelectorProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = filterCategories(categories, searchTerm.toLowerCase());
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('level', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const categoryTree = buildCategoryTree(data || []);
      setCategories(categoryTree);
    } catch (error: any) {
      console.error('Ошибка загрузки категорий:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить категории"
      });
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (flatCategories: any[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // Создаем карту категорий
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, {
        ...cat,
        children: []
      });
    });

    // Строим дерево
    flatCategories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const filterCategories = (categories: Category[], term: string): Category[] => {
    const filtered: Category[] = [];

    for (const category of categories) {
      const matches = category.name_ru.toLowerCase().includes(term) || 
                     category.name_kk.toLowerCase().includes(term);
      
      const filteredChildren = category.children ? filterCategories(category.children, term) : [];
      
      if (matches || filteredChildren.length > 0) {
        filtered.push({
          ...category,
          children: filteredChildren
        });
      }
    }

    return filtered;
  };

  const toggleExpanded = (categoryId: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (categoryId: number) => {
    if (multiSelect) {
      const newSelection = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      onCategoriesChange(newSelection);
    } else {
      onCategoriesChange([categoryId]);
    }
  };

  const getSelectedCategoryNames = () => {
    const findCategoryName = (categories: Category[], id: number): string | null => {
      for (const cat of categories) {
        if (cat.id === id) return cat.name_ru;
        if (cat.children) {
          const found = findCategoryName(cat.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return selectedCategories.map(id => findCategoryName(categories, id)).filter(Boolean);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedNodes.has(category.id);
    const isSelected = selectedCategories.includes(category.id);

    return (
      <div key={category.id} className="select-none">
        <div 
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted ${
            isSelected ? 'bg-primary/10 border border-primary/20' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <div className="w-6" />
          )}
          
          <button
            onClick={() => handleCategorySelect(category.id)}
            className="flex-1 text-left text-sm"
          >
            {category.name_ru}
          </button>
          
          {isSelected && (
            <Badge variant="secondary" className="text-xs">
              Выбрано
            </Badge>
          )}
        </div>
        
        {hasChildren && isExpanded && category.children && (
          <div>
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Загрузка категорий...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Выбор категорий</CardTitle>
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск категорий..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {getSelectedCategoryNames().map((name, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleCategorySelect(selectedCategories[index])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-1">
          {filteredCategories.map(category => renderCategory(category))}
        </div>
      </CardContent>
    </Card>
  );
};
