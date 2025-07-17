
import { supabase } from '@/integrations/supabase/client';

export interface CreateListingData {
  title: string;
  description: string;
  regular_price: number;
  discount_price: number;
  category_id: string | null; // UUID string from listing_categories
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
    // Since we're now using listing_categories table with UUID, we can store the category_id directly
    const dbListingData = {
      title: listingData.title,
      description: listingData.description,
      regular_price: listingData.regular_price,
      discount_price: listingData.discount_price,
      category_id: null, // Still set to null for now until we update the listings table to reference listing_categories
      user_id: listingData.user_id,
      city_id: listingData.city_id,
      region_id: listingData.region_id,
      address: listingData.address,
      latitude: listingData.latitude,
      longitude: listingData.longitude,
      images: listingData.images,
      status: listingData.status,
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([dbListingData])
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
