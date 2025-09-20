-- Script para verificar la migración de datos
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar perfiles migrados
SELECT 
  'Profiles' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN full_name IS NOT NULL THEN 1 END) as con_nombre,
  COUNT(CASE WHEN avatar_url IS NOT NULL THEN 1 END) as con_avatar
FROM public.profiles;

-- 2. Verificar instructores migrados
SELECT 
  'Instructors' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as con_titulo,
  COUNT(CASE WHEN rating > 0 THEN 1 END) as con_rating
FROM public.instructors;

-- 3. Verificar categorías migradas
SELECT 
  'Categories' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as con_nombre
FROM public.categories;

-- 4. Verificar cursos migrados
SELECT 
  'Courses' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as con_titulo,
  COUNT(CASE WHEN is_published = true THEN 1 END) as publicados,
  COUNT(CASE WHEN preview_video IS NOT NULL THEN 1 END) as con_video_preview
FROM public.courses;

-- 5. Verificar lecciones migradas
SELECT 
  'Lessons' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN title IS NOT NULL THEN 1 END) as con_titulo,
  COUNT(CASE WHEN is_published = true THEN 1 END) as publicadas,
  COUNT(CASE WHEN video_url IS NOT NULL THEN 1 END) as con_video
FROM public.lessons;

-- 6. Verificar enrollments migrados
SELECT 
  'Enrollments' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN progress_percentage > 0 THEN 1 END) as con_progreso
FROM public.enrollments;

-- 7. Verificar reviews migradas
SELECT 
  'Reviews' as tabla,
  COUNT(*) as total_registros,
  COUNT(CASE WHEN rating > 0 THEN 1 END) as con_rating
FROM public.reviews;

-- 8. Verificar la vista de cursos con detalles
SELECT 
  'Courses with Details' as vista,
  COUNT(*) as total_cursos,
  AVG(avg_rating) as rating_promedio,
  AVG(total_lessons) as lecciones_promedio
FROM public.courses_with_details;

-- 9. Verificar relaciones (cursos con instructores)
SELECT 
  'Relaciones' as tipo,
  COUNT(*) as cursos_con_instructor
FROM public.courses c
JOIN public.instructors i ON i.id = c.instructor_id
JOIN public.profiles p ON p.id = i.profile_id;

-- 10. Verificar lecciones por curso
SELECT 
  c.title as curso,
  COUNT(l.id) as total_lecciones,
  COUNT(CASE WHEN l.is_published = true THEN 1 END) as lecciones_publicadas
FROM public.courses c
LEFT JOIN public.lessons l ON l.course_id = c.id
GROUP BY c.id, c.title
ORDER BY total_lecciones DESC
LIMIT 10;
