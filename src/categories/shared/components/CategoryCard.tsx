
import { ReactNode } from 'react';

interface CategoryCardProps {
  title: string; // Ensure this is a string, not an object
  description?: string; // Ensure this is a string, not an object
  image?: string;
  price?: number;
  discount?: number;
  location?: string;
  date?: string;
  children?: ReactNode;
}

export const CategoryCard = ({
  title,
  description,
  image,
  price,
  discount,
  location,
  date,
  children
}: CategoryCardProps) => {
  // Ensure title and description are strings
  const titleStr = typeof title === 'string' ? title : String(title);
  const descriptionStr = description ? (typeof description === 'string' ? description : String(description)) : '';
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {image && (
        <div className="aspect-[4/3] overflow-hidden">
          <img src={image} alt={titleStr} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-medium text-lg truncate">{titleStr}</h3>
        {descriptionStr && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{descriptionStr}</p>
        )}
        <div className="mt-2 flex justify-between items-end">
          {price !== undefined && (
            <div>
              <div className="font-bold">{price.toLocaleString()} ₸</div>
              {discount && discount > 0 && (
                <div className="text-xs text-red-500">
                  -{discount}%
                </div>
              )}
            </div>
          )}
          {location && (
            <div className="text-xs text-gray-500">{location}</div>
          )}
        </div>
        {date && (
          <div className="mt-2 text-xs text-gray-500">{date}</div>
        )}
        {children}
      </div>
    </div>
  );
};
