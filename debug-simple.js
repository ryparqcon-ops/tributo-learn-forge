// Script simple para diagnosticar errores 400
// Copiar y pegar en la consola del navegador en /test-supabase

// Función para obtener el cliente de Supabase
function getSupabase() {
  // Buscar en el contexto global
  if (window.__supabase) return window.__supabase;
  
  // Buscar en el contexto de React
  if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    const internals = window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    // Buscar recursivamente
    function findSupabase(obj, depth = 0) {
      if (depth > 5) return null;
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            if (obj[key].supabase) return obj[key].supabase;
            const found = findSupabase(obj[key], depth + 1);
            if (found) return found;
          }
        }
      }
      return null;
    }
    return findSupabase(internals);
  }
  
  return null;
}

// Función para crear cliente manualmente
function createSupabaseClient() {
  const url = 'https://uyvikdhczecwgrcihwjp.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmlrZGhjemVjd2dyY2lod2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q';
  
  if (window.supabase && window.supabase.createClient) {
    return window.supabase.createClient(url, key);
  }
  
  return null;
}

// Función principal
async function debugSupabase() {
  console.log('🔍 Buscando cliente de Supabase...');
  
  let supabase = getSupabase();
  
  if (!supabase) {
    console.log('⚠️ Cliente no encontrado, creando manualmente...');
    supabase = createSupabaseClient();
  }
  
  if (!supabase) {
    console.error('❌ No se pudo obtener cliente de Supabase');
    console.log('💡 Asegúrate de estar en la página /test-supabase');
    return;
  }
  
  console.log('✅ Cliente de Supabase encontrado');
  
  // Probar inserción simple de categoría
  console.log('🧪 Probando inserción de categoría simple...');
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: 'Test Category',
        slug: 'test-category'
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error insertando categoría:', error);
      console.error('Detalles:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Categoría insertada correctamente:', data);
    }
  } catch (err) {
    console.error('❌ Error en inserción:', err);
  }
  
  // Verificar estructura de tabla
  console.log('🔍 Verificando estructura de tabla categories...');
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error consultando tabla:', error);
    } else {
      console.log('✅ Estructura de tabla:', data);
    }
  } catch (err) {
    console.error('❌ Error verificando tabla:', err);
  }
  
  // Verificar permisos
  console.log('🔐 Verificando permisos...');
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error verificando permisos:', error);
    } else {
      console.log('✅ Permisos OK, registros:', data);
    }
  } catch (err) {
    console.error('❌ Error verificando permisos:', err);
  }
}

// Exportar función
window.debugSupabase = debugSupabase;

console.log('🚀 Para ejecutar: debugSupabase()');
