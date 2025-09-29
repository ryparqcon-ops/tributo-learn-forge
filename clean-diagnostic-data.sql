-- =====================================================
-- CLEAN DIAGNOSTIC DATA - Limpiar datos del diagnóstico
-- =====================================================

-- Limpiar datos del diagnóstico de instructor
DELETE FROM public.lesson_progress WHERE student_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.enrollments WHERE student_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.reviews WHERE student_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.consultation_sessions WHERE student_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.payments WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.lessons WHERE course_id IN (
    SELECT id FROM public.courses WHERE instructor_id = '550e8400-e29b-41d4-a716-446655440004'
);
DELETE FROM public.courses WHERE instructor_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.instructors WHERE profile_id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.profiles WHERE id = '550e8400-e29b-41d4-a716-446655440004';
DELETE FROM public.users WHERE id = '550e8400-e29b-41d4-a716-446655440004';

-- Limpiar todas las categorías para empezar limpio
DELETE FROM public.categories;

-- Verificar que esté limpio
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
    'categories' as tabla, COUNT(*) as registros FROM public.categories;
