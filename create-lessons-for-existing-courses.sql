-- =====================================================
-- CREATE LESSONS FOR EXISTING COURSES - Crear lecciones para cursos existentes
-- =====================================================

-- Crear lecciones para el curso "Fundamentos Tributarios para Pymes"
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
) VALUES (
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440006', -- Fundamentos Tributarios para Pymes
    'Introducción a las obligaciones tributarias',
    'Conceptos básicos de las obligaciones tributarias para empresas',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    45,
    1,
    true,
    true
), (
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440006', -- Fundamentos Tributarios para Pymes
    'Registro contable y comprobantes',
    'Cómo registrar correctamente las operaciones tributarias',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    60,
    2,
    true,
    false
);

-- Crear lecciones para el curso "IVA Avanzado: Casos y Jurisprudencia"
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
) VALUES (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440007', -- IVA Avanzado: Casos y Jurisprudencia
    'Conceptos avanzados de IVA',
    'Análisis profundo de casos complejos de IVA',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    90,
    1,
    true,
    true
), (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440007', -- IVA Avanzado: Casos y Jurisprudencia
    'Jurisprudencia y criterios SUNAT',
    'Análisis de jurisprudencia relevante y criterios de SUNAT',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    75,
    2,
    true,
    false
);

-- Verificar que las lecciones se crearon correctamente
SELECT 
    l.id as lesson_id,
    l.title as lesson_title,
    l.course_id,
    c.title as course_title,
    p.full_name as instructor_name
FROM public.lessons l
LEFT JOIN public.courses c ON l.course_id = c.id
LEFT JOIN public.instructors i ON c.instructor_id = i.id
LEFT JOIN public.profiles p ON i.profile_id = p.id
ORDER BY l.course_id, l.order_index;
