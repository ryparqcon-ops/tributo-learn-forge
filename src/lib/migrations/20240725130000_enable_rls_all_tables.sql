-- =====================================================
-- MIGRACIÓN: Habilitar RLS en todas las tablas
-- Fecha: 2024-07-25
-- Descripción: Asegurar que todas las tablas tengan RLS habilitado
-- =====================================================

-- Habilitar RLS en todas las tablas que lo necesitan
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Políticas para lesson_progress
CREATE POLICY "Students can view their own lesson progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own lesson progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own lesson progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own lesson progress" ON public.lesson_progress
  FOR DELETE USING (auth.uid() = student_id);

-- Políticas para lessons
CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT USING (true);

CREATE POLICY "Instructors can manage lessons" ON public.lessons
  FOR ALL USING (
    course_id IN (
      SELECT c.id FROM courses c 
      JOIN instructors i ON c.instructor_id = i.id 
      JOIN profiles p ON i.profile_id = p.id 
      WHERE p.id = auth.uid()
    )
  );

-- Políticas para notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Students can create their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = student_id);

-- Políticas para system_settings
CREATE POLICY "Anyone can view system settings" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update system settings" ON public.system_settings
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Políticas para users
CREATE POLICY "Users can view their own user record" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own user record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que todas las tablas tengan RLS habilitado
-- SELECT 
--   schemaname,
--   tablename,
--   rowsecurity as rls_enabled
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename;
