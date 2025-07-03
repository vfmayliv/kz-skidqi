import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/contexts/SupabaseContext';

export function useFavorites() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  // Получение всех избранных объявлений пользователя
  const getFavorites = async () => {
    if (!user) {
      setError('Пользователь не авторизован');
      return [];
    }

    setLoading(true);
    try {
      // Сначала получаем все ID избранных объявлений
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (favoritesError) {
        throw favoritesError;
      }

      if (!favorites || favorites.length === 0) {
        return [];
      }

      // Затем получаем сами объявления по их ID
      const listingIds = favorites.map(fav => fav.listing_id);
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds)
        .eq('status', 'active');

      if (listingsError) {
        throw listingsError;
      }

      return listings || [];
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке избранных объявлений:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Проверка, добавлено ли объявление в избранное
  const isFavorite = async (listingId: string) => {
    if (!user) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();

      if (error && error.code !== 'PGRST116') { // код ошибки для "нет результатов"
        throw error;
      }

      return !!data;
    } catch (err: any) {
      console.error(`Ошибка при проверке избранного ${listingId}:`, err);
      return false;
    }
  };

  // Добавление объявления в избранное
  const addToFavorites = async (listingId: string) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return false;
    }

    try {
      // Проверяем, не добавлено ли уже объявление в избранное
      const isAlreadyFavorite = await isFavorite(listingId);
      if (isAlreadyFavorite) {
        return true; // Уже в избранном, нет необходимости добавлять
      }

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          listing_id: listingId
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(`Ошибка при добавлении в избранное ${listingId}:`, err);
      return false;
    }
  };

  // Удаление объявления из избранного
  const removeFromFavorites = async (listingId: string) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(`Ошибка при удалении из избранного ${listingId}:`, err);
      return false;
    }
  };

  // Переключение статуса избранного (добавление/удаление)
  const toggleFavorite = async (listingId: string) => {
    const isFav = await isFavorite(listingId);
    
    if (isFav) {
      return await removeFromFavorites(listingId);
    } else {
      return await addToFavorites(listingId);
    }
  };

  return {
    loading,
    error,
    getFavorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
  };
}
