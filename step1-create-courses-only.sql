-- =====================================================
-- STEP 1: CREATE COURSES ONLY - Solo crear cursos
-- =====================================================

-- Primero, verificar que tenemos instructores disponibles
SELECT 
    i.id as instructor_id,
    p.full_name as instructor_name,
    ROW_NUMBER() OVER (ORDER BY i.id) as instructor_number
FROM public.instructors i
JOIN public.profiles p ON i.profile_id = p.id
ORDER BY i.id;

-- Crear el primer curso usando el primer instructor
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
    '550e8400-e29b-41d4-a716-446655440006'::uuid,
    'Fundamentos Tributarios para Pymes',
    'fundamentos-tributarios-pymes',
    'Aprende los conceptos básicos de la tributación empresarial para pequeñas y medianas empresas',
    'Conceptos básicos de tributación para Pymes',
    (SELECT i.id FROM public.instructors i LIMIT 1),
    '550e8400-e29b-41d4-a716-446655440001'::uuid, -- Tributación Básica
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
    ];

-- Verificar que el curso se creó
SELECT 
    c.id,
    c.title,
    c.instructor_id,
    p.full_name as instructor_name
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
WHERE c.id = '550e8400-e29b-41d4-a716-446655440006'::uuid;
