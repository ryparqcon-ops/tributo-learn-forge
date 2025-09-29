-- =====================================================
-- CHECK EXISTING COURSES - Verificar cursos existentes
-- =====================================================

-- Verificar todos los cursos
SELECT 
    id,
    title,
    instructor_id,
    category_id,
    is_published
FROM public.courses
ORDER BY id;

-- Verificar la relación completa de cursos con instructores
SELECT 
    c.id as course_id,
    c.title as course_title,
    c.instructor_id,
    i.id as instructor_table_id,
    p.full_name as instructor_name
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
ORDER BY c.id;

-- Verificar categorías
SELECT 
    id,
    name,
    slug
FROM public.categories
ORDER BY id;
