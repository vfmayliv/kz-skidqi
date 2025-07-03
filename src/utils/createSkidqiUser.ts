
import { supabase } from '@/lib/supabase';

export const createSkidqiUser = async () => {
  try {
    // Проверяем, существует ли уже пользователь Skidqi
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'info@skidqi.ru')
      .single();

    if (existingProfile) {
      console.log('Пользователь Skidqi уже существует');
      return existingProfile.id;
    }

    // Создаем пользователя через Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'info@skidqi.ru',
      password: 'MalbelFerimli10/',
      options: {
        data: {
          full_name: 'Skidqi Admin',
        }
      }
    });

    if (authError) {
      console.error('Ошибка создания пользователя:', authError);
      return null;
    }

    if (!authData.user) {
      console.error('Пользователь не был создан');
      return null;
    }

    // Добавляем роль admin для этого пользователя
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error('Ошибка добавления роли:', roleError);
    }

    console.log('Пользователь Skidqi создан успешно:', authData.user.id);
    return authData.user.id;

  } catch (error) {
    console.error('Ошибка при создании пользователя Skidqi:', error);
    return null;
  }
};

export const getSkidqiUserId = async (): Promise<string | null> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'info@skidqi.ru')
      .single();

    return profile?.id || null;
  } catch (error) {
    console.error('Ошибка получения ID пользователя Skidqi:', error);
    return null;
  }
};
