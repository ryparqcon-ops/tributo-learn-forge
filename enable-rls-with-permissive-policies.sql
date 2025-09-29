-- =====================================================
-- ENABLE RLS WITH PERMISSIVE POLICIES - Políticas permisivas para migración
-- =====================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes restrictivas
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "System can insert users" ON public.users;
DROP POLICY IF EXISTS "Allow insert for migration" ON public.users;

-- Crear políticas permisivas para usuarios
CREATE POLICY "Allow all operations on users" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para perfiles
CREATE POLICY "Allow all operations on profiles" ON public.profiles
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para instructores
CREATE POLICY "Allow all operations on instructors" ON public.instructors
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para cursos
CREATE POLICY "Allow all operations on courses" ON public.courses
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para lecciones
CREATE POLICY "Allow all operations on lessons" ON public.lessons
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para categorías
CREATE POLICY "Allow all operations on categories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para inscripciones
CREATE POLICY "Allow all operations on enrollments" ON public.enrollments
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para progreso de lecciones
CREATE POLICY "Allow all operations on lesson_progress" ON public.lesson_progress
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para reseñas
CREATE POLICY "Allow all operations on reviews" ON public.reviews
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para consultorías
CREATE POLICY "Allow all operations on consultations" ON public.consultations
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para sesiones de consultoría
CREATE POLICY "Allow all operations on consultation_sessions" ON public.consultation_sessions
    FOR ALL USING (true) WITH CHECK (true);

-- Crear políticas permisivas para pagos
CREATE POLICY "Allow all operations on payments" ON public.payments
    FOR ALL USING (true) WITH CHECK (true);

-- Verificar que RLS esté habilitado y las políticas estén creadas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('users', 'profiles', 'instructors', 'courses', 'lessons', 'categories')
ORDER BY tablename;

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('users', 'profiles', 'instructors', 'courses', 'lessons', 'categories')
ORDER BY tablename, policyname;
