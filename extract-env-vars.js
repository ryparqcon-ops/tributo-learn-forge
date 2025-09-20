// Script para extraer variables de entorno de Supabase
// Copiar y pegar en la consola del navegador en /test-supabase

function extractSupabaseEnvVars() {
  console.log('🔍 Extrayendo variables de entorno de Supabase...');
  
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
  
  // Si aún no se encuentran, buscar en el código compilado
  if (!url || !key) {
    console.log('🔍 Buscando en código compilado...');
    
    // Buscar en el HTML
    const html = document.documentElement.outerHTML;
    const urlMatch = html.match(/VITE_SUPABASE_URL["']?\s*:\s*["']([^"']+)["']/);
    const keyMatch = html.match(/VITE_SUPABASE_ANON_KEY["']?\s*:\s*["']([^"']+)["']/);
    
    if (urlMatch) url = urlMatch[1];
    if (keyMatch) key = keyMatch[1];
  }
  
  return { url, key };
}

// Función para probar la conexión con las variables extraídas
async function testSupabaseConnection() {
  const config = extractSupabaseEnvVars();
  
  if (!config.url || !config.key) {
    console.error('❌ No se pudieron encontrar las variables de entorno');
    console.log('💡 Asegúrate de estar en la página /test-supabase');
    console.log('💡 Verifica que la aplicación esté cargada completamente');
    return;
  }
  
  console.log('✅ Variables de entorno encontradas');
  console.log('🔗 URL:', config.url);
  console.log('🔑 Key:', config.key.substring(0, 20) + '...');
  
  // Probar conexión
  console.log('🧪 Probando conexión...');
  
  try {
    const response = await fetch(`${config.url}/rest/v1/categories?select=count`, {
      headers: {
        'apikey': config.key,
        'Authorization': `Bearer ${config.key}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexión exitosa');
      console.log('📊 Datos recibidos:', data);
    } else {
      const error = await response.json();
      console.log('❌ Error de conexión:', error);
      console.log('📊 Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error en conexión:', error);
  }
}

// Exportar funciones
window.extractSupabaseEnvVars = extractSupabaseEnvVars;
window.testSupabaseConnection = testSupabaseConnection;

console.log('🚀 Para ejecutar: testSupabaseConnection()');
