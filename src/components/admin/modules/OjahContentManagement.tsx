
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';

export const OjahContentManagement = () => {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          status,
          created_at,
          views,
          user_id,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching listings:', error);
      } else {
        setListings(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus })
        .eq('id', listingId);

      if (!error) {
        fetchListings();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Активное', variant: 'default' as const },
      pending: { label: 'На модерации', variant: 'secondary' as const },
      rejected: { label: 'Отклонено', variant: 'destructive' as const },
      draft: { label: 'Черновик', variant: 'outline' as const }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Управление контентом</h2>
        <p className="text-muted-foreground">
          Модерация объявлений, управление категориями и контентом
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Объявления</CardTitle>
          <CardDescription>Управление и модерация объявлений пользователей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск объявлений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="pending">На модерации</option>
              <option value="rejected">Отклоненные</option>
              <option value="draft">Черновики</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-4">Загрузка...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Просмотры</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">
                      {listing.title}
                    </TableCell>
                    <TableCell>
                      {listing.profiles?.full_name || 'Не указано'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(listing.status)}
                    </TableCell>
                    <TableCell>{listing.views || 0}</TableCell>
                    <TableCell>
                      {new Date(listing.created_at).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(listing.id, 
                            listing.status === 'active' ? 'pending' : 'active'
                          )}
                        >
                          {listing.status === 'active' ? 'Скрыть' : 'Одобрить'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
