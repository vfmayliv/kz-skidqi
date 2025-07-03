import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

// Определяем тип для создания объявления в Supabase
interface CreateListingData {
  title: string;
  description: string;
  regular_price: number;
  discount_price?: number;
  category_id: number;
  user_id: string;
  city_id?: number;
  region_id?: number;
  microdistrict_id?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  status: string;
}

// Загрузка изображения в Supabase Storage
export async function uploadImageToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `listings/${fileName}`;
    
    console.log('📤 Загрузка изображения в Supabase Storage:', filePath);
    
    // Добавляем метаданные для RLS политик
    const { error: uploadError } = await supabase.storage
      .from('listings')
      .upload(filePath, file, {
        metadata: {
          uploader: (await supabase.auth.getUser()).data.user?.id
        }
      });
    
    if (uploadError) {
      console.error('❌ Ошибка загрузки изображения:', uploadError);
      return null;
    }
    
    // Получение публичного URL изображения
    const { data } = supabase.storage
      .from('listings')
      .getPublicUrl(filePath);
    
    console.log('✅ Изображение загружено:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('💥 Ошибка при загрузке изображения:', error);
    return null;
  }
}

// Загрузка нескольких изображений в Supabase Storage
export async function uploadImagestoSupabase(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImageToSupabase(file));
  const results = await Promise.all(uploadPromises);
  
  // Фильтруем null-результаты (неудачные загрузки)
  return results.filter(url => url !== null) as string[];
}

// Сохранение объявления в Supabase
export async function saveListingToSupabase(listing: CreateListingData): Promise<string | null> {
  try {
    // Проверяем аутентификацию
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ Пользователь не аутентифицирован');
      return null;
    }

    console.log('💾 Сохраняем объявление в Supabase:', listing);

    const { data, error } = await supabase
      .from('listings')
      .insert([{
        ...listing,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('❌ Ошибка сохранения объявления:', error);
      return null;
    }
    
    console.log('✅ Объявление сохранено с ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('💥 Непредвиденная ошибка при сохранении объявления:', error);
    return null;
  }
}

// Обновление объявления в Supabase
export async function updateListingInSupabase(id: string, listing: Partial<CreateListingData>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('listings')
      .update({
        ...listing,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('❌ Ошибка обновления объявления:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('💥 Непредвиденная ошибка при обновлении объявления:', error);
    return false;
  }
}

// Функция для сохранения объявлений в localStorage (для совместимости со старой логикой)
export function saveListingToLocalStorage(listing: any) {
  try {
    // Получаем текущие объявления пользователя
    const userListingsString = localStorage.getItem('userListings');
    const userListings: any[] = userListingsString ? JSON.parse(userListingsString) : [];
    
    // Проверяем, есть ли уже объявление с таким ID
    const existingIndex = userListings.findIndex(item => item.id === listing.id);
    
    if (existingIndex >= 0) {
      // Обновляем существующее объявление
      userListings[existingIndex] = {
        ...listing,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Добавляем новое объявление с уникальным ID
      userListings.push({
        ...listing,
        id: listing.id || uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('userListings', JSON.stringify(userListings));
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении объявления в localStorage:', error);
    return false;
  }
}
