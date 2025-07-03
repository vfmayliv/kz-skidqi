
export interface DealType {
  id: string;
  name_ru: string;
  name_kz: string;
}

export interface Segment {
  id: string;
  name_ru: string;
  name_kz: string;
}

export interface PropertyType {
  id: string;
  name_ru: string;
  name_kz: string;
  segment_id: string;
}

export interface Filter {
  id: string;
  name_ru: string;
  name_kz: string;
  type: string;
  meta?: any;
}

export interface FilterOption {
  id: number;
  filter_id: string;
  value: string;
  name_ru: string;
  name_kz: string;
}
