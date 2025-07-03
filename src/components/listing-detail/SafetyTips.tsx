
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppWithTranslations } from '@/stores/useAppStore';

interface SafetyTipsProps {
  language: string;
}

export const SafetyTips = ({ language }: SafetyTipsProps) => {
  const { t } = useAppWithTranslations();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-medium">
            {t('safety', 'Безопасность')}
          </h3>
        </div>
        
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {t('noPrePayment', 'Не совершайте предоплату')}
            </span>
          </li>
          <li className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {t('checkItem', 'Проверяйте товар при получении')}
            </span>
          </li>
          <li className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {t('safeMeetings', 'Встречайтесь в безопасных местах')}
            </span>
          </li>
        </ul>
        
        <Button variant="link" className="text-xs p-0 h-auto mt-2">
          {t('safetyInfo', 'Подробнее о безопасности')}
        </Button>
      </CardContent>
    </Card>
  );
};
