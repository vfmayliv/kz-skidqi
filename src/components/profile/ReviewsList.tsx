
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { User } from 'lucide-react';

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsListProps {
  reviews: Review[];
  formatDate: (date: string) => string;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, formatDate }) => {
  const { language } = useAppContext();
  
  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <Card key={review.id}>
              <CardHeader className="py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">{review.author}</CardTitle>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'ru' ? 'У вас пока нет отзывов' : 'Сізде әзірше пікірлер жоқ'}
          </p>
        </div>
      )}
    </div>
  );
};
