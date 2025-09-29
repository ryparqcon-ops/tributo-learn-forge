-- =====================================================
-- CREATE COURSES AND LESSONS COMPLETE - Crear cursos y lecciones completas
-- =====================================================

-- Primero, verificar que tenemos instructores
WITH instructor_check AS (
    SELECT 
        i.id as instructor_id,
        p.full_name as instructor_name,
        ROW_NUMBER() OVER (ORDER BY i.id) as instructor_number
    FROM public.instructors i
    JOIN public.profiles p ON i.profile_id = p.id
    ORDER BY i.id
)
-- Crear cursos usando los instructores existentes
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
    ic.instructor_id,
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
FROM instructor_check ic
WHERE ic.instructor_number = 1
UNION ALL
SELECT 
    '550e8400-e29b-41d4-a716-446655440007',
    'IVA Avanzado: Casos y Jurisprudencia',
    'iva-avanzado-casos-jurisprudencia',
    'Curso avanzado de IVA con casos prácticos y análisis de jurisprudencia',
    'IVA avanzado con casos prácticos',
    ic.instructor_id,
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
FROM instructor_check ic
WHERE ic.instructor_number = 2;

-- Ahora crear lecciones para los cursos
INSERT INTO public.lessons (
    id,
    course_id,
    title,
    description,
    video_url,
    duration_minutes,
    order_index,
    is_published,
    is_preview
) VALUES 
-- Lecciones para Fundamentos Tributarios para Pymes
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', 'Introducción a las obligaciones tributarias', 'Conceptos básicos de las obligaciones tributarias para empresas', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 45, 1, true, true),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440006', 'Registro contable y comprobantes', 'Cómo registrar correctamente las operaciones tributarias', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 60, 2, true, false),

-- Lecciones para IVA Avanzado: Casos y Jurisprudencia
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440007', 'Conceptos avanzados de IVA', 'Análisis profundo de casos complejos de IVA', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 90, 1, true, true),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440007', 'Jurisprudencia y criterios SUNAT', 'Análisis de jurisprudencia relevante y criterios de SUNAT', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 75, 2, true, false);

-- Verificar el resultado final
SELECT 
    'Categorías' as tipo, COUNT(*) as cantidad FROM public.categories
UNION ALL
SELECT 
    'Instructores' as tipo, COUNT(*) as cantidad FROM public.instructors
UNION ALL
SELECT 
    'Cursos' as tipo, COUNT(*) as cantidad FROM public.courses
UNION ALL
SELECT 
    'Lecciones' as tipo, COUNT(*) as cantidad FROM public.lessons;

-- Verificar la relación completa
SELECT 
    c.id as course_id,
    c.title as course_title,
    p.full_name as instructor_name,
    cat.name as category_name,
    COUNT(l.id) as lesson_count
FROM public.courses c
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
LEFT JOIN public.categories cat ON c.category_id = cat.id
LEFT JOIN public.lessons l ON c.id = l.course_id
GROUP BY c.id, c.title, p.full_name, cat.name
ORDER BY c.id;
