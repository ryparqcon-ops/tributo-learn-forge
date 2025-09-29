-- =====================================================
-- CREATE COURSES WITH EXISTING INSTRUCTORS - Crear cursos con instructores existentes
-- =====================================================

-- Primero, obtener el primer instructor disponible
WITH first_instructor AS (
    SELECT 
        i.id as instructor_id,
        p.full_name as instructor_name
    FROM public.instructors i
    JOIN public.profiles p ON i.profile_id = p.id
    LIMIT 1
),
first_category AS (
    SELECT id as category_id
    FROM public.categories
    LIMIT 1
)
-- Crear cursos usando los instructores y categorías existentes
INSERT INTO public.courses (
    id,
    title,
    slug,
    description,
    short_description,
    instructor_id,
    category_id,
    price,
    level,
    duration_hours,
    thumbnail_url,
    preview_video,
    is_published,
    is_featured,
    tags,
    learning_outcomes
)
SELECT 
    '550e8400-e29b-41d4-a716-446655440006',
    'Fundamentos Tributarios para Pymes',
    'fundamentos-tributarios-pymes',
    'Aprende los conceptos básicos de la tributación empresarial para pequeñas y medianas empresas',
    'Conceptos básicos de tributación para Pymes',
    fi.instructor_id,
    fc.category_id,
    299.99,
    'beginner',
    8,
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    true,
    true,
    ARRAY['tributación', 'pymes', 'básico'],
    ARRAY[
        'Comprender las obligaciones tributarias básicas',
        'Aprender a calcular impuestos principales',
        'Conocer los plazos y procedimientos'
    ]
FROM first_instructor fi, first_category fc;

-- Verificar que el curso se creó correctamente
SELECT 
    c.id as course_id,
    c.title as course_title,
    c.instructor_id,
    p.full_name as instructor_name
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
ORDER BY c.id;
