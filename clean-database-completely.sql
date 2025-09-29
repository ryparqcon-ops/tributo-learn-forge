-- =====================================================
-- LIMPIAR BASE DE DATOS COMPLETAMENTE
-- =====================================================

-- Limpiar en orden inverso para respetar las foreign keys
DELETE FROM public.lesson_progress;
DELETE FROM public.reviews;
DELETE FROM public.consultations;
DELETE FROM public.notifications;
DELETE FROM public.enrollments;
DELETE FROM public.lessons;
DELETE FROM public.courses;
DELETE FROM public.instructors;
DELETE FROM public.profiles;
DELETE FROM public.categories;
DELETE FROM public.users WHERE role != 'admin';

-- Verificar que las tablas están vacías
SELECT 'lesson_progress' as tabla, COUNT(*) as registros FROM public.lesson_progress
UNION ALL
SELECT 'reviews' as tabla, COUNT(*) as registros FROM public.reviews
UNION ALL
SELECT 'consultations' as tabla, COUNT(*) as registros FROM public.consultations
UNION ALL
SELECT 'notifications' as tabla, COUNT(*) as registros FROM public.notifications
UNION ALL
SELECT 'enrollments' as tabla, COUNT(*) as registros FROM public.enrollments
UNION ALL
SELECT 'lessons' as tabla, COUNT(*) as registros FROM public.lessons
UNION ALL
SELECT 'courses' as tabla, COUNT(*) as registros FROM public.courses
UNION ALL
SELECT 'instructors' as tabla, COUNT(*) as registros FROM public.instructors
UNION ALL
SELECT 'profiles' as tabla, COUNT(*) as registros FROM public.profiles
UNION ALL
SELECT 'categories' as tabla, COUNT(*) as registros FROM public.categories
UNION ALL
SELECT 'users' as tabla, COUNT(*) as registros FROM public.users WHERE role != 'admin';
