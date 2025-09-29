-- =====================================================
-- FIX USERS PERMISSIONS - Otorgar permisos explícitos
-- =====================================================

-- Otorgar permisos explícitos a la tabla users para el rol anónimo
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;

-- Otorgar permisos a la tabla profiles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Otorgar permisos a la tabla instructors
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instructors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instructors TO authenticated;

-- Otorgar permisos a la tabla courses
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;

-- Otorgar permisos a la tabla lessons
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;

-- Otorgar permisos a la tabla categories
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;

-- Otorgar permisos a la tabla enrollments
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;

-- Otorgar permisos a la tabla lesson_progress
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;

-- Otorgar permisos a la tabla reviews
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

-- Otorgar permisos a la tabla consultations
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultations TO authenticated;

-- Otorgar permisos a la tabla consultation_sessions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultation_sessions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultation_sessions TO authenticated;

-- Otorgar permisos a la tabla payments
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;

-- Verificar permisos otorgados
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'profiles', 'instructors', 'courses', 'lessons', 'categories')
    AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;
