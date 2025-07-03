
-- Добавляем недостающие поля для недвижимости в таблицу listings
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS latitude float8,
ADD COLUMN IF NOT EXISTS longitude float8,
ADD COLUMN IF NOT EXISTS area numeric,
ADD COLUMN IF NOT EXISTS rooms integer,
ADD COLUMN IF NOT EXISTS floor integer,
ADD COLUMN IF NOT EXISTS total_floors integer,
ADD COLUMN IF NOT EXISTS deal_type text CHECK (deal_type IN ('sale', 'rent')),
ADD COLUMN IF NOT EXISTS property_type text CHECK (property_type IN ('apartment', 'house', 'commercial', 'land')),
ADD COLUMN IF NOT EXISTS building_type text,
ADD COLUMN IF NOT EXISTS renovation_type text,
ADD COLUMN IF NOT EXISTS bathroom_type text,
ADD COLUMN IF NOT EXISTS year_built integer,
ADD COLUMN IF NOT EXISTS ceiling_height numeric,
ADD COLUMN IF NOT EXISTS has_balcony boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_elevator boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_parking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_pets boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS furnished boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS utilities_included boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS security_guarded boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_playground boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_separate_entrance boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_corner boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_studio boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS region_id integer REFERENCES regions(id),
ADD COLUMN IF NOT EXISTS district_id text;

-- Создаем индексы для улучшения производительности запросов
CREATE INDEX IF NOT EXISTS idx_listings_property_type ON public.listings(property_type);
CREATE INDEX IF NOT EXISTS idx_listings_deal_type ON public.listings(deal_type);
CREATE INDEX IF NOT EXISTS idx_listings_city_id ON public.listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_price_range ON public.listings(discount_price);
CREATE INDEX IF NOT EXISTS idx_listings_area ON public.listings(area);
CREATE INDEX IF NOT EXISTS idx_listings_rooms ON public.listings(rooms);
CREATE INDEX IF NOT EXISTS idx_listings_coordinates ON public.listings(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_listings_status_active ON public.listings(status) WHERE status = 'active';

-- Добавляем функцию для поиска объявлений недвижимости с фильтрами
CREATE OR REPLACE FUNCTION search_property_listings(
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_property_types text[] DEFAULT NULL,
  p_deal_type text DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_min_area numeric DEFAULT NULL,
  p_max_area numeric DEFAULT NULL,
  p_min_rooms integer DEFAULT NULL,
  p_max_rooms integer DEFAULT NULL,
  p_min_floor integer DEFAULT NULL,
  p_max_floor integer DEFAULT NULL,
  p_city_id integer DEFAULT NULL,
  p_region_id integer DEFAULT NULL,
  p_microdistrict_id integer DEFAULT NULL,
  p_building_types text[] DEFAULT NULL,
  p_renovation_types text[] DEFAULT NULL,
  p_bathroom_types text[] DEFAULT NULL,
  p_has_photo boolean DEFAULT NULL,
  p_furnished boolean DEFAULT NULL,
  p_allow_pets boolean DEFAULT NULL,
  p_has_parking boolean DEFAULT NULL,
  p_has_balcony boolean DEFAULT NULL,
  p_has_elevator boolean DEFAULT NULL,
  p_sort_by text DEFAULT 'created_at',
  p_sort_order text DEFAULT 'desc'
)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  regular_price integer,
  discount_price integer,
  discount_percent integer,
  is_free boolean,
  category_id integer,
  user_id uuid,
  city_id integer,
  microdistrict_id integer,
  region_id integer,
  images text[],
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  expires_at timestamp with time zone,
  views integer,
  phone text,
  is_premium boolean,
  address text,
  latitude float8,
  longitude float8,
  area numeric,
  rooms integer,
  floor integer,
  total_floors integer,
  deal_type text,
  property_type text,
  building_type text,
  renovation_type text,
  bathroom_type text,
  year_built integer,
  ceiling_height numeric,
  has_balcony boolean,
  has_elevator boolean,
  has_parking boolean,
  allow_pets boolean,
  furnished boolean,
  utilities_included boolean,
  security_guarded boolean,
  has_playground boolean,
  has_separate_entrance boolean,
  is_corner boolean,
  is_studio boolean,
  district_id text,
  total_count bigint
)
LANGUAGE plpgsql
AS $function$
DECLARE
  query_text text;
  sort_column text;
