-- =====================================================
-- COMPLETE MIGRATION FROM SCRATCH - Migración completa desde cero
-- =====================================================

-- PASO 1: Crear usuarios instructores
INSERT INTO public.users (
    id,
    email,
    role,
    is_active,
    email_verified
) VALUES 
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'carlos.mendoza@tributo-learn.com', 'instructor', true, true),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'andrea.vasquez@tributo-learn.com', 'instructor', true, true);

-- PASO 2: Crear perfiles de instructores
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    bio,
    experience_years,
    specializations,
    social_links,
    is_instructor,
    is_verified
) VALUES 
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'carlos.mendoza@tributo-learn.com', 'Dr. Carlos Mendoza', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Experto en tributación empresarial con más de 15 años de experiencia', 15, ARRAY['Tributación Empresarial', 'Planillas'], '{"linkedin": "https://linkedin.com/in/carlos-mendoza", "twitter": "https://twitter.com/carlos_mendoza"}'::jsonb, true, true),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'andrea.vasquez@tributo-learn.com', 'Dra. Andrea Vásquez', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Contadora Pública Colegiada con amplia experiencia en contabilidad empresarial', 12, ARRAY['Contabilidad', 'Auditoría', 'NIIF'], '{"linkedin": "https://linkedin.com/in/andrea-vasquez", "website": "https://andrea-contadora.com"}'::jsonb, true, true);

-- PASO 3: Crear registros de instructores
INSERT INTO public.instructors (
    profile_id,
    title,
    experience_years,
    bio,
    specializations,
    education,
    certifications,
    work_experience,
    social_links,
    teaching_style,
    languages,
    rating,
    total_students,
    total_courses,
    total_hours_taught,
    response_time_hours,
    is_verified,
    is_featured,
    is_active
) VALUES 
('550e8400-e29b-41d4-a716-446655440004'::uuid, 'Especialista en Tributación', 15, 'Experto en tributación empresarial con más de 15 años de experiencia', ARRAY['Tributación Empresarial', 'Planillas'], ARRAY[],  ARRAY[], ARRAY[], '{"linkedin": "https://linkedin.com/in/carlos-mendoza", "twitter": "https://twitter.com/carlos_mendoza"}'::jsonb, null, ARRAY['Español'], 4.8, 1200, 8, 240, 2, true, true, true),
('550e8400-e29b-41d4-a716-446655440005'::uuid, 'CPC Especialista en Contabilidad', 12, 'Contadora Pública Colegiada con amplia experiencia en contabilidad empresarial', ARRAY['Contabilidad', 'Auditoría', 'NIIF'], ARRAY[], ARRAY[], ARRAY[], '{"linkedin": "https://linkedin.com/in/andrea-vasquez", "website": "https://andrea-contadora.com"}'::jsonb, null, ARRAY['Español'], 4.9, 800, 6, 180, 4, true, true, true);

-- PASO 4: Crear cursos
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
    i1.id,
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    299.99,
    'beginner',
    8,
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    true,
    true,
    ARRAY['tributación', 'pymes', 'básico'],
    ARRAY['Comprender las obligaciones tributarias básicas', 'Aprender a calcular impuestos principales', 'Conocer los plazos y procedimientos']
FROM (SELECT id FROM public.instructors WHERE profile_id = '550e8400-e29b-41d4-a716-446655440004'::uuid) i1

UNION ALL

SELECT 
    '550e8400-e29b-41d4-a716-446655440007'::uuid,
    'IVA Avanzado: Casos y Jurisprudencia',
    'iva-avanzado-casos-jurisprudencia',
    'Curso avanzado de IVA con casos prácticos y análisis de jurisprudencia',
    'IVA avanzado con casos prácticos',
    i2.id,
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    499.99,
    'advanced',
    12,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    true,
    true,
    ARRAY['iva', 'avanzado', 'jurisprudencia'],
    ARRAY['Dominar casos complejos de IVA', 'Analizar jurisprudencia relevante', 'Aplicar criterios SUNAT']
FROM (SELECT id FROM public.instructors WHERE profile_id = '550e8400-e29b-41d4-a716-446655440005'::uuid) i2;

-- PASO 5: Crear lecciones
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
('550e8400-e29b-41d4-a716-446655440008'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, 'Introducción a las obligaciones tributarias', 'Conceptos básicos de las obligaciones tributarias para empresas', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 45, 1, true, true),
('550e8400-e29b-41d4-a716-446655440009'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, 'Registro contable y comprobantes', 'Cómo registrar correctamente las operaciones tributarias', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 60, 2, true, false),
('550e8400-e29b-41d4-a716-446655440012'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, 'Cálculo de impuestos principales', 'Aprende a calcular IGV, Impuesto a la Renta y otros tributos', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 75, 3, true, false),

-- Lecciones para IVA Avanzado: Casos y Jurisprudencia
('550e8400-e29b-41d4-a716-446655440010'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid, 'Conceptos avanzados de IVA', 'Análisis profundo de casos complejos de IVA', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 90, 1, true, true),
('550e8400-e29b-41d4-a716-446655440011'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid, 'Jurisprudencia y criterios SUNAT', 'Análisis de jurisprudencia relevante y criterios de SUNAT', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 75, 2, true, false),
('550e8400-e29b-41d4-a716-446655440013'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid, 'Casos prácticos complejos', 'Resolución de casos reales de IVA en situaciones complejas', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 105, 3, true, false);

-- VERIFICACIÓN FINAL
SELECT 'RESUMEN FINAL' as info;

SELECT 
    'Categorías' as tipo, COUNT(*) as cantidad FROM public.categories
UNION ALL
SELECT 
    'Usuarios' as tipo, COUNT(*) as cantidad FROM public.users
UNION ALL
SELECT 
    'Perfiles' as tipo, COUNT(*) as cantidad FROM public.profiles
UNION ALL
SELECT 
    'Instructores' as tipo, COUNT(*) as cantidad FROM public.instructors
UNION ALL
SELECT 
    'Cursos' as tipo, COUNT(*) as cantidad FROM public.courses
UNION ALL
SELECT 
    'Lecciones' as tipo, COUNT(*) as cantidad FROM public.lessons;

-- Verificar relaciones
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
