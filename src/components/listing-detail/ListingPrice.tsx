
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2, Heart } from 'lucide-react';

interface ListingPriceProps {
  price: number;
  originalPrice: number;
  discount: number;
  formatPrice: (price: number) => string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
}

export const ListingPrice = ({ 
  price, 
  originalPrice, 
  discount, 
  formatPrice, 
  isFavorite, 
  onToggleFavorite, 
  onShare 
}: ListingPriceProps) => {
  return (
    <div className="lg:hidden bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-2">
        <span className="text-2xl font-bold text-primary">
          {formatPrice(price)}
        </span>
        
        {discount > 0 && (
          <span className="text-sm line-through text-muted-foreground ml-2">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>
      
      {discount > 0 && (
        <Badge variant="outline" className="bg-red-50 text-red-500 border-red-200">
          -{discount}%
        </Badge>
      )}
      
      <div className="flex gap-2 mt-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onShare}
          className="h-9 w-9"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onToggleFavorite}
          className={`h-9 w-9 ${isFavorite ? 'text-red-500' : ''}`}
        >
          <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
      </div>
    </div>
  );
};
