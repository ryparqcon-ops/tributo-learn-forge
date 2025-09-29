-- =====================================================
-- TEST DE CONEXIÓN Y CARGA DE DATOS
-- =====================================================

-- PASO 1: Crear categorías
INSERT INTO public.categories (
    id,
    name,
    slug,
    description,
    icon,
    color,
    is_active
) VALUES 
('550e8400-e29b-41d4-a716-446655440001'::uuid, 'Tributación Básica', 'tributacion-basica', 'Fundamentos de la tributación empresarial', '📚', '#3B82F6', true),
('550e8400-e29b-41d4-a716-446655440002'::uuid, 'IVA', 'iva', 'Impuesto al Valor Agregado', '💰', '#10B981', true),
('550e8400-e29b-41d4-a716-446655440003'::uuid, 'Impuesto a la Renta', 'impuesto-renta', 'Impuesto a la Renta de Personas Naturales y Jurídicas', '📊', '#F59E0B', true);

-- Verificar categorías creadas
SELECT 'Categorías creadas:' as info, COUNT(*) as cantidad FROM public.categories;




































