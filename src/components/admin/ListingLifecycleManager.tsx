
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

interface LifecycleSettings {
  defaultDuration: number; // дни
  autoExpire: boolean;
  sendNotifications: boolean;
  notifyBeforeExpiry: number; // дни до истечения
  allowRenewal: boolean;
  maxRenewals: number;
}

interface ListingLifecycleManagerProps {
  settings: LifecycleSettings;
  onSettingsChange: (settings: LifecycleSettings) => void;
  className?: string;
}

export const ListingLifecycleManager = ({ 
  settings, 
  onSettingsChange,
  className = ""
}: ListingLifecycleManagerProps) => {
  const [localSettings, setLocalSettings] = useState<LifecycleSettings>(settings);

  const updateSetting = <K extends keyof LifecycleSettings>(
    key: K, 
    value: LifecycleSettings[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const calculateExpiryDate = (startDate: Date, duration: number): Date => {
    const expiry = new Date(startDate);
    expiry.setDate(expiry.getDate() + duration);
    return expiry;
  };

  const getStatusBadge = (expiryDate: Date, currentDate: Date = new Date()) => {
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Истёкшее</Badge>;
    } else if (daysUntilExpiry <= localSettings.notifyBeforeExpiry) {
      return <Badge className="bg-amber-500">Скоро истекает</Badge>;
    } else {
      return <Badge className="bg-green-500">Активное</Badge>;
    }
  };

  const previewExpiry = calculateExpiryDate(new Date(), localSettings.defaultDuration);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Управление жизненным циклом объявлений
          </CardTitle>
          <CardDescription>
            Настройки автоматического управления сроками действия объявлений
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Основные настройки */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="defaultDuration">Срок действия по умолчанию (дни)</Label>
              <Input
                id="defaultDuration"
                type="number"
                value={localSettings.defaultDuration}
                onChange={(e) => updateSetting('defaultDuration', parseInt(e.target.value) || 30)}
                min="1"
                max="365"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Стандартный срок для новых объявлений
              </p>
            </div>
            
            <div>
              <Label htmlFor="notifyBeforeExpiry">Уведомлять за (дни)</Label>
              <Input
                id="notifyBeforeExpiry"
                type="number"
                value={localSettings.notifyBeforeExpiry}
                onChange={(e) => updateSetting('notifyBeforeExpiry', parseInt(e.target.value) || 3)}
                min="1"
                max="30"
              />
              <p className="text-xs text-muted-foreground mt-1">
                За сколько дней предупреждать об истечении
              </p>
            </div>
          </div>

          {/* Переключатели */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Автоматическое истечение</Label>
                <p className="text-xs text-muted-foreground">
                  Автоматически переводить объявления в статус "истёкшие"
                </p>
              </div>
              <Switch
                checked={localSettings.autoExpire}
                onCheckedChange={(checked) => updateSetting('autoExpire', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Отправлять уведомления</Label>
                <p className="text-xs text-muted-foreground">
                  Уведомлять пользователей о скором истечении
                </p>
              </div>
              <Switch
                checked={localSettings.sendNotifications}
                onCheckedChange={(checked) => updateSetting('sendNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Разрешить продление</Label>
                <p className="text-xs text-muted-foreground">
                  Позволить пользователям продлевать объявления
                </p>
              </div>
              <Switch
                checked={localSettings.allowRenewal}
                onCheckedChange={(checked) => updateSetting('allowRenewal', checked)}
              />
            </div>
          </div>

          {/* Настройки продления */}
          {localSettings.allowRenewal && (
            <div>
              <Label htmlFor="maxRenewals">Максимальное количество продлений</Label>
              <Input
                id="maxRenewals"
                type="number"
                value={localSettings.maxRenewals}
                onChange={(e) => updateSetting('maxRenewals', parseInt(e.target.value) || 3)}
                min="0"
                max="10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                0 = без ограничений
              </p>
            </div>
          )}

          {/* Предварительный просмотр */}
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Предварительный просмотр:</div>
                <div className="flex items-center justify-between">
                  <span>Объявление создано сегодня истечёт:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {previewExpiry.toLocaleDateString('ru-RU')}
                    </span>
                    {getStatusBadge(previewExpiry)}
                  </div>
                </div>
                {localSettings.sendNotifications && (
                  <div className="flex items-center justify-between">
                    <span>Уведомление будет отправлено:</span>
                    <span className="font-medium">
                      {calculateExpiryDate(
                        new Date(), 
                        localSettings.defaultDuration - localSettings.notifyBeforeExpiry
                      ).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Предупреждения */}
          {!localSettings.autoExpire && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Без автоматического истечения объявления будут оставаться активными бесконечно
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
