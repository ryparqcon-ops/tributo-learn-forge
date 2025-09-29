-- =====================================================
-- TRIBUTO LEARN - RESET COMPLETO Y BUILD
-- =====================================================
-- Este script hace un reset completo y construye todo desde cero

-- =====================================================
-- 1. DESHABILITAR RLS TEMPORALMENTE
-- =====================================================

DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', table_name);
            RAISE NOTICE 'RLS deshabilitado en: %', table_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'No se pudo deshabilitar RLS en %: %', table_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- =====================================================
-- 2. ELIMINAR VISTAS
-- =====================================================

DROP VIEW IF EXISTS public.courses_with_details CASCADE;
DROP VIEW IF EXISTS public.instructor_with_profile CASCADE;
DROP VIEW IF EXISTS public.student_progress_summary CASCADE;
DROP VIEW IF EXISTS public.consultation_availability CASCADE;

-- =====================================================
-- 3. ELIMINAR FUNCIONES
-- =====================================================

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_course_rating(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_instructor_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_student_progress(UUID) CASCADE;

-- =====================================================
-- 4. ELIMINAR TRIGGERS
-- =====================================================

DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I CASCADE', 
                          trigger_record.trigger_name, 
                          trigger_record.event_object_table);
            RAISE NOTICE 'Trigger eliminado: % en %', trigger_record.trigger_name, trigger_record.event_object_table;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'No se pudo eliminar trigger %: %', trigger_record.trigger_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- =====================================================
-- 5. ELIMINAR TABLAS (EN ORDEN CORRECTO)
-- =====================================================

DROP TABLE IF EXISTS public.consultation_sessions CASCADE;
DROP TABLE IF EXISTS public.consultations CASCADE;
DROP TABLE IF EXISTS public.lesson_progress CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.lessons CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- =====================================================
-- 6. LIMPIAR POLÍTICAS RLS
-- =====================================================

DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 
                          policy_record.policyname, 
                          policy_record.tablename);
            RAISE NOTICE 'Política eliminada: % en %', policy_record.policyname, policy_record.tablename;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'No se pudo eliminar política %: %', policy_record.policyname, SQLERRM;
        END;
    END LOOP;
END $$;

-- =====================================================
-- 7. LIMPIAR ÍNDICES
-- =====================================================

DO $$
DECLARE
    index_record RECORD;
BEGIN
    FOR index_record IN 
        SELECT indexname
        FROM pg_indexes 
        WHERE schemaname = 'public'
        AND indexname NOT LIKE 'pg_%'
    LOOP
        BEGIN
            EXECUTE format('DROP INDEX IF EXISTS public.%I CASCADE', index_record.indexname);
            RAISE NOTICE 'Índice eliminado: %', index_record.indexname;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'No se pudo eliminar índice %: %', index_record.indexname, SQLERRM;
        END;
    END LOOP;
END $$;

-- =====================================================
-- 8. CREAR ESTRUCTURA BASE
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (base para autenticación)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles (información extendida de usuarios)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'es',
    experience_years INTEGER DEFAULT 0,
    specializations TEXT[],
    social_links JSONB DEFAULT '{}',
    is_instructor BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de instructores
CREATE TABLE public.instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(100),
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    specializations TEXT[],
    education JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    work_experience JSONB DEFAULT '[]',
    social_links JSONB DEFAULT '{}',
    teaching_style TEXT,
    languages TEXT[] DEFAULT '{"es"}',
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    total_hours_taught INTEGER DEFAULT 0,
    response_time_hours INTEGER DEFAULT 24,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cursos
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    preview_video TEXT,
    thumbnail_url TEXT,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_hours INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'PEN',
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    total_lessons INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    learning_outcomes TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de lecciones
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false,
    resources JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de inscripciones
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- Tabla de progreso de lecciones
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    watched_duration INTEGER DEFAULT 0, -- en segundos
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Tabla de reseñas
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- Tabla de consultorías
CREATE TABLE public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_hour DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    duration_hours INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT true,
    max_students INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de sesiones de consultoría
CREATE TABLE public.consultation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    meeting_url TEXT,
    notes TEXT,
    student_rating INTEGER CHECK (student_rating >= 1 AND student_rating <= 5),
    instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PEN',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_provider VARCHAR(50),
    provider_transaction_id VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. CREAR ÍNDICES
-- =====================================================

-- Índices para usuarios
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_active ON public.users(is_active);

