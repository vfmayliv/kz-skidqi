
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Listing, PropertyType } from '@/types/listingType';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Maximize2, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru, kk } from 'date-fns/locale';

interface PropertyCardProps {
  listing: Listing;
  variant?: 'default' | 'horizontal' | 'compact';
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  listing,
  variant = 'default',
  onFavoriteToggle,
  isFavorite = false,
}) => {
  const { language, t } = useAppContext();
  
  // Ensure title is a string
  const title = typeof listing.title === 'string'
    ? listing.title
    : (listing.title && typeof listing.title === 'object' && listing.title[language])
      ? listing.title[language]
      : '';

  // Ensure city is a string
  const city = typeof listing.city === 'string'
    ? listing.city
    : (listing.city && typeof listing.city === 'object' && listing.city[language])
      ? listing.city[language]
      : '';
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ' + t('tenge');
  };
  
  const getPropertyTypeLabel = (propertyType?: PropertyType) => {
    if (!propertyType) return '';
    
    const labels = {
      [PropertyType.APARTMENT]: { ru: 'Квартира', kz: 'Пәтер' },
      [PropertyType.HOUSE]: { ru: 'Дом', kz: 'Үй' },
      [PropertyType.COMMERCIAL]: { ru: 'Коммерческая', kz: 'Коммерциялық' },
      [PropertyType.LAND]: { ru: 'Участок', kz: 'Жер телімі' },
    };
    
    return labels[propertyType][language];
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true,
        locale: language === 'ru' ? ru : kk
      });
    } catch (error) {
      return dateString;
    }
  };
  
  if (variant === 'horizontal') {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/3 aspect-[4/3]">
          <img 
            src={listing.imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          {listing.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-primary">
              {language === 'ru' ? 'Премиум' : 'Премиум'}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              if (onFavoriteToggle) onFavoriteToggle(listing.id);
            }}
            className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 rounded-full h-8 w-8 p-1"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold line-clamp-1">
                  {formatPrice(listing.discountPrice)}
                </h3>
                {listing.discount > 0 && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(listing.originalPrice)}
                  </p>
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                {getPropertyTypeLabel(listing.propertyType)}
              </div>
            </div>
            
            <h2 className="font-medium mb-1 line-clamp-1">
              {title}
            </h2>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
              {listing.rooms && (
                <span className="text-sm">
                  {listing.rooms} {language === 'ru' ? 'комн.' : 'бөлме'}
                </span>
              )}
              
              {listing.area && (
                <span className="text-sm">
                  {listing.area} м²
                </span>
              )}
              
              {listing.floor && listing.totalFloors && (
                <span className="text-sm">
                  {listing.floor}/{listing.totalFloors} {language === 'ru' ? 'эт.' : 'қаб.'}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{listing.address || city}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(listing.createdAt)}
            </span>
            
            <Link to={`/listing/${listing.id}`} className="text-primary text-sm font-medium hover:underline">
              {language === 'ru' ? 'Подробнее' : 'Толығырақ'}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <Link to={`/listing/${listing.id}`} className="group">
        <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
          <div className="relative aspect-[4/3]">
            <img 
              src={listing.imageUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            {listing.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-primary">
                {language === 'ru' ? 'Премиум' : 'Премиум'}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.preventDefault();
                if (onFavoriteToggle) onFavoriteToggle(listing.id);
              }}
              className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 rounded-full h-6 w-6 p-0.5"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          
          <div className="p-3 flex-1">
            <h3 className="font-medium mb-1 line-clamp-1">
              {formatPrice(listing.discountPrice)}
            </h3>
            
            <div className="flex gap-2 flex-wrap text-xs mb-1">
              {listing.rooms && (
                <span>{listing.rooms} {language === 'ru' ? 'к.' : 'б.'}</span>
              )}
              
              {listing.area && (
                <span>{listing.area} м²</span>
              )}
              
              {listing.floor && (
                <span>{listing.floor} {language === 'ru' ? 'эт.' : 'қаб.'}</span>
              )}
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{listing.address || city}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  // Default variant
  return (
    <Link to={`/listing/${listing.id}`} className="group">
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative aspect-[4/3]">
          <img 
            src={listing.imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {listing.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-primary">
              {language === 'ru' ? 'Премиум' : 'Премиум'}
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.preventDefault();
              if (onFavoriteToggle) onFavoriteToggle(listing.id);
            }}
            className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 rounded-full h-8 w-8 p-1"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <Maximize2 className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold line-clamp-1">
                {formatPrice(listing.discountPrice)}
              </h3>
              {listing.discount > 0 && (
                <Badge variant="outline" className="text-red-500 border-red-200">
                  -{listing.discount}%
                </Badge>
              )}
            </div>
            {listing.discount > 0 && (
              <p className="text-sm text-muted-foreground line-through mb-1">
                {formatPrice(listing.originalPrice)}
              </p>
            )}
          </div>
          
          <h2 className="font-medium mb-2 line-clamp-2">
            {title}
          </h2>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
            {listing.rooms && (
              <span className="text-sm">
                {listing.rooms} {language === 'ru' ? 'комн.' : 'бөлме'}
              </span>
            )}
            
            {listing.area && (
              <span className="text-sm">
                {listing.area} м²
              </span>
            )}
            
            {listing.floor && listing.totalFloors && (
              <span className="text-sm">
                {listing.floor}/{listing.totalFloors} {language === 'ru' ? 'эт.' : 'қаб.'}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mt-auto">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{listing.address || city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
