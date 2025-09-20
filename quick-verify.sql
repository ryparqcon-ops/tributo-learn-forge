-- Verificación rápida de la migración
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar que las tablas existen
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews') 
    THEN '✅ Existe' 
    ELSE '❌ No existe' 
  END as estado
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews')
ORDER BY table_name;

-- 2. Contar registros en cada tabla
SELECT 'profiles' as tabla, COUNT(*) as total FROM public.profiles
UNION ALL
SELECT 'instructors' as tabla, COUNT(*) as total FROM public.instructors
UNION ALL
SELECT 'categories' as tabla, COUNT(*) as total FROM public.categories
UNION ALL
SELECT 'courses' as tabla, COUNT(*) as total FROM public.courses
UNION ALL
SELECT 'lessons' as tabla, COUNT(*) as total FROM public.lessons
UNION ALL
SELECT 'enrollments' as tabla, COUNT(*) as total FROM public.enrollments
UNION ALL
SELECT 'reviews' as tabla, COUNT(*) as total FROM public.reviews
ORDER BY tabla;

-- 3. Verificar relaciones (cursos con instructores)
SELECT 
  'Relaciones' as tipo,
  COUNT(*) as cursos_con_instructor
FROM public.courses c
JOIN public.instructors i ON i.id = c.instructor_id
JOIN public.profiles p ON p.id = i.profile_id;

-- 4. Verificar lecciones por curso
SELECT 
  c.title as curso,
  COUNT(l.id) as total_lecciones
FROM public.courses c
LEFT JOIN public.lessons l ON l.course_id = c.id
GROUP BY c.id, c.title
ORDER BY total_lecciones DESC
LIMIT 5;

-- 5. Verificar la vista courses_with_details
SELECT 
  'Vista courses_with_details' as tipo,
  COUNT(*) as total_cursos
FROM public.courses_with_details;
