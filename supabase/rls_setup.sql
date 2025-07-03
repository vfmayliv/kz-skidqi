-- Включаем RLS для таблицы categories (если она еще не включена)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Удаляем старую политику (если существует)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;

-- Создаем новую политику, которая разрешает всем пользователям ЧИТАТЬ данные из таблицы categories
CREATE POLICY "Enable read access for all users"
ON public.categories
FOR SELECT
USING (true);

-- Проверяем настройки для других таблиц подкатегорий
ALTER TABLE public.pharmacy_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pharmacy_categories;
CREATE POLICY "Enable read access for all users"
ON public.pharmacy_categories
FOR SELECT
USING (true);

ALTER TABLE public.tech_electronics_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tech_electronics_categories;
CREATE POLICY "Enable read access for all users"
ON public.tech_electronics_categories
FOR SELECT
USING (true);

-- Проверяем, что есть доступ на чтение в других таблицах категорий
-- (Добавьте аналогичные политики для других таблиц категорий, если они существуют)