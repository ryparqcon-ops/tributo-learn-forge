-- =====================================================
-- TRIBUTO LEARN - LIMPIEZA COMPLETA Y REBUILD
-- =====================================================
-- Este script limpia completamente la base de datos y
-- reconstruye toda la estructura desde cero

-- =====================================================
-- 1. DESHABILITAR RLS TEMPORALMENTE
-- =====================================================

-- Deshabilitar RLS en todas las tablas existentes
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

-- Eliminar tablas en orden de dependencias
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
-- 8. VERIFICAR LIMPIEZA
-- =====================================================

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
    
    RAISE NOTICE '=== ESTADO DESPUÉS DE LIMPIEZA ===';
    RAISE NOTICE 'Tablas restantes: %', table_count;
    RAISE NOTICE 'Vistas restantes: %', view_count;
    RAISE NOTICE 'Funciones restantes: %', function_count;
    RAISE NOTICE 'Triggers restantes: %', trigger_count;
    RAISE NOTICE 'Políticas restantes: %', policy_count;
    
    IF table_count = 0 AND view_count = 0 AND function_count = 0 AND trigger_count = 0 AND policy_count = 0 THEN
        RAISE NOTICE '✅ LIMPIEZA COMPLETA EXITOSA';
    ELSE
        RAISE NOTICE '⚠️ ALGUNOS ELEMENTOS PERSISTEN - CONTINUANDO...';
    END IF;
END $$;

-- =====================================================
-- 9. MENSAJE FINAL
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '🧹 LIMPIEZA COMPLETADA';
    RAISE NOTICE '📋 Ahora ejecuta: complete-clean-schema.sql';
    RAISE NOTICE '🚀 Sistema listo para rebuild completo';
END $$;
