
export interface Category {
  id: string;
  name_ru: string;
  name_kz: string;
  icon?: string;
  slug: string;
  parent_id?: string;
  level?: number;
  is_active?: boolean;
  sort_order?: number;
}
