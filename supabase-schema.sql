-- =============================================
-- TRIBUTO LEARN FORGE - SCHEMA DE BASE DE DATOS
-- =============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- TABLA DE USUARIOS (Extiende auth.users)
-- =============================================
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

-- =============================================
-- TABLA DE INSTRUCTORES
-- =============================================
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

-- =============================================
-- TABLA DE CATEGORÍAS
-- =============================================
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

-- =============================================
-- TABLA DE CURSOS
-- =============================================
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

-- =============================================
-- TABLA DE LECCIONES
-- =============================================
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

-- =============================================
-- TABLA DE INSCRIPCIONES
-- =============================================
CREATE TABLE public.enrollments (
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

-- =============================================
-- TABLA DE PROGRESO DE LECCIONES
-- =============================================
CREATE TABLE public.lesson_progress (
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

-- =============================================
-- TABLA DE RESEÑAS
-- =============================================
CREATE TABLE public.reviews (
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

-- =============================================
-- TABLA DE CUPONES
-- =============================================
CREATE TABLE public.coupons (
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

-- =============================================
-- TABLA DE PAGOS
-- =============================================
CREATE TABLE public.payments (
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

-- =============================================
-- TABLA DE ASESORÍAS
-- =============================================
CREATE TABLE public.advisory_bookings (
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