
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { useChildrenCategories } from '@/hooks/useChildrenCategories';
import { usePharmacyCategories } from '@/hooks/usePharmacyCategories';
import { useFashionCategories } from '@/hooks/useFashionCategories';
import { useFoodCategories } from '@/hooks/useFoodCategories';
import { useTechElectronicsCategories } from '@/hooks/useTechElectronicsCategories';
import { useHomeCategories } from '@/hooks/useHomeCategories';
import { useServicesCategories } from '@/hooks/useServicesCategories';
import { usePetCategories } from '@/hooks/usePetCategories';
import { useHobbiesCategories } from '@/hooks/useHobbiesCategories';
import { useBeautyCategories } from '@/hooks/useBeautyCategories';

interface CategoryTreeNode {
  id: string;
  name: { ru: string; kz: string };
  level: number;
  parent_id: string | null;
  children?: CategoryTreeNode[];
}

interface CategoryTreeFilterProps {
  categoryId: string;
  onCategorySelect: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export function CategoryTreeFilter({ categoryId, onCategorySelect, selectedCategoryId }: CategoryTreeFilterProps) {
  const { language } = useAppWithTranslations();
  const { categories: childrenCategories } = useChildrenCategories();
  const { categories: pharmacyCategories } = usePharmacyCategories();
  const { categories: fashionCategories } = useFashionCategories();
  const { categories: foodCategories } = useFoodCategories();
  const { categories: techElectronicsCategories } = useTechElectronicsCategories();
  const { categories: homeCategories } = useHomeCategories();
  const { categories: servicesCategories } = useServicesCategories();
  const { categories: petCategories } = usePetCategories();
  const { categories: hobbiesCategories } = useHobbiesCategories();
  const { categories: beautyCategories } = useBeautyCategories();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Build tree structure from flat array
  const buildTree = (categories: any[]): CategoryTreeNode[] => {
    const categoryMap = new Map<string, CategoryTreeNode>();
    const tree: CategoryTreeNode[] = [];

    // Create nodes
    categories.forEach(cat => {
      categoryMap.set(cat.id, {
        id: cat.slug || cat.id,
        name: { ru: cat.name_ru, kz: cat.name_kz },
        level: cat.level,
        parent_id: cat.parent_id,
        children: []
      });
    });

    // Build tree structure
    categories.forEach(cat => {
      const node = categoryMap.get(cat.id);
      if (!node) return;

      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (node: CategoryTreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedCategoryId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded ${
            isSelected ? 'bg-blue-100 text-blue-800' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => onCategorySelect(node.id)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1" />
          )}
          <span className="text-sm">{node.name[language]}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get appropriate categories based on categoryId
  let categories: any[] = [];
  if (categoryId === 'kids') {
    categories = childrenCategories;
  } else if (categoryId === 'pharmacy') {
    categories = pharmacyCategories;
  } else if (categoryId === 'fashion') {
    categories = fashionCategories;
  } else if (categoryId === 'food') {
    categories = foodCategories;
  } else if (categoryId === 'electronics') {
    categories = techElectronicsCategories;
  } else if (categoryId === 'home') {
    categories = homeCategories;
  } else if (categoryId === 'services') {
    categories = servicesCategories;
  } else if (categoryId === 'pets') {
    categories = petCategories;
  } else if (categoryId === 'hobby') {
    categories = hobbiesCategories;
  } else if (categoryId === 'beauty') {
    categories = beautyCategories;
  }

  if (categories.length === 0) {
    return null;
  }

  const tree = buildTree(categories);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">
        {language === 'ru' ? 'Подкатегории' : 'Ішкі санаттар'}
      </h3>
      <div className="max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
        {tree.map(node => renderTreeNode(node))}
      </div>
    </div>
  );
}
