// Script para acceder al cliente de Supabase desde el contexto de React
// Copiar y pegar en la consola del navegador en /test-supabase

// Función para buscar el cliente de Supabase en el contexto de React
function findSupabaseInReact() {
  console.log('🔍 Buscando cliente de Supabase en el contexto de React...');
  
  // Buscar en el contexto global de React
  if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    const internals = window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    
    // Buscar recursivamente en el contexto
    function searchContext(obj, path = '', depth = 0) {
      if (depth > 10) return null;
      
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (obj[key] && typeof obj[key] === 'object') {
            // Buscar cliente de Supabase
            if (obj[key].supabase) {
              console.log('✅ Cliente de Supabase encontrado en:', currentPath);
              return obj[key].supabase;
            }
            
            // Buscar en propiedades anidadas
            const found = searchContext(obj[key], currentPath, depth + 1);
            if (found) return found;
          }
        }
      }
      
      return null;
    }
    
    return searchContext(internals);
  }
  
  return null;
}

// Función para buscar en el DOM
function findSupabaseInDOM() {
  console.log('🔍 Buscando cliente de Supabase en el DOM...');
  
  // Buscar en scripts
  const scripts = document.querySelectorAll('script');
  for (const script of scripts) {
    if (script.textContent && script.textContent.includes('supabase')) {
      console.log('📜 Script con Supabase encontrado');
      
      // Intentar extraer variables de entorno
      const urlMatch = script.textContent.match(/VITE_SUPABASE_URL["']?\s*:\s*["']([^"']+)["']/);
      const keyMatch = script.textContent.match(/VITE_SUPABASE_ANON_KEY["']?\s*:\s*["']([^"']+)["']/);
      
      if (urlMatch && keyMatch) {
        console.log('✅ Variables de entorno encontradas');
        return {
          url: urlMatch[1],
          key: keyMatch[1]
        };
      }
    }
  }
  
  return null;
}

// Función para buscar en el contexto global
function findSupabaseInGlobal() {
  console.log('🔍 Buscando cliente de Supabase en el contexto global...');
  
  // Buscar en diferentes ubicaciones posibles
  const possibleLocations = [
    'window.__supabase',
    'window.supabase',
    'window.__REACT_DEVTOOLS_GLOBAL_HOOK__',
    'window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers'
  ];
  
  for (const location of possibleLocations) {
    try {
      const obj = eval(location);
      if (obj && typeof obj === 'object') {
        if (obj.supabase) {
          console.log('✅ Cliente de Supabase encontrado en:', location);
          return obj.supabase;
        }
        
        // Buscar recursivamente
        function searchObject(obj, depth = 0) {
          if (depth > 5) return null;
          if (obj && typeof obj === 'object') {
            for (const key in obj) {
              if (obj[key] && typeof obj[key] === 'object') {
                if (obj[key].supabase) return obj[key].supabase;
                const found = searchObject(obj[key], depth + 1);
                if (found) return found;
              }
            }
          }
          return null;
        }
        
        const found = searchObject(obj);
        if (found) {
          console.log('✅ Cliente de Supabase encontrado en:', location);
          return found;
        }
      }
    } catch (e) {
      // Continuar buscando
    }
  }
  
  return null;
}

// Función principal
async function debugSupabaseContext() {
  console.log('🚀 Iniciando búsqueda del cliente de Supabase...');
  
  // 1. Buscar en React
  let supabase = findSupabaseInReact();
  
  // 2. Buscar en contexto global
  if (!supabase) {
    supabase = findSupabaseInGlobal();
  }
  
  // 3. Buscar en DOM
  if (!supabase) {
    const envVars = findSupabaseInDOM();
    if (envVars) {
      console.log('🔧 Creando cliente con variables de entorno...');
      if (window.supabase && window.supabase.createClient) {
        supabase = window.supabase.createClient(envVars.url, envVars.key);
      }
    }
  }
  
  if (!supabase) {
    console.error('❌ No se pudo encontrar el cliente de Supabase');
    console.log('💡 Asegúrate de estar en la página /test-supabase');
    console.log('💡 Verifica que la aplicación esté cargada completamente');
    return;
  }
  
  console.log('✅ Cliente de Supabase encontrado');
  
  // Probar inserción simple
  console.log('🧪 Probando inserción simple...');
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: 'Test Category Context',
        slug: 'test-category-context'
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
  
  // Verificar estructura
  console.log('🔍 Verificando estructura de tabla...');
  
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
}

// Exportar función
window.debugSupabaseContext = debugSupabaseContext;

console.log('🚀 Para ejecutar: debugSupabaseContext()');
