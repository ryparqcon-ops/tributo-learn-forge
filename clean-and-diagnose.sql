-- Script para limpiar datos existentes y diagnosticar problemas
-- Ejecutar en el SQL Editor de Supabase

-- 1. Limpiar todos los datos existentes
DELETE FROM public.reviews;
DELETE FROM public.enrollments;
DELETE FROM public.lessons;
DELETE FROM public.courses;
DELETE FROM public.instructors;
DELETE FROM public.profiles;
DELETE FROM public.categories;

-- 2. Verificar que las tablas están vacías
SELECT 
  'profiles' as tabla, 
  COUNT(*) as total
FROM public.profiles
UNION ALL
SELECT 
  'instructors' as tabla, 
  COUNT(*) as total
FROM public.instructors
UNION ALL
SELECT 
  'categories' as tabla, 
  COUNT(*) as total
FROM public.categories
UNION ALL
SELECT 
  'courses' as tabla, 
  COUNT(*) as total
FROM public.courses
UNION ALL
SELECT 
  'lessons' as tabla, 
  COUNT(*) as total
FROM public.lessons;

-- 3. Verificar estructura de la tabla profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Verificar restricciones de la tabla profiles
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'profiles'
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 5. Verificar si hay triggers en la tabla profiles
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles'
  AND event_object_schema = 'public';
