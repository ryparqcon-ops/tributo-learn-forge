// Script simple para obtener credenciales de Supabase
// Ejecutar en la consola del navegador en /test-supabase

function getSupabaseCredentials() {
  console.log('🔍 Obteniendo credenciales de Supabase...')
  
  // Buscar en el contexto de la aplicación
  const reactRoot = document.querySelector('#root')
  
  if (reactRoot && reactRoot._reactInternalFiber) {
    console.log('✅ Contexto de React encontrado')
    
    // Buscar en el contexto de la aplicación
    let current = reactRoot._reactInternalFiber
    while (current) {
      if (current.memoizedProps && current.memoizedProps.children) {
        const children = current.memoizedProps.children
        if (Array.isArray(children)) {
          for (const child of children) {
            if (child && child.props && child.props.children) {
              // Buscar el QueryClientProvider
              if (child.type && child.type.name === 'QueryClientProvider') {
                console.log('✅ QueryClientProvider encontrado')
                // Buscar el ThemeProvider
                const themeProvider = child.props.children
                if (themeProvider && themeProvider.props && themeProvider.props.children) {
                  // Buscar el TooltipProvider
                  const tooltipProvider = themeProvider.props.children
                  if (tooltipProvider && tooltipProvider.props && tooltipProvider.props.children) {
                    // Buscar el BrowserRouter
                    const browserRouter = tooltipProvider.props.children
                    if (browserRouter && browserRouter.props && browserRouter.props.children) {
                      // Buscar el AppLayout
                      const appLayout = browserRouter.props.children
                      if (appLayout && appLayout.props && appLayout.props.children) {
                        console.log('✅ AppLayout encontrado')
                        // Buscar el SupabaseTest
                        const routes = appLayout.props.children
                        if (routes && routes.props && routes.props.children) {
                          const routeChildren = routes.props.children
                          if (Array.isArray(routeChildren)) {
                            for (const route of routeChildren) {
                              if (route && route.props && route.props.element) {
                                const element = route.props.element
                                if (element && element.type && element.type.name === 'SupabaseTest') {
                                  console.log('✅ SupabaseTest encontrado')
                                  // Buscar el cliente de Supabase
                                  if (element.props && element.props.supabase) {
                                    console.log('✅ Cliente Supabase encontrado en props')
                                    return element.props.supabase
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      current = current.sibling || current.child
    }
  }
  
  // Si no encontramos el cliente, intentar obtener las credenciales de otra manera
  console.log('🔍 Buscando credenciales en variables de entorno...')
  
  // Buscar en el contexto global
  if (window.__VITE_SUPABASE_URL__) {
    console.log('✅ VITE_SUPABASE_URL encontrado:', window.__VITE_SUPABASE_URL__)
  }
  
  if (window.__VITE_SUPABASE_ANON_KEY__) {
    console.log('✅ VITE_SUPABASE_ANON_KEY encontrado:', window.__VITE_SUPABASE_ANON_KEY__)
  }
  
  // Buscar en el localStorage
  const storedUrl = localStorage.getItem('VITE_SUPABASE_URL')
  const storedKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY')
  
  if (storedUrl) {
    console.log('✅ VITE_SUPABASE_URL encontrado en localStorage:', storedUrl)
  }
  
  if (storedKey) {
    console.log('✅ VITE_SUPABASE_ANON_KEY encontrado en localStorage:', storedKey)
  }
  
  console.log('❌ No se pudieron obtener las credenciales automáticamente')
  console.log('💡 Por favor, proporciona las credenciales manualmente:')
  console.log('   - VITE_SUPABASE_URL')
  console.log('   - VITE_SUPABASE_ANON_KEY')
  
  return null
}

// Ejecutar
getSupabaseCredentials()
