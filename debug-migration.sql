-- Debug completo de la migración
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar todas las tablas y sus registros
SELECT 
  'profiles' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN full_name IS NOT NULL THEN 1 END) as con_nombre
FROM public.profiles
UNION ALL
SELECT 
  'instructors' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as con_titulo
FROM public.instructors
UNION ALL
SELECT 
  'categories' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as con_nombre
FROM public.categories
UNION ALL
SELECT 
  'courses' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as con_titulo
FROM public.courses
UNION ALL
SELECT 
  'lessons' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as con_titulo
FROM public.lessons
UNION ALL
SELECT 
  'enrollments' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as con_usuario
FROM public.enrollments
UNION ALL
SELECT 
  'reviews' as tabla, 
  COUNT(*) as total,
  COUNT(CASE WHEN rating > 0 THEN 1 END) as con_rating
FROM public.reviews;

-- 2. Verificar si la vista courses_with_details existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'courses_with_details';

-- 3. Verificar si hay datos en las tablas principales
SELECT 'Datos en profiles:' as info;
SELECT id, full_name, email FROM public.profiles LIMIT 3;

SELECT 'Datos en instructors:' as info;
SELECT id, title, profile_id FROM public.instructors LIMIT 3;

SELECT 'Datos en categories:' as info;
SELECT id, name, slug FROM public.categories LIMIT 3;

SELECT 'Datos en courses:' as info;
SELECT id, title, instructor_id, is_published FROM public.courses LIMIT 3;

SELECT 'Datos en lessons:' as info;
SELECT id, title, course_id, is_published FROM public.lessons LIMIT 3;

-- 4. Verificar relaciones
SELECT 'Relaciones courses-instructors:' as info;
SELECT 
  c.title as curso,
  i.title as instructor,
  p.full_name as instructor_name
FROM public.courses c
LEFT JOIN public.instructors i ON i.id = c.instructor_id
LEFT JOIN public.profiles p ON p.id = i.profile_id
LIMIT 3;

-- 5. Verificar si hay problemas con la vista
SELECT 'Probando vista courses_with_details:' as info;
SELECT COUNT(*) as total FROM public.courses_with_details;
