
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';

interface CategoryPageHeaderProps {
  categoryName: string;
}

export function CategoryPageHeader({ categoryName }: CategoryPageHeaderProps) {
  return (
    <>
      <BreadcrumbNavigation currentPage={categoryName} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">{categoryName}</h1>
      </div>
    </>
  );
}
