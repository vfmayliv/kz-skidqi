
import { supabase } from '@/integrations/supabase/client';

export interface CreateListingData {
  title: string;
  description: string;
  regular_price: number;
  discount_price: number;
  category_id: string | null; // Changed from number to string to match UUID
  user_id: string;
  city_id?: number;
  region_id?: number;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  status: string;
}

export const uploadImagestoSupabase = async (imageFiles: File[]): Promise<string[]> => {
  const uploadPromises = imageFiles.map(async (file, index) => {
    const fileName = `${Date.now()}-${index}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('listings')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from('listings')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  });

  return Promise.all(uploadPromises);
};

export const saveListingToSupabase = async (listingData: CreateListingData): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([listingData])
      .select('id')
      .single();

    if (error) {
      console.error('Error saving listing:', error);
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in saveListingToSupabase:', error);
    return null;
  }
};
