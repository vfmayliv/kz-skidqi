
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye } from 'lucide-react';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { createListingUrl } from '@/utils/urlUtils';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    originalPrice: number;
    discountPrice: number;
    discount: number;
    city: string;
    categoryId?: string;
    subcategoryId?: string;
    isFeatured?: boolean;
    createdAt: string;
    views: number;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  const { language, t } = useAppWithTranslations();
  
  const formatPrice = (price: number) => {
    if (price === 0) return language === 'ru' ? 'Бесплатно' : 'Тегін';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ' + t('tenge');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'kk-KZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Ensure we get a string for title
  const title = listing.title || '';

  // Ensure we get a string for city
  const city = listing.city || '';

  // Calculate if there's actually a discount
  const hasDiscount = listing.originalPrice > listing.discountPrice && listing.discountPrice > 0;

  // Calculate discount percentage
  const discountPercentage = hasDiscount 
    ? Math.round(((listing.originalPrice - listing.discountPrice) / listing.originalPrice) * 100)
    : 0;

  // Create SEO-friendly URL БЕЗ ID
  const listingUrl = listing.categoryId 
    ? createListingUrl(listing.categoryId, title)
    : `/listing/${listing.id}`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <Link to={listingUrl} className="flex flex-col h-full">
        <div className="relative w-full bg-gray-50 flex items-center justify-center" style={{ minHeight: '200px' }}>
          <img
            src={listing.imageUrl || '/placeholder.svg'}
            alt={title}
            className="max-w-full max-h-[200px] object-contain transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white font-bold">
              -{discountPercentage}%
            </Badge>
          )}
          
          {listing.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-primary">
              {language === 'ru' ? 'Премиум' : 'Премиум'}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium line-clamp-2 h-12 mb-2">{title}</h3>
          
          <div className="mt-auto space-y-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-red-500">
                  {formatPrice(listing.discountPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-600 line-through">
                    {formatPrice(listing.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
          <span>{formatDate(listing.createdAt)}</span>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{listing.views}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
