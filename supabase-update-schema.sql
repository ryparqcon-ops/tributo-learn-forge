-- =============================================
-- SCRIPT DE ACTUALIZACIÓN SEGURA DE SUPABASE
-- =============================================

-- Habilitar extensiones necesarias (si no existen)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- ACTUALIZAR TABLA PROFILES
-- =============================================
DO $$
BEGIN
    -- Verificar si la tabla profiles existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            bio TEXT,
            phone TEXT,
            company TEXT,
            job_title TEXT,
            experience_years INTEGER DEFAULT 0,
            specializations TEXT[],
            social_links JSONB DEFAULT '{}',
            preferences JSONB DEFAULT '{}',
            is_instructor BOOLEAN DEFAULT FALSE,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla profiles creada';
    ELSE
        -- Agregar columnas que puedan faltar
        ALTER TABLE public.profiles 
        ADD COLUMN IF NOT EXISTS phone TEXT,
        ADD COLUMN IF NOT EXISTS company TEXT,
        ADD COLUMN IF NOT EXISTS job_title TEXT,
        ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS specializations TEXT[],
        ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS is_instructor BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Tabla profiles actualizada';
    END IF;
END $$;

-- =============================================
-- ACTUALIZAR TABLA INSTRUCTORS
-- =============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'instructors') THEN
        CREATE TABLE public.instructors (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
            title TEXT NOT NULL,
            experience_years INTEGER NOT NULL,
            bio TEXT NOT NULL,
            specializations TEXT[] NOT NULL,
            education JSONB DEFAULT '[]',
            certifications JSONB DEFAULT '[]',
            work_experience JSONB DEFAULT '[]',
            social_links JSONB DEFAULT '{}',
            teaching_style TEXT,
            languages TEXT[] DEFAULT '{"Español"}',
            rating DECIMAL(3,2) DEFAULT 0.0,
            total_students INTEGER DEFAULT 0,
            total_courses INTEGER DEFAULT 0,
            total_hours_taught INTEGER DEFAULT 0,
            response_time_hours INTEGER DEFAULT 24,
            is_verified BOOLEAN DEFAULT FALSE,
            is_featured BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla instructors creada';
    ELSE
        -- Agregar columnas que puedan faltar
        ALTER TABLE public.instructors 
        ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS teaching_style TEXT,
        ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{"Español"}',
        ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Tabla instructors actualizada';
    END IF;
END $$;

-- =============================================
-- ACTUALIZAR TABLA CATEGORIES
-- =============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'categories') THEN
        CREATE TABLE public.categories (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            icon TEXT,
            color TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla categories creada';
    ELSE
        ALTER TABLE public.categories 
        ADD COLUMN IF NOT EXISTS icon TEXT,
        ADD COLUMN IF NOT EXISTS color TEXT,
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Tabla categories actualizada';
    END IF;
END $$;

-- =============================================
-- ACTUALIZAR TABLA COURSES
-- =============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        CREATE TABLE public.courses (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            summary TEXT NOT NULL,
            description TEXT,
            instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE NOT NULL,
            category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
            price_cents INTEGER NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'PEN',
            duration_minutes INTEGER NOT NULL DEFAULT 0,
            avg_lesson_time INTEGER DEFAULT 0,
            thumbnail TEXT,
            preview_video TEXT,
            preview_duration INTEGER DEFAULT 0,
            level TEXT NOT NULL CHECK (level IN ('Principiante', 'Intermedio', 'Avanzado')),
            language TEXT NOT NULL DEFAULT 'Español',
            tags TEXT[] DEFAULT '{}',
            rating DECIMAL(3,2) DEFAULT 0.0,
            students_enrolled INTEGER DEFAULT 0,
            ai_enabled BOOLEAN DEFAULT FALSE,
            certificate BOOLEAN DEFAULT FALSE,
            lifetime_access BOOLEAN DEFAULT TRUE,
            is_published BOOLEAN DEFAULT FALSE,
            is_featured BOOLEAN DEFAULT FALSE,
            published_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla courses creada';
    ELSE
        ALTER TABLE public.courses 
        ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS avg_lesson_time INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS preview_video TEXT,
        ADD COLUMN IF NOT EXISTS preview_duration INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS level TEXT CHECK (level IN ('Principiante', 'Intermedio', 'Avanzado')),
        ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Español',
        ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS ai_enabled BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS certificate BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS lifetime_access BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Tabla courses actualizada';
    END IF;
END $$;

-- =============================================
-- ACTUALIZAR TABLA LESSONS
-- =============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
        CREATE TABLE public.lessons (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            duration_minutes INTEGER NOT NULL DEFAULT 0,
            video_url TEXT,
            thumbnail TEXT,
            transcript TEXT,
            objectives TEXT[] DEFAULT '{}',
            resources JSONB DEFAULT '[]',
            order_index INTEGER NOT NULL DEFAULT 0,
            is_published BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla lessons creada';
    ELSE
        ALTER TABLE public.lessons 
        ADD COLUMN IF NOT EXISTS transcript TEXT,
        ADD COLUMN IF NOT EXISTS objectives TEXT[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Tabla lessons actualizada';
    END IF;
END $$;

-- =============================================
-- CREAR TABLAS FALTANTES
-- =============================================

-- Tabla enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, course_id)
);

-- Tabla lesson_progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    watch_time_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Tabla reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Tabla coupons
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount_cents INTEGER DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PEN',
    payment_method TEXT NOT NULL,
    payment_provider TEXT NOT NULL,
    provider_transaction_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    discount_amount_cents INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla advisory_bookings
CREATE TABLE IF NOT EXISTS public.advisory_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    meeting_url TEXT,
    notes TEXT,
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'PEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREAR ÍNDICES (si no existen)
-- =============================================

-- Índices para cursos
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON public.courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_courses_featured ON public.courses(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON public.courses(rating);

-- Índices para lecciones
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON public.lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON public.lessons(is_published) WHERE is_published = true;

-- Índices para inscripciones
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_active ON public.enrollments(is_active) WHERE is_active = true;

-- Índices para progreso de lecciones
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON public.lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON public.lesson_progress(is_completed) WHERE is_completed = true;

-- Índices para reseñas
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON public.reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- =============================================
-- CREAR FUNCIONES Y TRIGGERS
-- =============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para updated_at (si no existen)
DO $$
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Instructors
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_instructors_updated_at') THEN
        CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Courses
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_courses_updated_at') THEN
        CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Lessons
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_lessons_updated_at') THEN
        CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Reviews
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reviews_updated_at') THEN
        CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Payments
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at') THEN
        CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Advisory bookings
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_advisory_bookings_updated_at') THEN
        CREATE TRIGGER update_advisory_bookings_updated_at BEFORE UPDATE ON public.advisory_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================
-- HABILITAR RLS (si no está habilitado)
-- =============================================
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

-- =============================================
-- CREAR POLÍTICAS RLS (si no existen)
-- =============================================

-- Políticas para profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Políticas para instructors
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active instructors' AND tablename = 'instructors') THEN
        CREATE POLICY "Anyone can view active instructors" ON public.instructors FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can update own profile' AND tablename = 'instructors') THEN
        CREATE POLICY "Instructors can update own profile" ON public.instructors FOR UPDATE USING (auth.uid() = profile_id);
    END IF;
END $$;

-- Políticas para categories
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view active categories' AND tablename = 'categories') THEN
        CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Políticas para courses
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published courses' AND tablename = 'courses') THEN
        CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can manage own courses' AND tablename = 'courses') THEN
        CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL USING (auth.uid() = (SELECT profile_id FROM public.instructors WHERE id = instructor_id));
    END IF;
END $$;

-- Políticas para lessons
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published lessons' AND tablename = 'lessons') THEN
        CREATE POLICY "Anyone can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can manage lessons of own courses' AND tablename = 'lessons') THEN
        CREATE POLICY "Instructors can manage lessons of own courses" ON public.lessons FOR ALL USING (
            EXISTS (
                SELECT 1 FROM public.courses c 
                JOIN public.instructors i ON i.id = c.instructor_id 
                WHERE c.id = course_id AND i.profile_id = auth.uid()
            )
        );
    END IF;
END $$;

-- Políticas para enrollments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own enrollments' AND tablename = 'enrollments') THEN
        CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can enroll in courses' AND tablename = 'enrollments') THEN
        CREATE POLICY "Users can enroll in courses" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own enrollments' AND tablename = 'enrollments') THEN
        CREATE POLICY "Users can update own enrollments" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Políticas para lesson_progress
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own progress' AND tablename = 'lesson_progress') THEN
        CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own progress' AND tablename = 'lesson_progress') THEN
        CREATE POLICY "Users can update own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Políticas para reviews
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create reviews for enrolled courses' AND tablename = 'reviews') THEN
        CREATE POLICY "Users can create reviews for enrolled courses" ON public.reviews FOR INSERT WITH CHECK (
            auth.uid() = user_id AND
            EXISTS (SELECT 1 FROM public.enrollments WHERE user_id = auth.uid() AND course_id = reviews.course_id)
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own reviews' AND tablename = 'reviews') THEN
        CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Políticas para payments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own payments' AND tablename = 'payments') THEN
        CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create payments' AND tablename = 'payments') THEN
        CREATE POLICY "Users can create payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Políticas para advisory_bookings
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own bookings' AND tablename = 'advisory_bookings') THEN
        CREATE POLICY "Users can view own bookings" ON public.advisory_bookings FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create bookings' AND tablename = 'advisory_bookings') THEN
        CREATE POLICY "Users can create bookings" ON public.advisory_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own bookings' AND tablename = 'advisory_bookings') THEN
        CREATE POLICY "Users can update own bookings" ON public.advisory_bookings FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can view bookings for their services' AND tablename = 'advisory_bookings') THEN
        CREATE POLICY "Instructors can view bookings for their services" ON public.advisory_bookings FOR SELECT USING (
            auth.uid() = (SELECT profile_id FROM public.instructors WHERE id = instructor_id)
        );
    END IF;
END $$;

-- =============================================
-- INSERTAR CATEGORÍAS (si no existen)
-- =============================================
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Tributación Básica', 'tributacion-basica', 'Conceptos fundamentales de tributación peruana', 'book', '#3B82F6'),
('IVA', 'iva', 'Impuesto General a las Ventas', 'receipt', '#10B981'),
('Impuesto a la Renta', 'impuesto-renta', 'Impuesto a la Renta de personas y empresas', 'calculator', '#F59E0B'),
('Planillas', 'planillas', 'Nóminas y tributación laboral', 'users', '#8B5CF6'),
('Fiscalización', 'fiscalizacion', 'Defensa ante fiscalizaciones de SUNAT', 'shield', '#EF4444'),
('Tributación Digital', 'tributacion-digital', 'E-commerce y obligaciones digitales', 'monitor', '#06B6D4')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- CREAR VISTAS (si no existen)
-- =============================================

-- Vista de cursos con información completa
CREATE OR REPLACE VIEW public.courses_with_details AS
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
CREATE OR REPLACE VIEW public.user_progress AS
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

-- =============================================
-- MENSAJE FINAL
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Esquema actualizado exitosamente!';
    RAISE NOTICE '📊 Verifica que todas las tablas, índices y políticas se crearon correctamente';
    RAISE NOTICE '🚀 El sistema está listo para usar con Supabase';
END $$;
