-- Включаем RLS для таблицы rent_types
ALTER TABLE public.rent_types ENABLE ROW LEVEL SECURITY;

-- Создаем политику, которая разрешает всем пользователям ЧИТАТЬ данные из таблицы rent_types
CREATE POLICY "Enable read access for all users" 
ON public.rent_types
FOR SELECT
USING (true);

-- Включаем RLS для таблицы uuid_to_id_mapping
ALTER TABLE public.uuid_to_id_mapping ENABLE ROW LEVEL SECURITY;

-- Создаем политику, которая разрешает всем пользователям ЧИТАТЬ данные из таблицы uuid_to_id_mapping
CREATE POLICY "Enable read access for all users" 
ON public.uuid_to_id_mapping
FOR SELECT
USING (true);