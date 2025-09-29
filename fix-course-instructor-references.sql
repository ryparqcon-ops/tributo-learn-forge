-- =====================================================
-- FIX COURSE INSTRUCTOR REFERENCES - Corregir referencias de instructores
-- =====================================================

-- Verificar qué instructores existen
SELECT 
    i.id as instructor_id,
    p.full_name as instructor_name,
    i.title
FROM public.instructors i
JOIN public.profiles p ON i.profile_id = p.id
ORDER BY i.id;

-- Verificar qué cursos existen
SELECT 
    c.id as course_id,
    c.title as course_title,
    c.instructor_id
FROM public.courses c
ORDER BY c.id;

-- Si no hay cursos, crear algunos de prueba con los instructores correctos
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
) VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    'Fundamentos Tributarios para Pymes',
    'fundamentos-tributarios-pymes',
    'Aprende los conceptos básicos de la tributación empresarial para pequeñas y medianas empresas',
    'Conceptos básicos de tributación para Pymes',
    '550e8400-e29b-41d4-a716-446655440004', -- Dr. Carlos Mendoza
    '550e8400-e29b-41d4-a716-446655440001', -- Tributación Básica
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
), (
    '550e8400-e29b-41d4-a716-446655440007',
    'IVA Avanzado: Casos y Jurisprudencia',
    'iva-avanzado-casos-jurisprudencia',
    'Curso avanzado de IVA con casos prácticos y análisis de jurisprudencia',
    'IVA avanzado con casos prácticos',
    '550e8400-e29b-41d4-a716-446655440005', -- Dra. Andrea Vásquez
    '550e8400-e29b-41d4-a716-446655440002', -- IVA
    499.99,
    'advanced',
    12,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    true,
    true,
    ARRAY['iva', 'avanzado', 'jurisprudencia'],
    ARRAY[
        'Dominar casos complejos de IVA',
        'Analizar jurisprudencia relevante',
        'Aplicar criterios SUNAT'
    ]
);

-- Verificar que los cursos se crearon correctamente
SELECT 
    c.id as course_id,
    c.title as course_title,
    c.instructor_id,
    p.full_name as instructor_name
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
ORDER BY c.id;
