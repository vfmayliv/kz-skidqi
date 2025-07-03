
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { MessageSquare } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  content: string;
  date: string;
  read: boolean;
}

interface MessagesInboxProps {
  messages: Message[];
  formatDate: (date: string) => string;
}

export const MessagesInbox: React.FC<MessagesInboxProps> = ({ messages, formatDate }) => {
  const { language } = useAppContext();
  
  return (
    <div className="space-y-4">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map(message => (
            <Card key={message.id} className={message.read ? "" : "border-primary"}>
              <CardHeader className="py-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{message.sender}</CardTitle>
                  <span className="text-xs text-muted-foreground">{formatDate(message.date)}</span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm">{message.content}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-3 flex justify-end">
                <Button variant="outline" size="sm">
                  {language === 'ru' ? 'Ответить' : 'Жауап беру'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'ru' ? 'У вас пока нет сообщений' : 'Сізде әзірше хабарламалар жоқ'}
          </p>
        </div>
      )}
    </div>
  );
};
