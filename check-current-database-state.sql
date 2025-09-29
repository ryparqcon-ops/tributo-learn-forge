-- =====================================================
-- VERIFICACIÓN COMPLETA DEL ESTADO ACTUAL DE LA BASE DE DATOS
-- =====================================================

-- 1. VERIFICAR ESTRUCTURA DE TABLAS
SELECT '=== ESTRUCTURA DE TABLAS ===' as info;

-- Estructura de auth.users
SELECT 'auth.users' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users'
ORDER BY ordinal_position;

-- Estructura de public.users (si existe)
SELECT 'public.users' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Estructura de public.profiles
SELECT 'public.profiles' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Estructura de public.instructors
SELECT 'public.instructors' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'instructors'
ORDER BY ordinal_position;

-- Estructura de public.categories
SELECT 'public.categories' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'categories'
ORDER BY ordinal_position;

-- Estructura de public.courses
SELECT 'public.courses' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'courses'
ORDER BY ordinal_position;

-- Estructura de public.lessons
SELECT 'public.lessons' as tabla, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'lessons'
ORDER BY ordinal_position;

-- 2. VERIFICAR DATOS EXISTENTES
SELECT '=== DATOS EXISTENTES ===' as info;

-- Contar registros en cada tabla
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
SELECT 'public.lessons' as tabla, COUNT(*) as registros FROM public.lessons
UNION ALL
SELECT 'public.enrollments' as tabla, COUNT(*) as registros FROM public.enrollments
UNION ALL
SELECT 'public.reviews' as tabla, COUNT(*) as registros FROM public.reviews
UNION ALL
SELECT 'public.consultations' as tabla, COUNT(*) as registros FROM public.consultations
UNION ALL
SELECT 'public.lesson_progress' as tabla, COUNT(*) as registros FROM public.lesson_progress
UNION ALL
SELECT 'public.notifications' as tabla, COUNT(*) as registros FROM public.notifications;

-- 3. VERIFICAR USUARIOS EN AUTH.USERS
SELECT '=== USUARIOS EN AUTH.USERS ===' as info;
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    role
FROM auth.users
ORDER BY created_at;

-- 4. VERIFICAR PERFILES EXISTENTES
SELECT '=== PERFILES EXISTENTES ===' as info;
SELECT 
    id,
    full_name,
    is_instructor,
    is_verified,
    created_at
FROM public.profiles
ORDER BY created_at;

-- 5. VERIFICAR INSTRUCTORES EXISTENTES
SELECT '=== INSTRUCTORES EXISTENTES ===' as info;
SELECT 
    i.id,
    i.profile_id,
    i.title,
    i.rating,
    i.is_verified,
    i.is_featured,
    p.full_name
FROM public.instructors i
LEFT JOIN public.profiles p ON i.profile_id = p.id
ORDER BY i.created_at;

-- 6. VERIFICAR CATEGORÍAS EXISTENTES
SELECT '=== CATEGORÍAS EXISTENTES ===' as info;
SELECT 
    id,
    name,
    slug,
    is_active,
    created_at
FROM public.categories
ORDER BY created_at;

-- 7. VERIFICAR CURSOS EXISTENTES
SELECT '=== CURSOS EXISTENTES ===' as info;
SELECT 
    c.id,
    c.title,
    c.slug,
    c.instructor_id,
    c.category_id,
    c.is_published,
    c.is_featured,
    p.full_name as instructor_name,
    cat.name as category_name
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
LEFT JOIN public.categories cat ON c.category_id = cat.id
ORDER BY c.created_at;

-- 8. VERIFICAR LECCIONES EXISTENTES
SELECT '=== LECCIONES EXISTENTES ===' as info;
SELECT 
    l.id,
    l.course_id,
    l.title,
    l.order_index,
    l.is_published,
    l.is_preview,
    c.title as course_title
FROM public.lessons l
LEFT JOIN public.courses c ON l.course_id = c.id
ORDER BY l.course_id, l.order_index;

-- 9. VERIFICAR ESTADO DE RLS
SELECT '=== ESTADO DE RLS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews', 'consultations', 'lesson_progress', 'notifications')
ORDER BY tablename;

-- 10. VERIFICAR RELACIONES Y FOREIGN KEYS
SELECT '=== VERIFICACIÓN DE RELACIONES ===' as info;

-- Verificar si hay cursos sin instructor válido
SELECT 'Cursos sin instructor válido:' as problema, COUNT(*) as cantidad
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
WHERE i.id IS NULL;

-- Verificar si hay cursos sin categoría válida
SELECT 'Cursos sin categoría válida:' as problema, COUNT(*) as cantidad
FROM public.courses c
LEFT JOIN public.categories cat ON c.category_id = cat.id
WHERE cat.id IS NULL;

-- Verificar si hay lecciones sin curso válido
SELECT 'Lecciones sin curso válido:' as problema, COUNT(*) as cantidad
FROM public.lessons l
LEFT JOIN public.courses c ON l.course_id = c.id
WHERE c.id IS NULL;

-- Verificar si hay instructores sin perfil válido
SELECT 'Instructores sin perfil válido:' as problema, COUNT(*) as cantidad
FROM public.instructors i
LEFT JOIN public.profiles p ON i.profile_id = p.id
WHERE p.id IS NULL;