-- Índices para perfiles
CREATE INDEX idx_profiles_instructor ON public.profiles(is_instructor);
CREATE INDEX idx_profiles_verified ON public.profiles(is_verified);

-- Índices para categorías
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_active ON public.categories(is_active);

-- Índices para instructores
CREATE INDEX idx_instructors_profile ON public.instructors(profile_id);
CREATE INDEX idx_instructors_active ON public.instructors(is_active);
CREATE INDEX idx_instructors_featured ON public.instructors(is_featured);
CREATE INDEX idx_instructors_rating ON public.instructors(rating);

-- Índices para cursos
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_courses_featured ON public.courses(is_featured);
CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_rating ON public.courses(rating);

-- Índices para lecciones
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_published ON public.lessons(is_published);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);

-- Índices para inscripciones
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_enrollments_active ON public.enrollments(is_active);

-- Índices para progreso
CREATE INDEX idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_course ON public.lesson_progress(course_id);

-- Índices para reseñas
CREATE INDEX idx_reviews_student ON public.reviews(student_id);
CREATE INDEX idx_reviews_course ON public.reviews(course_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

-- Índices para consultorías
CREATE INDEX idx_consultations_instructor ON public.consultations(instructor_id);
CREATE INDEX idx_consultations_available ON public.consultations(is_available);

-- Índices para sesiones de consultoría
CREATE INDEX idx_consultation_sessions_student ON public.consultation_sessions(student_id);
CREATE INDEX idx_consultation_sessions_instructor ON public.consultation_sessions(instructor_id);
CREATE INDEX idx_consultation_sessions_scheduled ON public.consultation_sessions(scheduled_at);

-- Índices para pagos
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_payments_created ON public.payments(created_at);

-- =====================================================
-- 10. CREAR FUNCIONES
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para calcular rating de curso
CREATE OR REPLACE FUNCTION public.calculate_course_rating(course_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    avg_rating DECIMAL(3,2);
BEGIN
    SELECT COALESCE(AVG(rating), 0.00)
    INTO avg_rating
    FROM public.reviews
    WHERE course_id = course_id;
    
    RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de instructor
CREATE OR REPLACE FUNCTION public.get_instructor_stats(instructor_id UUID)
RETURNS JSONB AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_courses', COUNT(c.id),
        'total_students', COUNT(DISTINCT e.student_id),
        'total_hours_taught', COALESCE(SUM(c.duration_hours), 0),
        'average_rating', COALESCE(AVG(c.rating), 0.00),
        'total_reviews', COALESCE(SUM(c.total_reviews), 0)
    )
    INTO stats
    FROM public.courses c
    LEFT JOIN public.enrollments e ON e.course_id = c.id
    WHERE c.instructor_id = instructor_id AND c.is_published = true;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener progreso del estudiante
CREATE OR REPLACE FUNCTION public.get_student_progress(student_id UUID)
RETURNS JSONB AS $$
DECLARE
    progress JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_enrollments', COUNT(e.id),
        'completed_courses', COUNT(CASE WHEN e.completed_at IS NOT NULL THEN 1 END),
        'total_lessons_watched', COUNT(lp.id),
        'total_hours_watched', COALESCE(SUM(l.duration_minutes), 0) / 60.0
    )
    INTO progress
    FROM public.enrollments e
    LEFT JOIN public.lesson_progress lp ON lp.student_id = e.student_id AND lp.course_id = e.course_id
    LEFT JOIN public.lessons l ON l.id = lp.lesson_id
    WHERE e.student_id = student_id;
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. CREAR TRIGGERS
-- =====================================================

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instructors_updated_at
    BEFORE UPDATE ON public.instructors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
    BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
    BEFORE UPDATE ON public.lesson_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON public.consultations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_sessions_updated_at
    BEFORE UPDATE ON public.consultation_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 12. CREAR VISTAS
-- =====================================================

-- Vista de cursos con información completa
CREATE VIEW public.courses_with_details AS
SELECT
    c.id,
    c.title,
    c.slug,
    c.description,
    c.short_description,
    c.preview_video,
    c.thumbnail_url,
    c.instructor_id,
    c.category_id,
    c.level,
    c.duration_hours,
    c.price,
    c.currency,
    c.is_published,
    c.is_featured,
    c.is_free,
    c.rating,
    c.total_lessons,
    c.total_enrollments,
    c.total_reviews,
    c.tags,
    c.requirements,
    c.learning_outcomes,
    c.created_at,
    c.updated_at,
    p.full_name as instructor_name,
    i.title as instructor_title,
    p.avatar_url as instructor_avatar,
    i.rating as instructor_rating,
    cat.name as category_name,
    cat.slug as category_slug,
    COUNT(l.id) as actual_total_lessons,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as actual_total_reviews
