-- =====================================================
-- CHECK ALL DATA - Verificar todos los datos existentes
-- =====================================================

-- Verificar usuarios
SELECT 'USUARIOS' as tabla, COUNT(*) as cantidad FROM public.users;
SELECT * FROM public.users ORDER BY id;

-- Verificar perfiles
SELECT 'PERFILES' as tabla, COUNT(*) as cantidad FROM public.profiles;
SELECT * FROM public.profiles ORDER BY id;

-- Verificar instructores
SELECT 'INSTRUCTORES' as tabla, COUNT(*) as cantidad FROM public.instructors;
SELECT * FROM public.instructors ORDER BY id;

-- Verificar categorías
SELECT 'CATEGORÍAS' as tabla, COUNT(*) as cantidad FROM public.categories;
SELECT * FROM public.categories ORDER BY id;

-- Verificar cursos
SELECT 'CURSOS' as tabla, COUNT(*) as cantidad FROM public.courses;
SELECT * FROM public.courses ORDER BY id;

-- Verificar lecciones
SELECT 'LECCIONES' as tabla, COUNT(*) as cantidad FROM public.lessons;
SELECT * FROM public.lessons ORDER BY id;
