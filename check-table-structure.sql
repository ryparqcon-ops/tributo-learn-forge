-- Script para verificar estructura exacta de las tablas
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar estructura de la tabla categories
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'categories'
ORDER BY ordinal_position;

-- 2. Verificar restricciones de la tabla categories
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
WHERE tc.table_name = 'categories'
  AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 3. Verificar estructura de la tabla profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
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

-- 5. Verificar si hay triggers en las tablas
SELECT 
  trigger_name,
  event_object_table,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('categories', 'profiles', 'instructors', 'courses', 'lessons')
ORDER BY event_object_table, trigger_name;

-- 6. Verificar si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'profiles', 'instructors', 'courses', 'lessons')
ORDER BY tablename;
