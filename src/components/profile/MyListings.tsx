
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Listing } from '@/types/listingType';
import { useAppContext } from '@/contexts/AppContext';
import { User } from 'lucide-react';

interface MyListingsProps {
  listings: Listing[];
}

export const MyListings: React.FC<MyListingsProps> = ({ listings }) => {
  const { language } = useAppContext();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₸';
  };

  return (
    <div className="space-y-4">
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((listing, index) => (
            <Card key={index}>
              <div className="flex">
                <div className="w-24 h-24">
                  <img 
                    src={listing.imageUrl || '/placeholder.svg'} 
                    alt={typeof listing.title === 'string' ? listing.title : listing.title[language]} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="flex-1 p-3">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {typeof listing.title === 'string' ? listing.title : listing.title[language]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(listing.discountPrice)}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {language === 'ru' ? 'Просмотров:' : 'Қаралымдар:'} {listing.views}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/listing/${listing.id}`}>
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
          <p className="text-muted-foreground">
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
