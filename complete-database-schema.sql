-- Esquema completo y robusto para Tributo Learn
-- Ejecutar en Supabase SQL Editor

-- 1. Limpiar todo primero
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- 2. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Tabla de usuarios (auth.users de Supabase)
-- Esta tabla ya existe en Supabase, solo creamos la estructura de perfiles

-- 4. Tabla de perfiles (extiende auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    country TEXT,
    city TEXT,
    timezone TEXT DEFAULT 'America/Lima',
    
    -- Roles del sistema
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'staff')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_instructor BOOLEAN DEFAULT false,
    
    -- Configuraciones
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5. Tabla de instructores (extiende profiles)
CREATE TABLE public.instructors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Información profesional
    title TEXT NOT NULL, -- "Dr.", "CPC", "Ing.", etc.
    professional_title TEXT, -- Título profesional completo
    bio TEXT,
    specializations TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    
    -- Educación y certificaciones
    education JSONB DEFAULT '[]', -- [{"degree": "Bachiller", "institution": "UNI", "year": 2020}]
    certifications JSONB DEFAULT '[]', -- [{"name": "CPA", "institution": "CPCC", "year": 2021}]
    work_experience JSONB DEFAULT '[]', -- [{"company": "EY", "position": "Senior", "years": 5}]
    
    -- Enseñanza
    teaching_style TEXT,
    languages TEXT[] DEFAULT '{"es"}',
    available_for_consultation BOOLEAN DEFAULT true,
    consultation_rate DECIMAL(10,2), -- Tarifa por hora de consultoría
    response_time_hours INTEGER DEFAULT 24,
    
    -- Métricas
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    total_hours_taught INTEGER DEFAULT 0,
    total_consultations INTEGER DEFAULT 0,
    
    -- Estado
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    verification_documents JSONB DEFAULT '[]',
    
    -- Redes sociales
    social_links JSONB DEFAULT '{}', -- {"linkedin": "...", "twitter": "...", "website": "..."}
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- 6. Tabla de categorías
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de cursos
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    
    -- Relaciones
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    -- Contenido
    thumbnail_url TEXT,
    preview_video_url TEXT,
    intro_video_url TEXT,
    
    -- Precios
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    original_price DECIMAL(10,2),
    currency TEXT DEFAULT 'PEN',
    
    -- Metadatos del curso
    level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    language TEXT DEFAULT 'es',
    duration_hours INTEGER DEFAULT 0,
    estimated_completion_days INTEGER,
    
    -- Estado y configuración
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Tags y categorización
    tags TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    learning_objectives TEXT[] DEFAULT '{}',
    
    -- Métricas
    total_lessons INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    
    -- Fechas
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla de lecciones
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    
    -- Contenido
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- Contenido en markdown
    video_url TEXT,
    audio_url TEXT,
    document_url TEXT,
    external_url TEXT,
    
    -- Metadatos
    duration_minutes INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    is_preview BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT false,
    
    -- Recursos adicionales
    attachments JSONB DEFAULT '[]', -- [{"name": "PDF", "url": "...", "type": "document"}]
    resources JSONB DEFAULT '[]', -- [{"title": "Artículo", "url": "...", "type": "external"}]
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabla de inscripciones
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    
    -- Estado de la inscripción
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    enrollment_type TEXT DEFAULT 'paid' CHECK (enrollment_type IN ('free', 'paid', 'trial')),
    
    -- Precios y pagos
    amount_paid DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'PEN',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id TEXT,
    
    -- Progreso
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    completed_lessons INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadatos
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint único
    UNIQUE(user_id, course_id)
);

-- 10. Tabla de progreso de lecciones
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Estado del progreso
    is_completed BOOLEAN DEFAULT false,
    is_started BOOLEAN DEFAULT false,
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    time_spent_minutes INTEGER DEFAULT 0,
    
    -- Notas y marcadores
    notes TEXT,
    bookmarks JSONB DEFAULT '[]', -- [{"timestamp": 120, "note": "Punto importante"}]
    
    -- Metadatos
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint único
    UNIQUE(enrollment_id, lesson_id)
);

-- 11. Tabla de reseñas
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    
    -- Contenido de la reseña
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    
    -- Estado
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint único
    UNIQUE(user_id, course_id)
);

