
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'verify', token }
      });

      if (error || !data?.success) {
        localStorage.removeItem('admin_token');
        setAdminUser(null);
      } else {
        setAdminUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('admin_token');
      setAdminUser(null);
    }
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', username, password }
      });

      if (error) {
        return { success: false, error: 'Ошибка соединения с сервером' };
      }

      if (data?.success) {
        localStorage.setItem('admin_token', data.token);
        setAdminUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data?.error || 'Неверные учетные данные' };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Ошибка входа в систему' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        await supabase.functions.invoke('admin-auth', {
          body: { action: 'logout', token }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('admin_token');
    setAdminUser(null);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const value = {
    adminUser,
    isAuthenticated: !!adminUser,
    isLoading,
    login,
    logout,
    checkSession,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
