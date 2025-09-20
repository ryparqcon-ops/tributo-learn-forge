// Script para diagnosticar con la clave correcta de Supabase
// Copiar y pegar en la consola del navegador en /test-supabase

// Función para extraer las variables de entorno correctas
function getSupabaseConfig() {
  console.log('🔍 Extrayendo configuración de Supabase...');
  
  // Buscar en el código fuente de la página
  const scripts = document.querySelectorAll('script');
  let url = null;
  let key = null;
  
  for (const script of scripts) {
    if (script.textContent) {
      // Buscar VITE_SUPABASE_URL
      const urlMatch = script.textContent.match(/VITE_SUPABASE_URL["']?\s*:\s*["']([^"']+)["']/);
      if (urlMatch) {
        url = urlMatch[1];
        console.log('✅ URL encontrada:', url);
      }
      
      // Buscar VITE_SUPABASE_ANON_KEY
      const keyMatch = script.textContent.match(/VITE_SUPABASE_ANON_KEY["']?\s*:\s*["']([^"']+)["']/);
      if (keyMatch) {
        key = keyMatch[1];
        console.log('✅ Key encontrada:', key.substring(0, 20) + '...');
      }
    }
  }
  
  // Si no se encuentran en scripts, buscar en el contexto global
  if (!url || !key) {
    console.log('🔍 Buscando en contexto global...');
    
    // Buscar en window
    if (window.import && window.import.meta && window.import.meta.env) {
      const env = window.import.meta.env;
      if (env.VITE_SUPABASE_URL) url = env.VITE_SUPABASE_URL;
      if (env.VITE_SUPABASE_ANON_KEY) key = env.VITE_SUPABASE_ANON_KEY;
    }
    
    // Buscar en process.env
    if (window.process && window.process.env) {
      const env = window.process.env;
      if (env.VITE_SUPABASE_URL) url = env.VITE_SUPABASE_URL;
      if (env.VITE_SUPABASE_ANON_KEY) key = env.VITE_SUPABASE_ANON_KEY;
    }
  }
  
  return { url, key };
}

// Función para hacer peticiones a la API REST de Supabase
async function supabaseRequest(url, key, endpoint, method = 'GET', data = null) {
  const fullUrl = `${url}/rest/v1/${endpoint}`;
  
  const options = {
    method,
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(fullUrl, options);
    const responseData = await response.json();
    
    return {
      data: responseData,
      error: response.ok ? null : responseData,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    return {
      data: null,
      error: error,
      status: 0,
      ok: false
    };
  }
}

// Función principal de diagnóstico
async function debugSupabaseWithCorrectKey() {
  console.log('🚀 Iniciando diagnóstico con clave correcta...');
  
  // 1. Obtener configuración
  const config = getSupabaseConfig();
  
  if (!config.url || !config.key) {
    console.error('❌ No se pudieron encontrar las variables de entorno');
    console.log('💡 Asegúrate de estar en la página /test-supabase');
    console.log('💡 Verifica que la aplicación esté cargada completamente');
    return;
  }
  
  console.log('✅ Configuración encontrada');
  console.log('🔗 URL:', config.url);
  console.log('🔑 Key:', config.key.substring(0, 20) + '...');
  
  // 2. Verificar conexión básica
  console.log('\n1️⃣ Verificando conexión básica...');
  const connectionTest = await supabaseRequest(config.url, config.key, 'categories?select=count');
  
  if (connectionTest.ok) {
    console.log('✅ Conexión exitosa');
    console.log('📊 Datos recibidos:', connectionTest.data);
  } else {
    console.log('❌ Error de conexión:', connectionTest.error);
    console.log('📊 Status:', connectionTest.status);
    return;
  }
  
  // 3. Verificar estructura de tabla categories
  console.log('\n2️⃣ Verificando estructura de tabla categories...');
  const structureTest = await supabaseRequest(config.url, config.key, 'categories?select=*&limit=1');
  
  if (structureTest.ok) {
    console.log('✅ Estructura de tabla accesible');
    console.log('📊 Estructura:', structureTest.data);
  } else {
    console.log('❌ Error accediendo a estructura:', structureTest.error);
  }
  
  // 4. Probar inserción simple de categoría
  console.log('\n3️⃣ Probando inserción simple de categoría...');
  const simpleCategory = {
    name: 'Test Category Correct Key',
    slug: 'test-category-correct-key'
  };
  
  const insertTest = await supabaseRequest(config.url, config.key, 'categories', 'POST', simpleCategory);
  
  if (insertTest.ok) {
    console.log('✅ Inserción simple exitosa');
    console.log('📊 Datos insertados:', insertTest.data);
  } else {
    console.log('❌ Error en inserción simple:', insertTest.error);
    console.log('📊 Status:', insertTest.status);
  }
  
  // 5. Probar inserción con todos los campos
  console.log('\n4️⃣ Probando inserción con todos los campos...');
  const fullCategory = {
    id: 'test-cat-correct-123',
    name: 'Test Category Full Correct Key',
    slug: 'test-category-full-correct-key',
    description: 'Test description',
    icon: '📚',
    color: '#3B82F6',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const fullInsertTest = await supabaseRequest(config.url, config.key, 'categories', 'POST', fullCategory);
  
  if (fullInsertTest.ok) {
    console.log('✅ Inserción completa exitosa');
    console.log('📊 Datos insertados:', fullInsertTest.data);
  } else {
    console.log('❌ Error en inserción completa:', fullInsertTest.error);
    console.log('📊 Status:', fullInsertTest.status);
  }
  
  // 6. Probar inserción de perfil
  console.log('\n5️⃣ Probando inserción de perfil...');
  const simpleProfile = {
    id: 'test-profile-correct-456',
    email: 'test-correct@example.com',
    full_name: 'Test User Correct Key'
  };
  
  const profileTest = await supabaseRequest(config.url, config.key, 'profiles', 'POST', simpleProfile);
  
  if (profileTest.ok) {
    console.log('✅ Inserción de perfil exitosa');
    console.log('📊 Datos insertados:', profileTest.data);
  } else {
    console.log('❌ Error en inserción de perfil:', profileTest.error);
    console.log('📊 Status:', profileTest.status);
  }
  
  // 7. Limpiar datos de prueba
  console.log('\n6️⃣ Limpiando datos de prueba...');
  
  try {
    await supabaseRequest(config.url, config.key, 'categories?id=eq.test-cat-correct-123', 'DELETE');
    await supabaseRequest(config.url, config.key, 'profiles?id=eq.test-profile-correct-456', 'DELETE');
    console.log('✅ Datos de prueba limpiados');
  } catch (error) {
    console.log('⚠️ Error limpiando datos de prueba:', error);
  }
  
  // 8. Resumen final
  console.log('\n📊 Resumen del diagnóstico:');
  console.log('- Conexión básica: ' + (connectionTest.ok ? '✅' : '❌'));
  console.log('- Estructura de tabla: ' + (structureTest.ok ? '✅' : '❌'));
  console.log('- Inserción simple: ' + (insertTest.ok ? '✅' : '❌'));
  console.log('- Inserción completa: ' + (fullInsertTest.ok ? '✅' : '❌'));
  console.log('- Inserción de perfil: ' + (profileTest.ok ? '✅' : '❌'));
  
  // 9. Recomendaciones
  console.log('\n💡 Recomendaciones:');
  if (!connectionTest.ok) {
    console.log('- Verificar URL y clave de Supabase');
  }
  if (!insertTest.ok) {
    console.log('- Verificar permisos de inserción en la tabla categories');
  }
  if (!profileTest.ok) {
    console.log('- Verificar permisos de inserción en la tabla profiles');
  }
  if (insertTest.ok && profileTest.ok) {
    console.log('- ✅ La API REST funciona correctamente');
    console.log('- El problema puede estar en la librería JavaScript de Supabase');
  }
}

// Exportar función
window.debugSupabaseWithCorrectKey = debugSupabaseWithCorrectKey;

console.log('🚀 Para ejecutar: debugSupabaseWithCorrectKey()');
