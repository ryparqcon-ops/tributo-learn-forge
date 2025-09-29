-- =====================================================
-- DESHABILITAR RLS TEMPORALMENTE PARA CARGA DE DATOS
-- =====================================================

-- Deshabilitar RLS en todas las tablas para permitir carga de datos
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews', 'consultations', 'lesson_progress', 'notifications')
ORDER BY tablename;