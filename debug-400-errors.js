// Script para diagnosticar errores 400
// Copiar y pegar en la consola del navegador en /test-supabase

(function() {
  'use strict';
  
  // Obtener el cliente de Supabase
  const supabase = window.supabase || window.__supabase;
  
  if (!supabase) {
    console.error('❌ No se pudo encontrar el cliente de Supabase');
    return;
  }
  
  console.log('✅ Cliente de Supabase encontrado');
  
  // Función para probar inserción de categoría simple
  async function testSimpleCategory() {
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
  async function testSimpleProfile() {
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
  async function checkTableStructure(tableName) {
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
  async function checkPermissions() {
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
  async function testCategoryWithAllFields() {
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
  async function cleanup() {
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
  async function runDiagnosis() {
    console.log('🚀 Iniciando diagnóstico de errores 400...');
    
    // 1. Verificar permisos
    await checkPermissions();
    
    // 2. Verificar estructura de tablas
    await checkTableStructure('categories');
    await checkTableStructure('profiles');
    
    // 3. Probar inserción simple
    const categorySuccess = await testSimpleCategory();
    const profileSuccess = await testSimpleProfile();
    
    // 4. Probar inserción completa
    const fullCategorySuccess = await testCategoryWithAllFields();
    
    // 5. Limpiar datos de prueba
    await cleanup();
    
    console.log('📊 Resumen del diagnóstico:');
    console.log('- Categoría simple: ' + (categorySuccess ? '✅' : '❌'));
    console.log('- Perfil simple: ' + (profileSuccess ? '✅' : '❌'));
    console.log('- Categoría completa: ' + (fullCategorySuccess ? '✅' : '❌'));
  }
  
  // Exportar funciones
  window.debug400 = {
    testSimpleCategory,
    testSimpleProfile,
    testCategoryWithAllFields,
    checkTableStructure,
    checkPermissions,
    cleanup,
    runDiagnosis
  };
  
  console.log('🔧 Funciones de diagnóstico disponibles:');
  console.log('- debug400.runDiagnosis()');
  console.log('- debug400.testSimpleCategory()');
  console.log('- debug400.testSimpleProfile()');
  console.log('- debug400.testCategoryWithAllFields()');
  console.log('- debug400.checkPermissions()');
  console.log('- debug400.cleanup()');
  console.log('');
  console.log('🚀 Para empezar: debug400.runDiagnosis()');
  
})();
