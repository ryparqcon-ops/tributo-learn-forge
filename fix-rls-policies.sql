-- Script para configurar políticas RLS
-- Ejecutar en el SQL Editor de Supabase

-- 1. Deshabilitar RLS temporalmente para permitir la migración
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- 2. Verificar que RLS está deshabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews')
ORDER BY tablename;

-- 3. Verificar que ahora podemos insertar datos
SELECT 'RLS deshabilitado - listo para migración' as status;
