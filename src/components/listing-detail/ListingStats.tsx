
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart4, 
  Calendar, 
  Eye, 
  Tag, 
  Flag, 
  Share2, 
  Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListingStatsProps {
  createdAt: string;
  id: string;
  views: number;
  isFavorite: boolean;
  language: string;
  formatDate: (date: string) => string;
  onToggleFavorite: () => void;
  onShare: () => void;
  isMobile?: boolean;
}

export const ListingStats = ({
  createdAt,
  id,
  views,
  isFavorite,
  language,
  formatDate,
  onToggleFavorite,
  onShare,
  isMobile = false
}: ListingStatsProps) => {
  
  // Mobile version
  if (isMobile) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {language === 'ru' ? 'Размещено' : 'Орналастырылған'}: {formatDate(createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {language === 'ru' ? 'Просмотров' : 'Қаралым'}: {views}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              ID: {id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <button className="text-sm text-muted-foreground hover:underline">
              {language === 'ru' ? 'Пожаловаться' : 'Шағымдану'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop version
  return (
    <>
      <Card className="hidden lg:block">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <BarChart4 className="h-5 w-5 text-primary" />
            <h3 className="font-medium">
              {language === 'ru' ? 'Статистика' : 'Статистика'}
            </h3>
          </div>
          
          <ul className="space-y-3">
            <li className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ru' ? 'Размещено' : 'Орналастырылған'}
              </span>
              <span>{formatDate(createdAt)}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ru' ? 'Номер объявления' : 'Хабарландыру нөмірі'}
              </span>
              <span>{id}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ru' ? 'Просмотры' : 'Қаралымдар'}
              </span>
              <span>{views}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ru' ? 'Телефон показан' : 'Телефон көрсетілген'}
              </span>
              <span>{Math.floor(views * 0.6)}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      
      <div className="hidden lg:block bg-white rounded-lg p-4 shadow-sm">
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={onToggleFavorite}>
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            <span>
              {language === 'ru' 
                ? (isFavorite ? 'В избранном' : 'Добавить в избранное') 
                : (isFavorite ? 'Таңдаулыларда' : 'Таңдаулыларға қосу')}
            </span>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={onShare}>
            <Share2 className="h-4 w-4" />
            <span>{language === 'ru' ? 'Поделиться' : 'Бөлісу'}</span>
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-600">
            <Flag className="h-4 w-4" />
            <span>{language === 'ru' ? 'Пожаловаться' : 'Шағымдану'}</span>
          </Button>
        </div>
      </div>
    </>
  );
};
