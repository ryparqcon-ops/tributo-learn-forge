-- Script para configurar políticas RLS apropiadas
-- Ejecutar DESPUÉS de la migración exitosa

-- 1. Habilitar RLS nuevamente
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 2. Crear políticas para lectura pública
CREATE POLICY "Public read access for profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Public read access for instructors" ON public.instructors
  FOR SELECT USING (true);

CREATE POLICY "Public read access for categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for courses" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for lessons" ON public.lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for enrollments" ON public.enrollments
  FOR SELECT USING (true);

CREATE POLICY "Public read access for reviews" ON public.reviews
  FOR SELECT USING (true);

-- 3. Crear políticas para inserción (solo para usuarios autenticados)
CREATE POLICY "Authenticated users can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can insert instructors" ON public.instructors
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Authenticated users can insert courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert lessons" ON public.lessons
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Crear políticas para actualización (solo para propietarios)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can update own instructor profile" ON public.instructors
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Instructors can update own courses" ON public.courses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.instructors 
      WHERE id = instructor_id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update own lessons" ON public.lessons
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      JOIN public.instructors i ON i.id = c.instructor_id
      WHERE c.id = course_id AND i.profile_id = auth.uid()
    )
  );

-- 5. Verificar que las políticas están configuradas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'instructors', 'categories', 'courses', 'lessons', 'enrollments', 'reviews')
ORDER BY tablename, policyname;
