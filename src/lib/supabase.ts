import { supabase as supabaseClient } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Реэкспортируем единый клиент Supabase для всего приложения
export const supabase = supabaseClient;

// Проверка связи с базой данных при запуске (опционально)
(async () => {
  try {
    // Попытка получить 1 запись из таблицы 'categories' - проверка связи
    const { error } = await supabase.from('categories').select('*').limit(1);
    if (error) {
      console.error('Ошибка подключения к Supabase:', error);
    } else {
      console.log('Успешное подключение к Supabase');
    }
  } catch (err) {
    console.error('Критическая ошибка при работе с Supabase:', err);
  }
})();

// Типы для всего приложения
// Эти типы лучше перенести в src/types или в src/integrations/supabase/types.ts в будущем

// Хелперы для работы с Supabase
export const SupabaseHelper = {
  // Получение, залогинен ли пользователь
  isLoggedIn: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  // Получение текущего пользователя
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Получение профиля пользователя
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Ошибка получения профиля:', error);
      return null;
    }

    return data;
  }
};