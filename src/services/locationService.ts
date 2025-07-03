
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

// Mock data - in a real app, this would come from your API
const mockRegions: Region[] = [
  { id: '1', name_ru: 'Алматинская область', name_kz: 'Алматы облысы' },
  { id: '2', name_ru: 'Нур-Султан', name_kz: 'Нұр-Сұлтан' },
  { id: '3', name_ru: 'Алматы', name_kz: 'Алматы' },
  { id: '4', name_ru: 'Шымкент', name_kz: 'Шымкент' },
];

const mockCities: City[] = [
  { id: '1', name_ru: 'Алматы', name_kz: 'Алматы', region_id: '1' },
  { id: '2', name_ru: 'Нур-Султан', name_kz: 'Нұр-Сұлтан', region_id: '2' },
  { id: '3', name_ru: 'Шымкент', name_kz: 'Шымкент', region_id: '4' },
];

const mockMicrodistricts: Microdistrict[] = [
  { id: '1', name_ru: 'Алмалинский', name_kz: 'Алмалы', city_id: '1' },
  { id: '2', name_ru: 'Медеуский', name_kz: 'Медеу', city_id: '1' },
  { id: '3', name_ru: 'Есильский', name_kz: 'Есіл', city_id: '2' },
];

const specialCityRegions = ['2', '3', '4']; // Nur-Sultan, Almaty, Shymkent are city-regions

export async function getRegions(): Promise<Region[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockRegions;
}

export async function getCitiesByRegion(regionId: string): Promise<City[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockCities.filter(city => city.region_id === regionId);
}

export async function getMicrodistrictsByCity(cityId: string): Promise<Microdistrict[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockMicrodistricts.filter(md => md.city_id === cityId);
}

export async function getSpecialCityRegions(): Promise<string[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  return specialCityRegions;
}