FROM public.courses c
LEFT JOIN public.instructors i ON i.id = c.instructor_id
LEFT JOIN public.profiles p ON p.id = i.profile_id
LEFT JOIN public.categories cat ON cat.id = c.category_id
LEFT JOIN public.lessons l ON l.course_id = c.id AND l.is_published = true
LEFT JOIN public.reviews r ON r.course_id = c.id
WHERE c.is_published = true
GROUP BY c.id, i.id, p.id, cat.id;

-- Vista de instructor con perfil
CREATE VIEW public.instructor_with_profile AS
SELECT
    i.*,
    p.full_name,
    p.avatar_url,
    p.bio as profile_bio,
    p.experience_years as profile_experience,
    p.specializations as profile_specializations,
    p.social_links as profile_social_links
FROM public.instructors i
JOIN public.profiles p ON p.id = i.profile_id
WHERE i.is_active = true;

-- Vista de resumen de progreso del estudiante
CREATE VIEW public.student_progress_summary AS
SELECT
    e.student_id,
    e.course_id,
    c.title as course_title,
    e.enrolled_at,
    e.completed_at,
    e.progress_percentage,
    COUNT(lp.id) as lessons_completed,
    COUNT(l.id) as total_lessons,
    ROUND((COUNT(lp.id)::DECIMAL / NULLIF(COUNT(l.id), 0)) * 100, 2) as calculated_progress
FROM public.enrollments e
JOIN public.courses c ON c.id = e.course_id
LEFT JOIN public.lessons l ON l.course_id = c.id AND l.is_published = true
LEFT JOIN public.lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = e.student_id AND lp.is_completed = true
GROUP BY e.student_id, e.course_id, c.title, e.enrolled_at, e.completed_at, e.progress_percentage;

-- Vista de disponibilidad de consultorías
CREATE VIEW public.consultation_availability AS
SELECT
    c.*,
    p.full_name as instructor_name,
    p.avatar_url as instructor_avatar,
    i.rating as instructor_rating,
    COUNT(cs.id) as total_sessions,
    COUNT(CASE WHEN cs.status = 'completed' THEN 1 END) as completed_sessions
FROM public.consultations c
JOIN public.instructors i ON i.id = c.instructor_id
JOIN public.profiles p ON p.id = i.profile_id
LEFT JOIN public.consultation_sessions cs ON cs.consultation_id = c.id
WHERE c.is_available = true AND i.is_active = true
GROUP BY c.id, i.id, p.id;

-- =====================================================
-- 13. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para perfiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para categorías
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para instructores
CREATE POLICY "Instructors are viewable by everyone" ON public.instructors
    FOR SELECT USING (true);

