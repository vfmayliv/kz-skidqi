
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SellerInfoProps {
  name: string;
  phone: string;
  rating: number;
  deals: number;
  memberSince: string;
  response: string;
  lastOnline: string;
  isPhoneVisible: boolean;
  language: string;
  onShowPhone: () => void;
  isMobile?: boolean;
}

export const SellerInfo = ({
  name,
  phone,
  rating,
  deals,
  memberSince,
  response,
  lastOnline,
  isPhoneVisible,
  language,
  onShowPhone,
  isMobile = false
}: SellerInfoProps) => {
  
  // Mobile version
  if (isMobile) {
    return (
      <div className="lg:hidden bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="text-sm text-muted-foreground">
              {lastOnline}
            </div>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/logo.png" alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              S
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={onShowPhone}>
            <Phone className="h-4 w-4 mr-2" />
            <span>
              {isPhoneVisible 
                ? phone 
                : (language === 'ru' ? 'Показать телефон' : 'Телефон көрсету')}
            </span>
          </Button>
          
          <Button size="lg" variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>{language === 'ru' ? 'Написать сообщение' : 'Хабар жазу'}</span>
          </Button>
        </div>
      </div>
    );
  }
  
  // Desktop version
  return (
    <Card className="hidden lg:block">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="text-sm text-muted-foreground">
              {lastOnline}
            </div>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/logo.png" alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              S
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex justify-between text-sm mb-4">
          <div>
            <div className="font-medium">
              {deals}
            </div>
            <div className="text-muted-foreground">
              {language === 'ru' ? 'Объявлений' : 'Хабарландырулар'}
            </div>
          </div>
          <div>
            <div className="font-medium">
              {rating}
            </div>
            <div className="text-muted-foreground">
              {language === 'ru' ? 'Рейтинг' : 'Рейтинг'}
            </div>
          </div>
          <div>
            <div className="font-medium">
              {memberSince}
            </div>
            <div className="text-muted-foreground">
              {language === 'ru' ? 'С нами с' : 'Бізбен'}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {response}
        </p>
        
        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={onShowPhone}>
            <Phone className="h-4 w-4 mr-2" />
            <span>
              {isPhoneVisible 
                ? phone 
                : (language === 'ru' ? 'Показать телефон' : 'Телефон көрсету')}
            </span>
          </Button>
          
          <Button size="lg" variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>{language === 'ru' ? 'Написать сообщение' : 'Хабар жазу'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
