-- =====================================================
-- FIX USERS POLICY V2 - Permitir INSERT sin autenticación para migración
-- =====================================================

-- Eliminar las políticas existentes de INSERT
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "System can insert users" ON public.users;

-- Crear nueva política que permita INSERT sin autenticación
-- (solo para migración y testing)
CREATE POLICY "Allow insert for migration" ON public.users
    FOR INSERT WITH CHECK (true);

-- También necesitamos permitir INSERT en profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Allow insert profiles for migration" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Y en instructors
CREATE POLICY "Allow insert instructors for migration" ON public.instructors
    FOR INSERT WITH CHECK (true);

-- Verificar que las políticas estén creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('users', 'profiles', 'instructors')
ORDER BY tablename, policyname;
