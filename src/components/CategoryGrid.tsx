
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/categories';

// Компонент для одной кнопки категории
const CategoryButton = ({ category }: { category: any }) => {
  const { language } = useAppWithTranslations();
  
  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <Link
      to={category.id === 'property' ? '/property' : 
           category.id === 'transport' ? '/transport' : 
           `/category/${category.id}`}
      className="text-center"
    >
      <Button variant="ghost" className="h-auto p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors w-full">
        <DynamicIcon name={category.icon} className="h-8 w-8 mb-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">
          {category.name[language]}
        </span>
      </Button>
    </Link>
  );
};

// Основной компонент сетки категорий
const CategoryGrid = () => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <CategoryButton key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
