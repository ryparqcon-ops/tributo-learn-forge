// Script para diagnosticar errores 400 usando API REST directa
// Copiar y pegar en la consola del navegador en /test-supabase

// Configuración de Supabase
const SUPABASE_URL = 'https://uyvikdhczecwgrcihwjp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmlrZGhjemVjd2dyY2lod2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q';

// Función para hacer peticiones a la API REST de Supabase
async function supabaseRequest(endpoint, method = 'GET', data = null) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const options = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
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
async function debugSupabaseRest() {
  console.log('🚀 Iniciando diagnóstico con API REST directa...');
  console.log('🔗 URL:', SUPABASE_URL);
  console.log('🔑 Key:', SUPABASE_KEY.substring(0, 20) + '...');
  
  // 1. Verificar conexión básica
  console.log('\n1️⃣ Verificando conexión básica...');
  const connectionTest = await supabaseRequest('categories?select=count');
  
  if (connectionTest.ok) {
    console.log('✅ Conexión exitosa');
    console.log('📊 Datos recibidos:', connectionTest.data);
  } else {
    console.log('❌ Error de conexión:', connectionTest.error);
    console.log('📊 Status:', connectionTest.status);
    return;
  }
  
  // 2. Verificar estructura de tabla categories
  console.log('\n2️⃣ Verificando estructura de tabla categories...');
  const structureTest = await supabaseRequest('categories?select=*&limit=1');
  
  if (structureTest.ok) {
    console.log('✅ Estructura de tabla accesible');
    console.log('📊 Estructura:', structureTest.data);
  } else {
    console.log('❌ Error accediendo a estructura:', structureTest.error);
  }
  
  // 3. Probar inserción simple de categoría
  console.log('\n3️⃣ Probando inserción simple de categoría...');
  const simpleCategory = {
    name: 'Test Category REST',
    slug: 'test-category-rest'
  };
  
  const insertTest = await supabaseRequest('categories', 'POST', simpleCategory);
  
  if (insertTest.ok) {
    console.log('✅ Inserción simple exitosa');
    console.log('📊 Datos insertados:', insertTest.data);
  } else {
    console.log('❌ Error en inserción simple:', insertTest.error);
    console.log('📊 Status:', insertTest.status);
  }
  
  // 4. Probar inserción con todos los campos
  console.log('\n4️⃣ Probando inserción con todos los campos...');
  const fullCategory = {
    id: 'test-cat-rest-123',
    name: 'Test Category Full REST',
    slug: 'test-category-full-rest',
    description: 'Test description',
    icon: '📚',
    color: '#3B82F6',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const fullInsertTest = await supabaseRequest('categories', 'POST', fullCategory);
  
  if (fullInsertTest.ok) {
    console.log('✅ Inserción completa exitosa');
    console.log('📊 Datos insertados:', fullInsertTest.data);
  } else {
    console.log('❌ Error en inserción completa:', fullInsertTest.error);
    console.log('📊 Status:', fullInsertTest.status);
  }
  
  // 5. Probar inserción de perfil
  console.log('\n5️⃣ Probando inserción de perfil...');
  const simpleProfile = {
    id: 'test-profile-rest-456',
    email: 'test-rest@example.com',
    full_name: 'Test User REST'
  };
  
  const profileTest = await supabaseRequest('profiles', 'POST', simpleProfile);
  
  if (profileTest.ok) {
    console.log('✅ Inserción de perfil exitosa');
    console.log('📊 Datos insertados:', profileTest.data);
  } else {
    console.log('❌ Error en inserción de perfil:', profileTest.error);
    console.log('📊 Status:', profileTest.status);
  }
  
  // 6. Limpiar datos de prueba
  console.log('\n6️⃣ Limpiando datos de prueba...');
  
  try {
    await supabaseRequest('categories?id=eq.test-cat-rest-123', 'DELETE');
    await supabaseRequest('profiles?id=eq.test-profile-rest-456', 'DELETE');
    console.log('✅ Datos de prueba limpiados');
  } catch (error) {
    console.log('⚠️ Error limpiando datos de prueba:', error);
  }
  
  // 7. Resumen final
  console.log('\n📊 Resumen del diagnóstico:');
  console.log('- Conexión básica: ' + (connectionTest.ok ? '✅' : '❌'));
  console.log('- Estructura de tabla: ' + (structureTest.ok ? '✅' : '❌'));
  console.log('- Inserción simple: ' + (insertTest.ok ? '✅' : '❌'));
  console.log('- Inserción completa: ' + (fullInsertTest.ok ? '✅' : '❌'));
  console.log('- Inserción de perfil: ' + (profileTest.ok ? '✅' : '❌'));
  
  // 8. Recomendaciones
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
window.debugSupabaseRest = debugSupabaseRest;

console.log('🚀 Para ejecutar: debugSupabaseRest()');
