-- =====================================================
-- FIX USERS POLICY - Agregar política de INSERT faltante
-- =====================================================

-- Agregar política de INSERT para usuarios
CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- También necesitamos permitir que el sistema pueda crear usuarios
-- (para migración y testing)
CREATE POLICY "System can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Verificar que las políticas estén creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;
