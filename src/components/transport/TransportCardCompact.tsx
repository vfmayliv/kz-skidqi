
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';

export interface CompactTransportListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  year: number;
  mileage?: number;
  brand: string;
  model: string;
  bodyType?: string;
  engineType?: string;
  transmission?: string;
  driveType?: string;
  condition: 'new' | 'used';
  images: string[];
  createdAt: string;
  seller: {
    name: string;
    type: 'dealer' | 'private';
  };
}

export interface TransportCardCompactProps {
  listing: CompactTransportListing;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

const TransportCardCompact: React.FC<TransportCardCompactProps> = ({
  listing,
  onFavoriteToggle,
  isFavorite = false
}) => {
  const { t } = useTranslation();
  
  const {
    id,
    title,
    price,
    currency,
    location,
    year,
    mileage,
    brand,
    model,
    images,
    bodyType,
    engineType,
    transmission,
    condition,
    seller
  } = listing;

  // Форматируем цену для отображения
  const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);
  
  // Форматируем пробег для отображения
  const formattedMileage = mileage ? new Intl.NumberFormat('ru-RU').format(mileage) : null;

  // Обработчики событий
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <Link to={`/transport/listing/${id}`}>
      <Card className="transport-card overflow-hidden hover:shadow-md transition-shadow duration-300 h-full">
        {/* Изображение транспортного средства */}
        <div className="relative h-48">
          <img 
            src={images[0] || '/placeholder.svg'} 
            alt={`${brand} ${model}`} 
            className="w-full h-full object-cover"
          />
          
          {/* Индикатор числа фотографий */}
          {images.length > 1 && (
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {images.length} фото
            </span>
          )}
          
          {/* Кнопка добавления в избранное */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full ${isFavorite ? 'text-red-500' : 'text-white'} bg-black bg-opacity-40 hover:bg-opacity-60`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Если объявление от дилера */}
          {seller.type === 'dealer' && (
            <Badge className="absolute top-2 left-2 bg-green-600 text-xs">
              Дилер
            </Badge>
          )}
          
          {condition === 'new' && (
            <Badge className="absolute top-8 left-2 bg-blue-600 text-xs">
              Новый
            </Badge>
          )}
        </div>
        
        {/* Информация о транспортном средстве */}
        <CardContent className="p-3">
          <div className="mb-2">
            <h3 className="text-sm font-semibold line-clamp-2 mb-1">
              {title || `${brand} ${model}`}
            </h3>
            <p className="text-lg font-bold text-gray-900">
              {formattedPrice} {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₸'}
            </p>
          </div>
          
          {/* Основные характеристики */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-xs text-gray-600">
            <div className="flex items-center">
              <span className="mr-1">📅</span> {year}
            </div>
            
            {mileage !== undefined && (
              <div className="flex items-center">
                <span className="mr-1">🛣️</span>
                {formattedMileage} км
              </div>
            )}
            
            {bodyType && (
              <div className="flex items-center">
                <span className="mr-1">🚘</span>
                {bodyType}
              </div>
            )}
            
            {engineType && (
              <div className="flex items-center">
                <span className="mr-1">⚙️</span>
                {engineType}
              </div>
            )}
          </div>
          
          {/* Местоположение */}
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            {location}
          </div>
          
          {/* Время публикации */}
          <div className="text-xs text-gray-400">
            {new Date(listing.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TransportCardCompact;
