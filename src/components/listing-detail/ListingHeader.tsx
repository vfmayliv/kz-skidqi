
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Heart, Eye, MapPin } from 'lucide-react';

interface ListingHeaderProps {
  title: string;
  city: string;
  createdAt: string;
  views: number;
  id: string;
  price: number;
  originalPrice: number;
  discount: number;
  isFeatured: boolean;
  isFavorite: boolean;
  language: string;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
  onToggleFavorite: () => void;
  onShare: () => void;
  isMobile?: boolean;
}

export const ListingHeader = ({
  title,
  city,
  createdAt,
  views,
  id,
  price,
  originalPrice,
  discount,
  isFeatured,
  isFavorite,
  language,
  formatPrice,
  formatDate,
  onToggleFavorite,
  onShare,
  isMobile = false
}: ListingHeaderProps) => {
  
  // Calculate if there's actually a discount
  const hasDiscount = originalPrice > price && price > 0;

  // Calculate discount percentage
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold mb-2">{title}</h1>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{city}</span>
          </div>
        </div>
        
        {isFeatured && (
          <Badge className="bg-primary text-primary-foreground">
            {language === 'ru' ? 'Премиум' : 'Премиум'}
          </Badge>
        )}
      </div>
      
      {/* Price section */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl lg:text-3xl font-bold text-red-500">
          {formatPrice(price)}
        </span>
        
        {hasDiscount && (
          <>
            <span className="text-lg text-gray-600 line-through">
              {formatPrice(originalPrice)}
            </span>
            <Badge className="bg-red-500 text-white font-bold">
              -{discountPercentage}%
            </Badge>
          </>
        )}
      </div>
      
      {/* Stats and actions */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views}</span>
          </div>
          <span>{formatDate(createdAt)}</span>
          <span className="text-xs">ID: {id}</span>
        </div>
        
        {!isMobile && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              {language === 'ru' ? 'Поделиться' : 'Бөлісу'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className="h-4 w-4 mr-1" fill={isFavorite ? "currentColor" : "none"} />
              {language === 'ru' ? 'В избранное' : 'Таңдаулыларға'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