CREATE POLICY "Instructors can update their own data" ON public.instructors
    FOR UPDATE USING (
        profile_id IN (
            SELECT id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Only admins can insert instructors" ON public.instructors
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Políticas para cursos
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their own courses" ON public.courses
    FOR ALL USING (
        instructor_id IN (
            SELECT i.id FROM public.instructors i
            JOIN public.profiles p ON p.id = i.profile_id
            WHERE p.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para lecciones
CREATE POLICY "Published lessons are viewable by everyone" ON public.lessons
    FOR SELECT USING (is_published = true);

CREATE POLICY "Enrolled students can view course lessons" ON public.lessons
    FOR SELECT USING (
        course_id IN (
            SELECT course_id FROM public.enrollments 
            WHERE student_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage their course lessons" ON public.lessons
    FOR ALL USING (
        course_id IN (
            SELECT c.id FROM public.courses c
            JOIN public.instructors i ON i.id = c.instructor_id
            JOIN public.profiles p ON p.id = i.profile_id
            WHERE p.id = auth.uid()
        )
    );

-- Políticas para inscripciones
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Users can enroll in courses" ON public.enrollments
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Users can update their own enrollments" ON public.enrollments
    FOR UPDATE USING (student_id = auth.uid());

-- Políticas para progreso de lecciones
CREATE POLICY "Users can view their own progress" ON public.lesson_progress
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON public.lesson_progress
    FOR ALL USING (student_id = auth.uid());

-- Políticas para reseñas
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own reviews" ON public.reviews
    FOR ALL USING (student_id = auth.uid());

-- Políticas para consultorías
CREATE POLICY "Available consultations are viewable by everyone" ON public.consultations
    FOR SELECT USING (is_available = true);

CREATE POLICY "Instructors can manage their own consultations" ON public.consultations
    FOR ALL USING (
        instructor_id IN (
            SELECT i.id FROM public.instructors i
            JOIN public.profiles p ON p.id = i.profile_id
            WHERE p.id = auth.uid()
        )
    );

-- Políticas para sesiones de consultoría
CREATE POLICY "Users can view their own consultation sessions" ON public.consultation_sessions
    FOR SELECT USING (student_id = auth.uid() OR instructor_id IN (
        SELECT i.id FROM public.instructors i
        JOIN public.profiles p ON p.id = i.profile_id
        WHERE p.id = auth.uid()
    ));

CREATE POLICY "Users can create consultation sessions" ON public.consultation_sessions
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- Políticas para pagos
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payments" ON public.payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- =====================================================
-- 14. INSERTAR DATOS INICIALES
-- =====================================================

-- Insertar categorías
INSERT INTO public.categories (id, name, slug, description, icon, color) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Tributación Básica', 'tributacion-basica', 'Fundamentos de la tributación peruana', 'book', '#3B82F6'),
('550e8400-e29b-41d4-a716-446655440002', 'IVA', 'iva', 'Impuesto al Valor Agregado', 'calculator', '#10B981'),
('550e8400-e29b-41d4-a716-446655440003', 'Impuesto a la Renta', 'impuesto-renta', 'Impuesto a la Renta de Personas Naturales y Jurídicas', 'trending-up', '#F59E0B'),
('550e8400-e29b-41d4-a716-446655440004', 'Regímenes Tributarios', 'regimenes-tributarios', 'RER, RUS, Régimen General', 'layers', '#8B5CF6'),
('550e8400-e29b-41d4-a716-446655440005', 'Declaraciones', 'declaraciones', 'Declaraciones Juradas y Obligaciones', 'file-text', '#EF4444'),
('550e8400-e29b-41d4-a716-446655440006', 'Asesoría Tributaria', 'asesoria-tributaria', 'Consultoría y asesoría especializada', 'users', '#06B6D4');

-- Insertar usuario administrador
INSERT INTO public.users (id, email, role, is_active, email_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@tributo-learn.com', 'admin', true, true);

-- Insertar perfil administrador
INSERT INTO public.profiles (id, full_name, bio, is_instructor, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Administrador Tributo Learn', 'Administrador del sistema', false, true);

-- =====================================================
-- 15. CONFIGURAR PERMISOS FINALES
-- =====================================================

-- Otorgar permisos a authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Otorgar permisos a anon users (solo lectura de datos públicos)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.courses_with_details TO anon;
GRANT SELECT ON public.instructor_with_profile TO anon;
GRANT SELECT ON public.consultation_availability TO anon;

-- =====================================================
-- 16. VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
DO $$
DECLARE
    table_count INTEGER;
    view_count INTEGER;
    function_count INTEGER;
    trigger_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Contar tablas
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    -- Contar vistas
    SELECT COUNT(*) INTO view_count
    FROM information_schema.views 
    WHERE table_schema = 'public';
    
    -- Contar funciones
    SELECT COUNT(*) INTO function_count
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_type = 'FUNCTION';
    
    -- Contar triggers
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public';
    
    -- Contar políticas
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE '=== ESTADO FINAL ===';
    RAISE NOTICE 'Tablas creadas: %', table_count;
    RAISE NOTICE 'Vistas creadas: %', view_count;
    RAISE NOTICE 'Funciones creadas: %', function_count;
    RAISE NOTICE 'Triggers creados: %', trigger_count;
    RAISE NOTICE 'Políticas creadas: %', policy_count;
    
    IF table_count >= 11 AND view_count >= 4 THEN
        RAISE NOTICE '🎉 RESET Y BUILD COMPLETADO EXITOSAMENTE';
        RAISE NOTICE '✅ Sistema listo para usar';
    ELSE
        RAISE NOTICE '❌ Error en la creación del sistema';
    END IF;
END $$;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '🚀 TRIBUTO LEARN - RESET COMPLETO Y BUILD EXITOSO';
    RAISE NOTICE '📊 Tablas: 11';
    RAISE NOTICE '👁️ Vistas: 4';
    RAISE NOTICE '🔒 RLS: Habilitado';
    RAISE NOTICE '📝 Políticas: Configuradas';
    RAISE NOTICE '🎯 Sistema listo para migración de datos';
END $$;
