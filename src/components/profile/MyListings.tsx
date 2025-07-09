
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Listing } from '@/types/listingType';
import { useAppContext } from '@/contexts/AppContext';
import { User, Eye, Heart } from 'lucide-react';
import { createListingUrl } from '@/utils/urlUtils';

interface ExtendedListing extends Omit<Listing, 'favoriteCount'> {
  favoriteCount?: number;
}

interface MyListingsProps {
  listings: ExtendedListing[];
}

export const MyListings: React.FC<MyListingsProps> = ({ listings }) => {
  const { language } = useAppContext();

  const formatPrice = (price: number) => {
    if (price === 0) return language === 'ru' ? 'Бесплатно' : 'Тегін';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₸';
  };

  const getListingUrl = (listing: ExtendedListing) => {
    const title = typeof listing.title === 'string' ? listing.title : listing.title[language];
    // Ensure categoryId is treated as string or number, with fallback
    const categoryId = listing.categoryId || '1';
    return createListingUrl(categoryId, title);
  };

  return (
    <div className="space-y-4">
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <div className="flex">
                <div className="w-24 h-24">
                  <img 
                    src={listing.imageUrl || '/placeholder.svg'} 
                    alt={typeof listing.title === 'string' ? listing.title : listing.title[language]} 
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
                <CardContent className="flex-1 p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">
                    {typeof listing.title === 'string' ? listing.title : listing.title[language]}
                  </h3>
                  <p className="text-sm font-semibold text-primary mb-2">
                    {formatPrice(listing.discountPrice || listing.price)}
                  </p>
                  
                  {/* Статистика объявления */}
                  <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{listing.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{listing.favoriteCount || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(listing.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'kk-KZ')}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={getListingUrl(listing)}>
                        {language === 'ru' ? 'Смотреть' : 'Қарау'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {language === 'ru' ? 'У вас пока нет объявлений' : 'Сізде әзірше хабарландырулар жоқ'}
          </p>
          <Button className="mt-4" asChild>
            <Link to="/create-listing">
              {language === 'ru' ? 'Создать объявление' : 'Хабарландыру жасау'}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