BEGIN
  -- Базовый запрос
  query_text := 'SELECT *, COUNT(*) OVER() as total_count FROM public.listings WHERE status = ''active''';
  
  -- Фильтр по типам недвижимости
  IF p_property_types IS NOT NULL AND array_length(p_property_types, 1) > 0 THEN
    query_text := query_text || ' AND property_type = ANY($1)';
  END IF;
  
  -- Фильтр по типу сделки
  IF p_deal_type IS NOT NULL THEN
    query_text := query_text || ' AND deal_type = ' || quote_literal(p_deal_type);
  END IF;
  
  -- Фильтры по цене
  IF p_min_price IS NOT NULL THEN
    query_text := query_text || ' AND discount_price >= ' || p_min_price;
  END IF;
  
  IF p_max_price IS NOT NULL THEN
    query_text := query_text || ' AND discount_price <= ' || p_max_price;
  END IF;
  
  -- Фильтры по площади
  IF p_min_area IS NOT NULL THEN
    query_text := query_text || ' AND area >= ' || p_min_area;
  END IF;
  
  IF p_max_area IS NOT NULL THEN
    query_text := query_text || ' AND area <= ' || p_max_area;
  END IF;
  
  -- Фильтры по комнатам
  IF p_min_rooms IS NOT NULL THEN
    query_text := query_text || ' AND rooms >= ' || p_min_rooms;
  END IF;
  
  IF p_max_rooms IS NOT NULL THEN
    query_text := query_text || ' AND rooms <= ' || p_max_rooms;
  END IF;
  
  -- Фильтры по этажам
  IF p_min_floor IS NOT NULL THEN
    query_text := query_text || ' AND floor >= ' || p_min_floor;
  END IF;
  
  IF p_max_floor IS NOT NULL THEN
    query_text := query_text || ' AND floor <= ' || p_max_floor;
  END IF;
  
  -- Географические фильтры
  IF p_city_id IS NOT NULL THEN
    query_text := query_text || ' AND city_id = ' || p_city_id;
  END IF;
  
  IF p_region_id IS NOT NULL THEN
    query_text := query_text || ' AND region_id = ' || p_region_id;
  END IF;
  
  IF p_microdistrict_id IS NOT NULL THEN
    query_text := query_text || ' AND microdistrict_id = ' || p_microdistrict_id;
  END IF;
  
  -- Булевые фильтры
  IF p_has_photo IS NOT NULL THEN
    IF p_has_photo THEN
      query_text := query_text || ' AND (images IS NOT NULL AND array_length(images, 1) > 0)';
    END IF;
  END IF;
  
  IF p_furnished IS NOT NULL THEN
    query_text := query_text || ' AND furnished = ' || p_furnished;
  END IF;
  
  IF p_allow_pets IS NOT NULL THEN
    query_text := query_text || ' AND allow_pets = ' || p_allow_pets;
  END IF;
  
  IF p_has_parking IS NOT NULL THEN
    query_text := query_text || ' AND has_parking = ' || p_has_parking;
  END IF;
  
  IF p_has_balcony IS NOT NULL THEN
    query_text := query_text || ' AND has_balcony = ' || p_has_balcony;
  END IF;
  
  IF p_has_elevator IS NOT NULL THEN
    query_text := query_text || ' AND has_elevator = ' || p_has_elevator;
  END IF;
  
  -- Сортировка
  CASE p_sort_by
    WHEN 'price_asc' THEN sort_column := 'discount_price ASC';
    WHEN 'price_desc' THEN sort_column := 'discount_price DESC';
    WHEN 'area_asc' THEN sort_column := 'area ASC';
    WHEN 'area_desc' THEN sort_column := 'area DESC';
    WHEN 'created_at' THEN sort_column := 'created_at DESC';
    ELSE sort_column := 'created_at DESC';
  END CASE;
  
  query_text := query_text || ' ORDER BY ' || sort_column;
  query_text := query_text || ' LIMIT ' || p_limit || ' OFFSET ' || p_offset;
  
  -- Выполняем динамический запрос
  IF p_property_types IS NOT NULL AND array_length(p_property_types, 1) > 0 THEN
    RETURN QUERY EXECUTE query_text USING p_property_types;
  ELSE
    RETURN QUERY EXECUTE query_text;
  END IF;
END;
$function$;
