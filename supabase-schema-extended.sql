-- =============================================
-- ÍNDICES, TRIGGERS Y POLÍTICAS DE SEGURIDAD
-- =============================================

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para cursos
CREATE INDEX idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX idx_courses_category_id ON public.courses(category_id);
CREATE INDEX idx_courses_published ON public.courses(is_published) WHERE is_published = true;
CREATE INDEX idx_courses_featured ON public.courses(is_featured) WHERE is_featured = true;
CREATE INDEX idx_courses_level ON public.courses(level);
CREATE INDEX idx_courses_rating ON public.courses(rating);

-- Índices para lecciones
CREATE INDEX idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX idx_lessons_published ON public.lessons(is_published) WHERE is_published = true;

-- Índices para inscripciones
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_active ON public.enrollments(is_active) WHERE is_active = true;

-- Índices para progreso de lecciones
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_course_id ON public.lesson_progress(course_id);
CREATE INDEX idx_lesson_progress_completed ON public.lesson_progress(is_completed) WHERE is_completed = true;

-- Índices para reseñas
CREATE INDEX idx_reviews_course_id ON public.reviews(course_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- =============================================
-- FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advisory_bookings_updated_at BEFORE UPDATE ON public.advisory_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estadísticas de instructor
CREATE OR REPLACE FUNCTION update_instructor_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Actualizar total de cursos del instructor
    UPDATE public.instructors 
    SET total_courses = (
      SELECT COUNT(*) 
      FROM public.courses 
      WHERE instructor_id = NEW.instructor_id
    )
    WHERE id = NEW.instructor_id;
    
    -- Actualizar total de estudiantes
    UPDATE public.instructors 
    SET total_students = (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.enrollments e
      JOIN public.courses c ON c.id = e.course_id
      WHERE c.instructor_id = NEW.instructor_id
    )
    WHERE id = NEW.instructor_id;
    
    -- Actualizar horas enseñadas
    UPDATE public.instructors 
    SET total_hours_taught = (
      SELECT COALESCE(SUM(duration_minutes), 0) / 60
      FROM public.lessons l
      JOIN public.courses c ON c.id = l.course_id
      WHERE c.instructor_id = NEW.instructor_id
    )
    WHERE id = NEW.instructor_id;
    
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para actualizar estadísticas cuando se crea un curso
CREATE TRIGGER update_instructor_stats_on_course_insert
  AFTER INSERT ON public.courses
  FOR EACH ROW EXECUTE FUNCTION update_instructor_stats();

-- Función para actualizar progreso de curso
CREATE OR REPLACE FUNCTION update_course_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage DECIMAL(5,2);
BEGIN
  -- Obtener total de lecciones del curso
  SELECT COUNT(*) INTO total_lessons
  FROM public.lessons
  WHERE course_id = NEW.course_id;
  
  -- Obtener lecciones completadas por el usuario
  SELECT COUNT(*) INTO completed_lessons
  FROM public.lesson_progress
  WHERE user_id = NEW.user_id 
    AND course_id = NEW.course_id 
    AND is_completed = true;
  
  -- Calcular porcentaje de progreso
  IF total_lessons > 0 THEN
    progress_percentage := (completed_lessons::DECIMAL / total_lessons::DECIMAL) * 100;
  ELSE
    progress_percentage := 0;
  END IF;
  
  -- Actualizar progreso en enrollments
  UPDATE public.enrollments
  SET progress_percentage = progress_percentage,
      last_accessed_at = NOW(),
      completed_at = CASE 
        WHEN progress_percentage = 100 THEN NOW()
        ELSE completed_at
      END
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar progreso cuando se completa una lección
CREATE TRIGGER update_course_progress_on_lesson_complete
  AFTER UPDATE ON public.lesson_progress
  FOR EACH ROW 
  WHEN (OLD.is_completed = false AND NEW.is_completed = true)
  EXECUTE FUNCTION update_course_progress();

-- =============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_bookings ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para instructors (públicas para lectura)
CREATE POLICY "Anyone can view active instructors" ON public.instructors FOR SELECT USING (is_active = true);
CREATE POLICY "Instructors can update own profile" ON public.instructors FOR UPDATE USING (auth.uid() = profile_id);

-- Políticas para categories (públicas para lectura)
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);

-- Políticas para courses (públicas para lectura de cursos publicados)
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL USING (auth.uid() = (SELECT profile_id FROM public.instructors WHERE id = instructor_id));

-- Políticas para lessons (públicas para lectura de lecciones publicadas)
CREATE POLICY "Anyone can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can manage lessons of own courses" ON public.lessons FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    JOIN public.instructors i ON i.id = c.instructor_id 
    WHERE c.id = course_id AND i.profile_id = auth.uid()
  )
);

-- Políticas para enrollments
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in courses" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para lesson_progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Políticas para reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for enrolled courses" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND course_id = reviews.course_id)
);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para advisory_bookings
CREATE POLICY "Users can view own bookings" ON public.advisory_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.advisory_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.advisory_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Instructors can view bookings for their services" ON public.advisory_bookings FOR SELECT USING (
  auth.uid() = (SELECT profile_id FROM public.instructors WHERE id = instructor_id)
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar categorías
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Tributación Básica', 'tributacion-basica', 'Conceptos fundamentales de tributación peruana', 'book', '#3B82F6'),
('IVA', 'iva', 'Impuesto General a las Ventas', 'receipt', '#10B981'),
('Impuesto a la Renta', 'impuesto-renta', 'Impuesto a la Renta de personas y empresas', 'calculator', '#F59E0B'),
('Planillas', 'planillas', 'Nóminas y tributación laboral', 'users', '#8B5CF6'),
('Fiscalización', 'fiscalizacion', 'Defensa ante fiscalizaciones de SUNAT', 'shield', '#EF4444'),
('Tributación Digital', 'tributacion-digital', 'E-commerce y obligaciones digitales', 'monitor', '#06B6D4');

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de cursos con información completa
CREATE VIEW public.courses_with_details AS
SELECT 
  c.*,
  p.full_name as instructor_name,
  i.title as instructor_title,
  p.avatar_url as instructor_avatar,
  i.rating as instructor_rating,
  cat.name as category_name,
  cat.slug as category_slug,
  COUNT(l.id) as total_lessons,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(r.id) as total_reviews
FROM public.courses c
LEFT JOIN public.instructors i ON i.id = c.instructor_id
LEFT JOIN public.profiles p ON p.id = i.profile_id
LEFT JOIN public.categories cat ON cat.id = c.category_id
LEFT JOIN public.lessons l ON l.course_id = c.id AND l.is_published = true
LEFT JOIN public.reviews r ON r.course_id = c.id
WHERE c.is_published = true
GROUP BY c.id, i.id, p.id, cat.id;

-- Vista de progreso de usuario
CREATE VIEW public.user_progress AS
SELECT 
  e.user_id,
  e.course_id,
  c.title as course_title,
  c.thumbnail as course_thumbnail,
  e.progress_percentage,
  e.enrolled_at,
  e.completed_at,
  COUNT(lp.lesson_id) as completed_lessons,
  COUNT(l.id) as total_lessons
FROM public.enrollments e
JOIN public.courses c ON c.id = e.course_id
LEFT JOIN public.lessons l ON l.course_id = e.course_id AND l.is_published = true
LEFT JOIN public.lesson_progress lp ON lp.user_id = e.user_id AND lp.lesson_id = l.id AND lp.is_completed = true
WHERE e.is_active = true
GROUP BY e.user_id, e.course_id, c.title, c.thumbnail, e.progress_percentage, e.enrolled_at, e.completed_at;
