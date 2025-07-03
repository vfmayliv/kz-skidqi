
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar, Gauge, Fuel } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TransportListing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  year?: number;
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

export interface TransportCardProps {
  listing: TransportListing;
  variant?: 'default' | 'horizontal';
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
  viewMode?: 'grid' | 'list';
}

const TransportCard: React.FC<TransportCardProps> = ({
  listing,
  variant = 'default',
  onFavoriteToggle,
  isFavorite = false,
  viewMode = 'grid'
}) => {
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

  const isHorizontal = variant === 'horizontal' || viewMode === 'list';

  return (
    <Link to={`/transport/listing/${id}`} className="block">
      <Card className={`group overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full bg-white ${
        isHorizontal ? 'flex' : ''
      }`}>
        {/* Изображение транспортного средства */}
        <div className={`relative ${isHorizontal ? 'w-80 flex-shrink-0' : 'h-48'}`}>
          <img 
            src={images[0] || '/placeholder.svg'} 
            alt={`${brand} ${model}`} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Индикатор числа фотографий */}
          {images.length > 1 && (
            <span className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              📷 {images.length}
            </span>
          )}
          
          {/* Кнопка добавления в избранное */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 rounded-full w-9 h-9 ${
              isFavorite 
                ? 'text-red-500 bg-white/90 hover:bg-white' 
                : 'text-gray-600 bg-white/80 hover:bg-white hover:text-red-500'
            } backdrop-blur-sm transition-all duration-200`}
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Бейджи */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {seller.type === 'dealer' && (
              <Badge className="bg-green-600 hover:bg-green-700 text-xs font-medium px-2 py-1">
                Дилер
              </Badge>
            )}
            
            {condition === 'new' && (
              <Badge className="bg-blue-600 hover:bg-blue-700 text-xs font-medium px-2 py-1">
                Новый
              </Badge>
            )}
          </div>
        </div>
        
        {/* Информация о транспортном средстве */}
        <CardContent className={`p-4 flex-1 ${isHorizontal ? 'flex flex-col justify-between' : ''}`}>
          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {title || `${brand} ${model}`}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {formattedPrice} {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₸'}
              </p>
            </div>
            
            {/* Основные характеристики */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
              {year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{year} год</span>
                </div>
              )}
              
              {mileage !== undefined && (
                <div className="flex items-center gap-1">
                  <Gauge className="h-4 w-4 text-gray-400" />
                  <span>{formattedMileage} км</span>
                </div>
              )}
              
              {bodyType && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">🚘</span>
                  <span>{bodyType}</span>
                </div>
              )}
              
              {engineType && (
                <div className="flex items-center gap-1">
                  <Fuel className="h-4 w-4 text-gray-400" />
                  <span>{engineType}</span>
                </div>
              )}
            </div>
            
            {transmission && (
              <div className="text-sm text-gray-600 mb-3">
                <span className="font-medium">КПП:</span> {transmission}
              </div>
            )}
          </div>
          
          {/* Нижняя часть карточки */}
          <div className="mt-auto">
            {/* Местоположение */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {location}
            </div>
            
            {/* Время публикации */}
            <div className="text-xs text-gray-400">
              {new Date(listing.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long'
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TransportCard;
