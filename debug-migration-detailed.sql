-- Debug detallado de la migración
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar si las tablas existen
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews') 
    THEN '✅ Existe' 
    ELSE '❌ No existe' 
  END as estado
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews')
ORDER BY table_name;

-- 2. Verificar estructura de la tabla profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Verificar estructura de la tabla instructors
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'instructors'
ORDER BY ordinal_position;

-- 4. Verificar estructura de la tabla courses
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'courses'
ORDER BY ordinal_position;

-- 5. Verificar estructura de la tabla lessons
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'lessons'
ORDER BY ordinal_position;

-- 6. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'instructors', 'courses', 'lessons')
ORDER BY tablename, policyname;

-- 7. Verificar si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'instructors', 'courses', 'lessons')
ORDER BY tablename;
