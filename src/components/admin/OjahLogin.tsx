
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface OjahLoginProps {
  onLoginSuccess: (session: Session) => void;
}

export const OjahLogin = ({ onLoginSuccess }: OjahLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: 'Ошибка входа',
        description: 'Пожалуйста, введите Email и Пароль.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Авторизация через Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Ошибка авторизации:', error);
        let errorMessage = 'Неверный Email или Пароль.';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Неверный Email или Пароль.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Пожалуйста, подтвердите ваш Email перед входом.';
        }
        toast({
          title: 'Ошибка входа',
          description: errorMessage,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (data.session) {
        // Проверяем админскую роль через RPC функцию
        const { data: isAdmin, error: roleError } = await supabase.rpc('check_admin_role');
        
        if (roleError) {
          console.error('Ошибка проверки роли:', roleError);
          toast({
            title: 'Ошибка доступа',
            description: 'Не удалось проверить права доступа.',
            variant: 'destructive',
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        if (!isAdmin) {
          toast({
            title: 'Доступ запрещен',
            description: 'У вас нет прав администратора для доступа к этой панели.',
            variant: 'destructive',
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // Если все проверки пройдены, передаем сессию
        toast({
          title: 'Вход выполнен',
          description: 'Добро пожаловать в админ-панель!',
          variant: 'default',
        });
        onLoginSuccess(data.session);
      } else {
        toast({
          title: 'Ошибка входа',
          description: 'Произошла неизвестная ошибка. Попробуйте снова.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Критическая ошибка входа:', error);
      toast({
        title: 'Ошибка входа',
        description: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Ojah Admin Panel</CardTitle>
          <CardDescription>Введите ваш Email и Пароль для доступа к панели администратора.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
                autoComplete="email"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
