export enum PropertyType {
  // Residential
  APARTMENT = 'apartment',
  NEW_BUILDING = 'new_building',
  SECONDARY = 'secondary',
  ROOM = 'room',
  HOUSE = 'house',
  TOWNHOUSE = 'townhouse',
  LAND = 'land',
  GARAGE = 'garage',
  BED_SPACE = 'bed_space',
  DACHA = 'dacha',

  // Commercial
  OFFICE = 'office',
  RETAIL = 'retail',
  WAREHOUSE = 'warehouse',
  FREE_PURPOSE = 'free_purpose',
  PUBLIC_CATERING = 'public_catering',
  PRODUCTION = 'production',
  AUTO_SERVICE = 'auto_service',
  BUILDING = 'building',
  READY_BUSINESS = 'ready_business',
  COMMERCIAL_LAND = 'commercial_land',
  COWORKING = 'coworking',
  COMMERCIAL = 'commercial',
}

export enum BuildingType {
  PANEL = 'panel',
  BRICK = 'brick',
  MONOLITHIC = 'monolithic',
  WOOD = 'wood',
  BLOCK = 'block',
  WOODEN = 'wooden',
}

export enum ConditionType {
  GOOD = 'good',
  AVERAGE = 'average',
  NEEDS_REPAIR = 'needs_repair',
}

export enum RenovationType {
  COSMETIC = 'cosmetic',
  EURO = 'euro',
  DESIGNER = 'designer',
  WITHOUT_RENOVATION = 'without_renovation',
}

export enum BathroomType {
  COMBINED = 'combined',
  SEPARATE = 'separate',
  TWO_OR_MORE = 'two_or_more',
}

export enum EngineType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  GAS = 'gas'
}

export enum BodyType {
  SEDAN = 'sedan',
  HATCHBACK = 'hatchback',
  SUV = 'suv',
  WAGON = 'wagon',
  COUPE = 'coupe',
  CONVERTIBLE = 'convertible',
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
}

export enum DriveType {
  FWD = 'fwd',
  RWD = 'rwd',
  AWD = 'awd',
}

export enum VehicleType {
  CAR = 'car',
  TRUCK = 'truck',
  MOTORCYCLE = 'motorcycle',
}

export enum SteeringWheelType {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum VehicleFeature {
  ABS = 'abs',
  ESP = 'esp',
  AIRBAGS = 'airbags',
  LEATHER_SEATS = 'leather_seats',
  SUNROOF = 'sunroof',
  NAVIGATION = 'navigation',
}

export enum SortOptions {
  DATE_DESC = 'date_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  AREA_ASC = 'area_asc',
  AREA_DESC = 'area_desc',
}

export interface Region {
  id: string;
  name_ru: string;
  name_kz: string;
}

export interface City {
  id: string;
  name_ru: string;
  name_kz: string;
  region_id: string;
}

export interface Microdistrict {
  id: string;
  name_ru: string;
  name_kz: string;
  city_id: string;
}

export interface PropertyFilters {
  dealType?: 'buy' | 'rent' | 'rent_daily';
  segment?: 'residential' | 'commercial' | 'overseas';
  propertyTypes?: PropertyType[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  areaRange?: {
    min?: number;
    max?: number;
  };
  floorRange?: {
    min?: number;
    max?: number;
  };
  yearBuiltRange?: {
    min?: number;
    max?: number;
  };
  ceilingHeightRange?: {
    min?: number;
    max?: number;
  };
  rooms?: number[];
  buildingType?: BuildingType[];
  conditionType?: ConditionType[];
  sortBy?: SortOptions;
  query?: string;
  districts?: string[];
  microdistricts?: string[];
  hasBalcony?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  furnished?: boolean;
  allowPets?: boolean;
  bathroomTypes?: BathroomType[];
  renovationTypes?: RenovationType[];
  hasPhoto?: boolean;
  onlyNewBuilding?: boolean;
  rentPeriodMin?: number;
  isCorner?: boolean;
  isStudio?: boolean;
  hasSeparateEntrance?: boolean;
  securityGuarded?: boolean;
  hasPlayground?: boolean;
  utilityBillsIncluded?: boolean;
  viewTypes?: string[];
  nearbyInfrastructure?: string[];
  regionId?: string;
  cityId?: string;
  microdistrictId?: string;
}

export interface TransportFilters {
  vehicleType?: VehicleType | null;
  brandId?: string | null;
  modelId?: string | null;
  yearRange?: { min: number | null, max: number | null };
  priceRange?: { min: number | null, max: number | null };
  mileageRange?: { min: number | null, max: number | null };
  engineVolumeRange?: { min: number | null, max: number | null };
  engineType?: EngineType | null;
  transmission?: TransmissionType | null;
  driveType?: DriveType | null;
  bodyType?: BodyType | null;
  condition?: string | null;
  color?: string | null;
  fuelType?: string | null;
  hasPhoto?: boolean | null;
  dealerOnly?: boolean | null;
  customsCleared?: boolean | null;
  inStock?: boolean | null;
  exchangePossible?: boolean | null;
  withoutAccidents?: boolean | null;
  withServiceHistory?: boolean | null;
  steeringWheel?: SteeringWheelType | null;
  features?: VehicleFeature[] | null;
  cities?: string[] | null;
  sortBy?: string | null;
}

export interface PropertyFilterConfig {
  showPrice: boolean;
  showArea: boolean;
  showRooms: boolean;
  showFloor: boolean;
  showBuildingType: boolean;
  showCondition: boolean;
  showAdvanced: boolean;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  discount: number;
  originalPrice: number;
  imageUrl: string;
  city: string | { ru: string; kk: string };
  categoryId: string;
  subcategoryİd?: string;
  createdAt: string;
  views: number;
  isFeatured?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  
  // Property-specific fields
  propertyType?: PropertyType;
  area?: number;
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  buildingType?: BuildingType;
  conditionType?: ConditionType;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  furnished?: boolean;
  allowPets?: boolean;
  yearBuilt?: number;
  dealType?: string;
  
  // Transport-specific fields
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
  
  // Seller information
  seller?: {
    name: string;
    phone: string;
    rating: number;
    reviews?: number;
  };
}
