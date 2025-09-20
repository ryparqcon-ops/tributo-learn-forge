-- Script para solucionar problemas de migración
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

-- 4. Verificar restricciones NOT NULL en profiles
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- 5. Verificar restricciones NOT NULL en instructors
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'instructors'
  AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- 6. Verificar restricciones NOT NULL en courses
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'courses'
  AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- 7. Verificar restricciones NOT NULL en lessons
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'lessons'
  AND is_nullable = 'NO'
ORDER BY ordinal_position;

-- 8. Verificar restricciones NOT NULL en categories
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'categories'
  AND is_nullable = 'NO'
ORDER BY ordinal_position;
