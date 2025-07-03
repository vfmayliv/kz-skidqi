
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Eye, Activity } from 'lucide-react';

export const OjahDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'get_stats',
          token: localStorage.getItem('admin_token')
        }
      });

      if (data?.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Общее количество пользователей',
      value: stats.totalUsers,
      icon: Users,
      description: 'Зарегистрированные пользователи'
    },
    {
      title: 'Общее количество объявлений',
      value: stats.totalListings,
      icon: FileText,
      description: 'Все объявления в системе'
    },
    {
      title: 'Активные объявления',
      value: stats.activeListings,
      icon: Activity,
      description: 'Опубликованные объявления'
    },
    {
      title: 'Общее количество просмотров',
      value: stats.totalViews,
      icon: Eye,
      description: 'Просмотры объявлений'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Обзор основных метрик и активности системы
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Активность системы</CardTitle>
            <CardDescription>
              Последние действия в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Новые регистрации за сегодня</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Новые объявления за сегодня</span>
                <span className="font-medium">34</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Просмотры за последний час</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Часто используемые функции
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
              Модерация объявлений
            </button>
            <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
              Управление пользователями
            </button>
            <button className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded">
              Просмотр логов
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
