
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Activity, Download, RefreshCw } from 'lucide-react';

export const OjahSystemSecurity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'get_activity_logs',
          token: localStorage.getItem('admin_token'),
          page: 1,
          limit: 20
        }
      });

      if (data?.success) {
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('login')) {
      return <Badge variant="default">Вход</Badge>;
    } else if (action.includes('logout')) {
      return <Badge variant="secondary">Выход</Badge>;
    } else if (action.includes('failed')) {
      return <Badge variant="destructive">Ошибка</Badge>;
    } else {
      return <Badge variant="outline">Действие</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Система и безопасность</h2>
        <p className="text-muted-foreground">
          Мониторинг системы, логи безопасности и настройки
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Системный статус
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Активен</div>
            <p className="text-xs text-muted-foreground">
              Система работает нормально
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные сессии
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              Пользователей онлайн
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Использование памяти
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              2.1 GB из 3 GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Размер БД
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245 MB</div>
            <p className="text-xs text-muted-foreground">
              +12 MB за неделю
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Логи активности</CardTitle>
              <CardDescription>История действий администраторов и системных событий</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchActivityLogs} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Загрузка логов...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Время</TableHead>
                  <TableHead>Администратор</TableHead>
                  <TableHead>Действие</TableHead>
                  <TableHead>IP адрес</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {new Date(log.created_at).toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      {log.admin_users?.username || 'Система'}
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell>
                      {getActionBadge(log.action)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Резервное копирование</CardTitle>
            <CardDescription>Управление бэкапами системы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Последний бэкап:</span>
              <span className="text-sm text-muted-foreground">2 часа назад</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Размер бэкапа:</span>
              <span className="text-sm text-muted-foreground">312 MB</span>
            </div>
            <Button className="w-full">Создать бэкап</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройки безопасности</CardTitle>
            <CardDescription>Параметры безопасности системы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Двухфакторная аутентификация:</span>
              <Badge variant="default">Включена</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>SSL сертификат:</span>
              <Badge variant="default">Активен</Badge>
            </div>
            <Button className="w-full" variant="outline">
              Настроить безопасность
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
