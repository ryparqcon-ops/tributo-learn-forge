-- =====================================================
-- VERIFICAR ESTRUCTURA COMPLETA DE SUPABASE
-- =====================================================

-- 1. Verificar estructura de auth.users (tabla de autenticación de Supabase)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. Verificar estructura de public.users (nuestra tabla personalizada)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Verificar estructura de public.profiles
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Verificar estructura de public.instructors
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'instructors'
ORDER BY ordinal_position;

-- 5. Verificar si hay datos existentes
SELECT 'auth.users' as tabla, COUNT(*) as registros FROM auth.users
UNION ALL
SELECT 'public.users' as tabla, COUNT(*) as registros FROM public.users
UNION ALL
SELECT 'public.profiles' as tabla, COUNT(*) as registros FROM public.profiles
UNION ALL
SELECT 'public.instructors' as tabla, COUNT(*) as registros FROM public.instructors
UNION ALL
SELECT 'public.categories' as tabla, COUNT(*) as registros FROM public.categories
UNION ALL
SELECT 'public.courses' as tabla, COUNT(*) as registros FROM public.courses
UNION ALL
SELECT 'public.lessons' as tabla, COUNT(*) as registros FROM public.lessons;
