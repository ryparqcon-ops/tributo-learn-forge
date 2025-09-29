-- =====================================================
-- CHECK EXISTING INSTRUCTORS - Verificar instructores existentes
-- =====================================================

-- Verificar todos los usuarios
SELECT 
    'users' as tabla,
    id,
    email,
    role
FROM public.users
ORDER BY id;

-- Verificar todos los perfiles
SELECT 
    'profiles' as tabla,
    id,
    full_name,
    is_instructor
FROM public.profiles
ORDER BY id;

-- Verificar todos los instructores
SELECT 
    'instructors' as tabla,
    id,
    profile_id,
    title
FROM public.instructors
ORDER BY id;

-- Verificar la relación completa
SELECT 
    u.id as user_id,
    u.email,
    p.full_name,
    i.id as instructor_id,
    i.title as instructor_title
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.instructors i ON i.profile_id = p.id
WHERE u.role = 'instructor'
ORDER BY u.id;
