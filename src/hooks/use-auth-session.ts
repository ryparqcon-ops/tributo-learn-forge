import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'

export function useAuthSession() {
  const { checkSession, isAuthenticated, isLoading } = useAuthStore()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Solo verificar una vez al cargar la aplicación
    if (!hasChecked) {
      const verifySession = async () => {
        try {
          console.log('🔍 Verificando sesión...')
          await checkSession()
          console.log('✅ Sesión verificada correctamente')
        } catch (error) {
          console.error('❌ Error verificando sesión:', error)
        } finally {
          setHasChecked(true)
        }
      }
      
      verifySession()
    }
  }, [checkSession, hasChecked])

  return {
    isAuthenticated,
    isLoading: isLoading || !hasChecked
  }
}
