
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  categoryId: string;
  title: string;
  language: string;
}

export const Breadcrumbs = ({ categoryId, title, language }: BreadcrumbsProps) => {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto py-3 px-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            {language === 'ru' ? 'Главная' : 'Басты бет'}
          </Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <Link to={`/category/${categoryId}`} className="hover:text-primary">
            {language === 'ru' ? 'Категория' : 'Санат'}
          </Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          <span className="text-foreground truncate max-w-[180px] md:max-w-xs">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};
