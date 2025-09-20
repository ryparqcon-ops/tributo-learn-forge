-- Verificar lecciones en la base de datos
-- Ejecutar en el SQL Editor de Supabase

-- 1. Contar total de lecciones
SELECT 
  'Total lecciones' as tipo,
  COUNT(*) as cantidad
FROM public.lessons;

-- 2. Contar lecciones publicadas
SELECT 
  'Lecciones publicadas' as tipo,
  COUNT(*) as cantidad
FROM public.lessons 
WHERE is_published = true;

-- 3. Ver algunas lecciones de ejemplo
SELECT 
  id,
  title,
  course_id,
  is_published,
  order_index,
  created_at
FROM public.lessons 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Verificar lecciones por curso
SELECT 
  c.title as curso,
  COUNT(l.id) as total_lecciones,
  COUNT(CASE WHEN l.is_published = true THEN 1 END) as lecciones_publicadas
FROM public.courses c
LEFT JOIN public.lessons l ON l.course_id = c.id
GROUP BY c.id, c.title
ORDER BY total_lecciones DESC
LIMIT 10;
