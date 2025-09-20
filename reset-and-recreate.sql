-- =============================================
-- SCRIPT PARA RESETEAR Y RECREAR COMPLETAMENTE
-- ⚠️  ADVERTENCIA: ESTO ELIMINARÁ TODOS LOS DATOS EXISTENTES
-- =============================================

-- Deshabilitar RLS temporalmente
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.instructors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advisory_bookings DISABLE ROW LEVEL SECURITY;

-- Eliminar tablas en orden correcto (dependencias)
DROP TABLE IF EXISTS public.advisory_bookings CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.lesson_progress CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Eliminar vistas
DROP VIEW IF EXISTS public.courses_with_details CASCADE;
DROP VIEW IF EXISTS public.user_progress CASCADE;

-- Eliminar funciones
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_instructor_stats() CASCADE;
DROP FUNCTION IF EXISTS update_course_progress() CASCADE;

-- Ahora ejecutar el esquema completo
-- (Ejecutar supabase-schema.sql después de este script)
