// Script para diagnosticar errores 400 - Acceso directo
// Copiar y pegar en la consola del navegador en /test-supabase

(function() {
  'use strict';
  
  // Función para obtener el cliente de Supabase desde el contexto de la aplicación
  function getSupabaseClient() {
    // Intentar diferentes formas de acceder al cliente
    if (window.__supabase) {
      return window.__supabase;
    }
    
    // Buscar en el contexto global de React
    if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      const internals = window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      // Buscar en el contexto de la aplicación
      for (const key in internals) {
        if (internals[key] && typeof internals[key] === 'object') {
          for (const subKey in internals[key]) {
            if (internals[key][subKey] && typeof internals[key][subKey] === 'object') {
              if (internals[key][subKey].supabase) {
                return internals[key][subKey].supabase;
              }
            }
          }
        }
      }
    }
    
    // Buscar en el DOM
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      if (script.textContent && script.textContent.includes('supabase')) {
        try {
          // Intentar extraer la URL y clave de Supabase
          const urlMatch = script.textContent.match(/VITE_SUPABASE_URL["']?\s*:\s*["']([^"']+)["']/);
          const keyMatch = script.textContent.match(/VITE_SUPABASE_ANON_KEY["']?\s*:\s*["']([^"']+)["']/);
          
          if (urlMatch && keyMatch) {
            const url = urlMatch[1];
            const key = keyMatch[1];
            
            // Crear cliente de Supabase
            if (window.supabase && window.supabase.createClient) {
              return window.supabase.createClient(url, key);
            }
          }
        } catch (e) {
          // Continuar buscando
        }
      }
    }
    
    return null;
  }
  
  // Obtener el cliente de Supabase
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    console.error('❌ No se pudo encontrar el cliente de Supabase');
    console.log('🔍 Intentando crear cliente manualmente...');
    
    // Intentar crear cliente manualmente con variables de entorno
    const url = 'https://uyvikdhczecwgrcihwjp.supabase.co';
    const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmlrZGhjemVjd2dyY2lod2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q';
    
    if (window.supabase && window.supabase.createClient) {
      const client = window.supabase.createClient(url, key);
      console.log('✅ Cliente de Supabase creado manualmente');
      runDiagnosis(client);
    } else {
      console.error('❌ No se pudo crear cliente de Supabase');
      console.log('💡 Intenta ejecutar este script desde la página /test-supabase donde ya está cargado el cliente');
    }
    return;
  }
  
  console.log('✅ Cliente de Supabase encontrado');
  runDiagnosis(supabase);
  
  // Función para probar inserción de categoría simple
  async function testSimpleCategory(supabase) {
    console.log('🧪 Probando inserción de categoría simple...');
    
    const simpleCategory = {
      name: 'Test Category',
      slug: 'test-category'
    };
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(simpleCategory)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error insertando categoría simple:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
        return false;
      }
      
      console.log('✅ Categoría simple insertada correctamente:', data);
      return true;
    } catch (err) {
      console.error('❌ Error en inserción de categoría simple:', err);
      return false;
    }
  }
  
  // Función para probar inserción de perfil simple
  async function testSimpleProfile(supabase) {
    console.log('🧪 Probando inserción de perfil simple...');
    
    const simpleProfile = {
      id: 'test-profile-456',
      email: 'test@example.com',
      full_name: 'Test User'
    };
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(simpleProfile)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error insertando perfil simple:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
        return false;
      }
      
      console.log('✅ Perfil simple insertado correctamente:', data);
      return true;
    } catch (err) {
      console.error('❌ Error en inserción de perfil simple:', err);
      return false;
    }
  }
  
  // Función para verificar estructura de tabla
  async function checkTableStructure(supabase, tableName) {
    console.log('🔍 Verificando estructura de tabla ' + tableName + '...');
    
    try {
      // Intentar obtener una fila para ver la estructura
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('❌ Error consultando tabla ' + tableName + ':', error);
        return;
      }
      
      console.log('✅ Estructura de tabla ' + tableName + ':', data);
    } catch (err) {
      console.error('❌ Error verificando tabla ' + tableName + ':', err);
    }
  }
  
  // Función para verificar permisos
  async function checkPermissions(supabase) {
    console.log('🔐 Verificando permisos...');
    
    const tables = ['categories', 'profiles', 'instructors', 'courses', 'lessons'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error('❌ Error consultando tabla ' + table + ':', error);
        } else {
          console.log('✅ Tabla ' + table + ' accesible, registros: ' + (data || 0));
        }
      } catch (err) {
        console.error('❌ Error verificando tabla ' + table + ':', err);
      }
    }
  }
  
  // Función para probar inserción con todos los campos requeridos
  async function testCategoryWithAllFields(supabase) {
    console.log('🧪 Probando inserción de categoría con todos los campos...');
    
    const fullCategory = {
      id: 'test-cat-full-123',
      name: 'Test Category Full',
      slug: 'test-category-full',
      description: 'Test description',
      icon: '📚',
      color: '#3B82F6',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(fullCategory)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Error insertando categoría completa:', error);
        console.error('Detalles del error:', JSON.stringify(error, null, 2));
        return false;
      }
      
      console.log('✅ Categoría completa insertada correctamente:', data);
      return true;
    } catch (err) {
      console.error('❌ Error en inserción de categoría completa:', err);
      return false;
    }
  }
  
  // Función para limpiar datos de prueba
  async function cleanup(supabase) {
    console.log('🧹 Limpiando datos de prueba...');
    
    try {
      await supabase.from('categories').delete().eq('id', 'test-cat-full-123');
      await supabase.from('profiles').delete().eq('id', 'test-profile-456');
      console.log('✅ Datos de prueba limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos de prueba:', error);
    }
  }
  
  // Función principal de diagnóstico
  async function runDiagnosis(supabase) {
    console.log('🚀 Iniciando diagnóstico de errores 400...');
    
    // 1. Verificar permisos
    await checkPermissions(supabase);
    
    // 2. Verificar estructura de tablas
    await checkTableStructure(supabase, 'categories');
    await checkTableStructure(supabase, 'profiles');
    
    // 3. Probar inserción simple
    const categorySuccess = await testSimpleCategory(supabase);
    const profileSuccess = await testSimpleProfile(supabase);
    
    // 4. Probar inserción completa
    const fullCategorySuccess = await testCategoryWithAllFields(supabase);
    
    // 5. Limpiar datos de prueba
    await cleanup(supabase);
    
    console.log('📊 Resumen del diagnóstico:');
    console.log('- Categoría simple: ' + (categorySuccess ? '✅' : '❌'));
    console.log('- Perfil simple: ' + (profileSuccess ? '✅' : '❌'));
    console.log('- Categoría completa: ' + (fullCategorySuccess ? '✅' : '❌'));
  }
  
  // Exportar funciones
  window.debug400 = {
    testSimpleCategory: (client) => testSimpleCategory(client),
    testSimpleProfile: (client) => testSimpleProfile(client),
    testCategoryWithAllFields: (client) => testCategoryWithAllFields(client),
    checkTableStructure: (client, table) => checkTableStructure(client, table),
    checkPermissions: (client) => checkPermissions(client),
    cleanup: (client) => cleanup(client),
    runDiagnosis: (client) => runDiagnosis(client)
  };
  
  console.log('🔧 Funciones de diagnóstico disponibles:');
  console.log('- debug400.runDiagnosis(supabase)');
  console.log('- debug400.testSimpleCategory(supabase)');
  console.log('- debug400.testSimpleProfile(supabase)');
  console.log('- debug400.testCategoryWithAllFields(supabase)');
  console.log('- debug400.checkPermissions(supabase)');
  console.log('- debug400.cleanup(supabase)');
  console.log('');
  console.log('🚀 Para empezar: debug400.runDiagnosis(supabase)');
  
})();