-- 12. Tabla de asesorías
CREATE TABLE public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE NOT NULL,
    
    -- Detalles de la asesoría
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT, -- "tributacion", "contabilidad", "laboral", etc.
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
    
    -- Estado
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
    
    -- Precios
    rate_per_hour DECIMAL(10,2),
    estimated_duration_hours DECIMAL(4,2),
    total_amount DECIMAL(10,2),
    currency TEXT DEFAULT 'PEN',
    
    -- Programación
    scheduled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    
    -- Comunicación
    meeting_url TEXT,
    meeting_notes TEXT,
    attachments JSONB DEFAULT '[]',
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Tabla de notificaciones
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Contenido
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'course', 'consultation', 'payment')),
    
    -- Estado
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    
    -- Datos adicionales
    data JSONB DEFAULT '{}', -- Datos específicos del tipo de notificación
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- 14. Tabla de configuraciones del sistema
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Índices para optimización
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_instructors_profile_id ON public.instructors(profile_id);
CREATE INDEX idx_instructors_verified ON public.instructors(is_verified);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX idx_lesson_progress_enrollment ON public.lesson_progress(enrollment_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
CREATE INDEX idx_reviews_course ON public.reviews(course_id);
CREATE INDEX idx_consultations_student ON public.consultations(student_id);
CREATE INDEX idx_consultations_instructor ON public.consultations(instructor_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- 16. Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers a todas las tablas
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 17. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 18. Políticas RLS básicas
-- Perfiles: usuarios pueden ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Instructores: todos pueden ver instructores activos
CREATE POLICY "Anyone can view active instructors" ON public.instructors FOR SELECT USING (is_active = true);
CREATE POLICY "Instructors can manage own data" ON public.instructors FOR ALL USING (auth.uid() = profile_id);

-- Categorías: todos pueden ver categorías activas
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);

-- Cursos: todos pueden ver cursos publicados
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Instructors can manage own courses" ON public.courses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.instructors WHERE profile_id = auth.uid() AND id = instructor_id)
);

-- Lecciones: todos pueden ver lecciones de cursos publicados
CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND is_published = true)
);

-- Inscripciones: usuarios pueden ver sus propias inscripciones
CREATE POLICY "Users can view own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progreso de lecciones: usuarios pueden ver su propio progreso
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

-- Reseñas: todos pueden ver reseñas públicas
CREATE POLICY "Anyone can view public reviews" ON public.reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Asesorías: usuarios pueden ver sus propias asesorías
CREATE POLICY "Users can view own consultations" ON public.consultations FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Instructors can view assigned consultations" ON public.consultations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.instructors WHERE profile_id = auth.uid() AND id = instructor_id)
);

-- Notificaciones: usuarios pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Configuraciones del sistema: solo admins
CREATE POLICY "Admins can manage system settings" ON public.system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 19. Datos iniciales
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Tributación Básica', 'tributacion-basica', 'Fundamentos de la tributación empresarial', '📚', '#3B82F6'),
('IVA', 'iva', 'Impuesto al Valor Agregado', '💰', '#10B981'),
('Impuesto a la Renta', 'impuesto-renta', 'Impuesto a la Renta de Personas Naturales y Jurídicas', '📊', '#F59E0B'),
('Planillas', 'planillas', 'Planillas de pago y tributación laboral', '👥', '#EF4444'),
('Fiscalización', 'fiscalizacion', 'Defensa en fiscalizaciones SUNAT', '🛡️', '#8B5CF6'),
('Tributación Digital', 'tributacion-digital', 'E-commerce y tributación digital', '💻', '#06B6D4');

-- Configuraciones del sistema
INSERT INTO public.system_settings (key, value, description, is_public) VALUES
('site_name', '"Tributo Learn"', 'Nombre del sitio web', true),
('site_description', '"Plataforma de educación tributaria"', 'Descripción del sitio', true),
('default_currency', '"PEN"', 'Moneda por defecto', true),
('consultation_rates', '{"min": 50, "max": 500, "default": 150}', 'Tarifas de consultoría', false),
('email_settings', '{"from": "noreply@tributolearn.com", "support": "support@tributolearn.com"}', 'Configuración de emails', false);

COMMIT;
