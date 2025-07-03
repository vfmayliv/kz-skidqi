export interface Category {
  id: number;
  name_ru: string;
  name_kz: string;
  icon?: string;
  slug: string;
  parent_id?: number;
  level?: number;
  is_active?: boolean;
  sort_order?: number;
}