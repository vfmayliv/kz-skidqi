
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbNavigationProps {
  items?: {
    label: string;
    link?: string;
  }[];
  currentPage?: string;
}

export const BreadcrumbNavigation = ({
  items = [],
  currentPage,
}: BreadcrumbNavigationProps) => {
  const location = useLocation();
  const { language } = useAppWithTranslations();
  
  // Generate breadcrumbs based on the current URL if no items were provided
  const breadcrumbItems = items.length > 0
    ? items
    : location.pathname
        .split('/')
        .filter(Boolean)
        .map((segment, index, array) => {
          // Skip the last segment if currentPage is provided
          if (currentPage && index === array.length - 1) {
            return null;
          }
          
          // Build the path up to this segment
          const path = `/${array.slice(0, index + 1).join('/')}`;
          
          // Try to generate a readable label from the segment
          let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          
          // If it's a category ID, we could lookup the actual category name here
          // For now, we'll just use a simple capitalized version
          
          return {
            label,
            link: path,
          };
        })
        .filter(Boolean) as { label: string; link?: string }[];

  return (
    <Breadcrumb className="py-3 px-4 border-b">
      <BreadcrumbList className="container mx-auto">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">{language === 'ru' ? 'Главная' : 'Басты'}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.link ? (
                <BreadcrumbLink asChild>
                  <Link to={item.link}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
        
        {currentPage && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

