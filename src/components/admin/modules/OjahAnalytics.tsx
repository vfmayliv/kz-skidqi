
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

export const OjahAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Аналитика и статистика</h2>
        <p className="text-muted-foreground">
          Детальная аналитика посещаемости и активности пользователей
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Посетители за сегодня
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% с вчера
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Просмотры страниц
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">
              +15.2% с вчера
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Время на сайте
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3:24</div>
            <p className="text-xs text-muted-foreground">
              +5.1% с вчера
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Отказы
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.3%</div>
            <p className="text-xs text-muted-foreground">
              -2.1% с вчера
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Популярные страницы</CardTitle>
            <CardDescription>Наиболее посещаемые страницы сайта</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: '/transport', views: '1,234', percentage: '23.4%' },
                { page: '/property', views: '987', percentage: '18.7%' },
                { page: '/', views: '865', percentage: '16.4%' },
                { page: '/electronics', views: '654', percentage: '12.4%' },
                { page: '/fashion', views: '432', percentage: '8.2%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.page}</div>
                    <div className="text-sm text-muted-foreground">{item.views} просмотров</div>
                  </div>
                  <div className="text-sm font-medium">{item.percentage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Источники трафика</CardTitle>
            <CardDescription>Откуда приходят пользователи</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: 'Прямые переходы', visitors: '2,345', percentage: '45.2%' },
                { source: 'Google', visitors: '1,234', percentage: '23.8%' },
                { source: 'Социальные сети', visitors: '876', percentage: '16.9%' },
                { source: 'Referrals', visitors: '543', percentage: '10.5%' },
                { source: 'Email', visitors: '187', percentage: '3.6%' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.source}</div>
                    <div className="text-sm text-muted-foreground">{item.visitors} посетителей</div>
                  </div>
                  <div className="text-sm font-medium">{item.percentage}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
