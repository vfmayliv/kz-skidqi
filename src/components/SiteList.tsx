
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockSites = [
  { id: 1, name: 'Мой блог', url: 'https://myblog.com', status: 'Активен' },
  { id: 2, name: 'Магазин товаров', url: 'https://myshop.com', status: 'В разработке' },
  { id: 3, name: 'Портфолио', url: 'https://myportfolio.com', status: 'Приостановлен' }
];

export const SiteList: React.FC = () => {
  return (
    <div className="grid gap-4">
      {mockSites.map(site => (
        <Card key={site.id}>
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <p>URL: {site.url}</p>
              <p>Статус: {site.status}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Редактировать</Button>
              <Button variant="destructive">Удалить</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
