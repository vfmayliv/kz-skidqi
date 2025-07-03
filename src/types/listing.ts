
export interface Listing {
  id: string;
  title: string | {
    ru: string;
    kz: string;
  };
  description: string | {
    ru: string;
    kz: string;
  };
  originalPrice: number;
  discountPrice: number;
  discount: number;
  imageUrl: string;
  city: string | {
    ru: string;
    kz: string;
  };
  categoryId: string;
  subcategoryId?: string;
  createdAt: string;
  isFeatured?: boolean;
  views: number;
  phone?: string; // Added phone property
  
  // Add seller property to match listingType.ts Listing interface
  seller?: {
    name: string;
    phone: string;
    rating: number;
    reviews?: number;
  };
  
  // Transport-specific properties
  vehicleType?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engineType?: string;
  transmission?: string;
  driveType?: string;
  bodyType?: string;
  condition?: string;
  
  // Administrative division properties
  regionId: string;
  cityId: string;
  microdistrictId: string;
  districtId?: string;
  
  // Property-specific fields
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
}
