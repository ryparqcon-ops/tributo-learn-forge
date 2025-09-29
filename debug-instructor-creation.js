// Script de diagnóstico para crear instructor
// Ejecutar en la consola del navegador en /test-supabase

async function debugInstructorCreation() {
  console.log('🔍 Iniciando diagnóstico de creación de instructor...')
  
  try {
    // 1. Obtener el cliente de Supabase desde la aplicación
    console.log('1️⃣ Obteniendo cliente de Supabase...')
    
    // Buscar el cliente de Supabase en el contexto de la aplicación
    let supabase = null
    
    // Intentar desde window.supabase
    if (window.supabase) {
      supabase = window.supabase
      console.log('✅ Cliente Supabase encontrado en window.supabase')
    }
    // Intentar desde el contexto de React
    else if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('🔍 Buscando cliente en contexto de React...')
      
      // Buscar en el contexto de la aplicación
      const reactRoot = document.querySelector('#root')
      if (reactRoot && reactRoot._reactInternalFiber) {
        console.log('✅ Contexto de React encontrado')
        
        // Buscar el QueryClientProvider y navegar hacia el SupabaseTest
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
                                      // Buscar el cliente de Supabase en las props
                                      if (element.props && element.props.supabase) {
                                        console.log('✅ Cliente Supabase encontrado en props')
                                        supabase = element.props.supabase
                                        break
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
    }
    
    // Si no encontramos el cliente, crear uno manualmente con las credenciales correctas
    if (!supabase) {
      console.log('🔧 Creando cliente Supabase manualmente...')
      
      // Usar las credenciales correctas de tu proyecto
      const supabaseUrl = 'https://uyvikdhczecwgrcihwjp.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmlrZGhjemVjd2dyY2lod2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4NzQsImV4cCI6MjA1MDU1MDg3NH0.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'
      
      // Importar dinámicamente Supabase
      const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2')
      
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      })
      
      console.log('✅ Cliente Supabase creado manualmente')
    }
    
    // 2. Crear usuario
    console.log('2️⃣ Creando usuario...')
    const user = {
      id: '550e8400-e29b-41d4-a716-446655440004',
      email: 'instructor-test@tributo-learn.com',
      role: 'instructor',
      is_active: true,
      email_verified: true
    }
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()
    
    if (userError) {
      console.error('❌ Error creando usuario:', userError)
      return
    }
    
    console.log('✅ Usuario creado:', userData)
    
    // 3. Crear perfil
    console.log('3️⃣ Creando perfil...')
    const profile = {
      id: '550e8400-e29b-41d4-a716-446655440004',
      full_name: 'Dr. Carlos Mendoza Test',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Experto en tributación empresarial',
      is_instructor: true,
      is_verified: true
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError)
      return
    }
    
    console.log('✅ Perfil creado:', profileData)
    
    // 4. Crear instructor
    console.log('4️⃣ Creando instructor...')
    const instructorData = {
      profile_id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Especialista en Tributación',
      bio: 'Experto en tributación empresarial con más de 15 años de experiencia',
      specializations: ['Tributación Empresarial', 'Planillas'],
      experience_years: 15,
      social_links: {
        linkedin: 'https://linkedin.com/in/carlos-mendoza',
        twitter: 'https://twitter.com/carlos_mendoza'
      },
      rating: 4.8,
      total_students: 1200,
      total_courses: 8,
      total_hours_taught: 240,
      response_time_hours: 2,
      is_verified: true,
      is_featured: true,
      is_active: true
    }
    
    const { data: instructorDataResult, error: instructorError } = await supabase
      .from('instructors')
      .insert(instructorData)
      .select()
      .single()
    
    if (instructorError) {
      console.error('❌ Error creando instructor:', instructorError)
      return
    }
    
    console.log('✅ Instructor creado:', instructorDataResult)
    console.log('🎉 ¡Diagnóstico completado exitosamente!')
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar diagnóstico
debugInstructorCreation()