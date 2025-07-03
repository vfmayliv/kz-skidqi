
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Globe, Palette, Mail } from 'lucide-react';

export const OjahSiteSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Настройки сайта</h2>
        <p className="text-muted-foreground">
          Общие настройки сайта, SEO параметры и интеграции
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Основные настройки
            </CardTitle>
            <CardDescription>Название сайта, описание и контактная информация</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Название сайта</label>
              <Input placeholder="Название вашего сайта" />
            </div>
            <div>
              <label className="text-sm font-medium">Описание</label>
              <Textarea placeholder="Краткое описание сайта" />
            </div>
            <div>
              <label className="text-sm font-medium">Контактный email</label>
              <Input type="email" placeholder="admin@example.com" />
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              SEO настройки
            </CardTitle>
            <CardDescription>Мета-теги и настройки для поисковых систем</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meta Title</label>
              <Input placeholder="Заголовок для поисковых систем" />
            </div>
            <div>
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea placeholder="Описание для поисковых систем" />
            </div>
            <div>
              <label className="text-sm font-medium">Ключевые слова</label>
              <Input placeholder="ключевые, слова, через, запятую" />
            </div>
            <Button>Сохранить SEO настройки</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>Настройки темы и отображения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Основной цвет</label>
              <Input type="color" />
            </div>
            <div>
              <label className="text-sm font-medium">Логотип</label>
              <Input type="file" accept="image/*" />
            </div>
            <div>
              <label className="text-sm font-medium">Фавикон</label>
              <Input type="file" accept="image/*" />
            </div>
            <Button>Обновить внешний вид</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Настройки уведомлений
            </CardTitle>
            <CardDescription>Email уведомления и шаблоны писем</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">SMTP сервер</label>
              <Input placeholder="smtp.example.com" />
            </div>
            <div>
              <label className="text-sm font-medium">SMTP порт</label>
              <Input placeholder="587" />
            </div>
            <div>
              <label className="text-sm font-medium">Email отправителя</label>
              <Input type="email" placeholder="noreply@example.com" />
            </div>
            <Button>Сохранить настройки Email</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
