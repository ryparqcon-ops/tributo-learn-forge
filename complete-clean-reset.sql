-- =====================================================
-- COMPLETE CLEAN RESET - Limpieza completa de la base de datos
-- =====================================================

-- Deshabilitar RLS temporalmente para permitir limpieza
ALTER TABLE public.lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- Limpiar TODAS las tablas en orden correcto (respetando foreign keys)
DELETE FROM public.lesson_progress;
DELETE FROM public.enrollments;
DELETE FROM public.reviews;
DELETE FROM public.consultation_sessions;
DELETE FROM public.payments;
DELETE FROM public.lessons;
DELETE FROM public.courses;
DELETE FROM public.instructors;
DELETE FROM public.profiles;
DELETE FROM public.users;
DELETE FROM public.categories;

-- Verificar que esté completamente limpio
SELECT 
    'users' as tabla, COUNT(*) as registros FROM public.users
UNION ALL
SELECT 
    'profiles' as tabla, COUNT(*) as registros FROM public.profiles
UNION ALL
SELECT 
    'instructors' as tabla, COUNT(*) as registros FROM public.instructors
UNION ALL
SELECT 
    'courses' as tabla, COUNT(*) as registros FROM public.courses
UNION ALL
SELECT 
    'lessons' as tabla, COUNT(*) as registros FROM public.lessons
UNION ALL
SELECT 
    'categories' as tabla, COUNT(*) as registros FROM public.categories
UNION ALL
SELECT 
    'enrollments' as tabla, COUNT(*) as registros FROM public.enrollments
UNION ALL
SELECT 
    'lesson_progress' as tabla, COUNT(*) as registros FROM public.lesson_progress
UNION ALL
SELECT 
    'reviews' as tabla, COUNT(*) as registros FROM public.reviews
UNION ALL
SELECT 
    'consultations' as tabla, COUNT(*) as registros FROM public.consultations
UNION ALL
SELECT 
    'consultation_sessions' as tabla, COUNT(*) as registros FROM public.consultation_sessions
UNION ALL
SELECT 
    'payments' as tabla, COUNT(*) as registros FROM public.payments;
