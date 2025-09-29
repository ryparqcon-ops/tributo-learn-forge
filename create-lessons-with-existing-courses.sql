-- =====================================================
-- CREATE LESSONS WITH EXISTING COURSES - Crear lecciones con cursos existentes
-- =====================================================

-- Primero, obtener los cursos existentes
WITH existing_courses AS (
    SELECT 
        c.id as course_id,
        c.title as course_title,
        ROW_NUMBER() OVER (ORDER BY c.id) as course_number
    FROM public.courses c
    ORDER BY c.id
)
-- Crear lecciones usando los cursos existentes
INSERT INTO public.lessons (
    id,
    course_id,
    title,
    description,
    video_url,
    duration_minutes,
    order_index,
    is_published,
    is_preview
)
SELECT 
    '550e8400-e29b-41d4-a716-446655440008'::uuid + (course_number - 1) * 2,
    course_id,
    'Introducción - ' || course_title,
    'Lección introductoria del curso: ' || course_title,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    45,
    1,
    true,
    true
FROM existing_courses
UNION ALL
SELECT 
    '550e8400-e29b-41d4-a716-446655440009'::uuid + (course_number - 1) * 2,
    course_id,
    'Contenido Principal - ' || course_title,
    'Contenido principal del curso: ' || course_title,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    60,
    2,
    true,
    false
FROM existing_courses;

-- Verificar que las lecciones se crearon correctamente
SELECT 
    l.id as lesson_id,
    l.title as lesson_title,
    l.course_id,
    c.title as course_title,
    p.full_name as instructor_name
FROM public.lessons l
LEFT JOIN public.courses c ON l.course_id = c.id
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
ORDER BY l.course_id, l.order_index;
