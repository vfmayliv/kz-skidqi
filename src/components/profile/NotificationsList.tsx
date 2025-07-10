
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
}

interface NotificationsListProps {
  notifications: Notification[];
  formatDate: (date: string) => string;
  onMarkAsRead: (id: string) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ 
  notifications, formatDate, onMarkAsRead 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <Card 
              key={notification.id}
              className={notification.read ? "" : "border-primary cursor-pointer"}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CardHeader className="py-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{notification.title}</CardTitle>
                  <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm">{notification.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {t('no.notifications')}
          </p>
        </div>
      )}
    </div>
  );
};
