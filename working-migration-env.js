// Script funcional que lee las variables de entorno correctas
// Copiar y pegar en la consola del navegador en /test-supabase

// Función para extraer las variables de entorno reales
function getSupabaseConfig() {
  console.log('🔍 Extrayendo configuración de Supabase desde .env.local...');
  
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

// Función para hacer peticiones a Supabase
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

// Datos de prueba
const categoriesData = [
  {
    id: 'cat-1',
    name: 'Tributación Básica',
    slug: 'tributacion-basica',
    description: 'Fundamentos de la tributación empresarial',
    icon: '📚',
    color: '#3B82F6',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'cat-2',
    name: 'IVA',
    slug: 'iva',
    description: 'Impuesto al Valor Agregado',
    icon: '💰',
    color: '#10B981',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const instructorsData = [
  {
    id: 'inst-1',
    name: 'Dr. Carlos Mendoza',
    title: 'Especialista en Tributación',
    bio: 'Experto en tributación empresarial con más de 15 años de experiencia',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    experience_years: 15,
    specializations: ['Tributación Empresarial', 'Planillas'],
    social_links: {
      linkedin: 'https://linkedin.com/in/carlos-mendoza',
      twitter: 'https://twitter.com/carlos_mendoza'
    },
    is_verified: true,
    rating: 4.8,
    total_students: 1200,
    total_courses: 8,
    total_hours_taught: 240,
    response_time_hours: 2,
    is_featured: true
  }
];

const coursesData = [
  {
    id: 'course-1',
    title: 'Fundamentos Tributarios para Pymes',
    slug: 'fundamentos-tributarios-pymes',
    description: 'Aprende los conceptos básicos de la tributación empresarial',
    short_description: 'Conceptos básicos de tributación',
    instructor_id: 'inst-1',
    category_id: 'cat-1',
    price: 299.99,
    original_price: 399.99,
    currency: 'PEN',
    level: 'beginner',
    duration_hours: 8,
    language: 'es',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    preview_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    is_published: true,
    is_featured: true,
    tags: ['tributación', 'pymes', 'básico'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const lessonsData = [
  {
    id: 'lesson-1',
    course_id: 'course-1',
    title: 'Introducción a las obligaciones tributarias',
    slug: 'introduccion-obligaciones-tributarias',
    description: 'Conceptos básicos de las obligaciones tributarias',
    content: 'En esta lección aprenderás...',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    duration_minutes: 45,
    order_index: 1,
    is_published: true,
    is_preview: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Función para migrar categorías
async function migrateCategories(url, key) {
  console.log('🔄 Migrando categorías...');
  
  for (const category of categoriesData) {
    const result = await supabaseRequest(url, key, 'categories', 'POST', category);
    
    if (result.ok) {
      console.log(`✅ Categoría migrada: ${category.name}`);
    } else {
      console.log(`❌ Error migrando categoría ${category.name}:`, result.error);
    }
  }
}

// Función para migrar instructores
async function migrateInstructors(url, key) {
  console.log('🔄 Migrando instructores...');
  
  for (const instructor of instructorsData) {
    // Crear perfil
    const profile = {
      id: instructor.id,
      email: `instructor-${instructor.id}@tributo-learn.com`,
      full_name: instructor.name,
      avatar_url: instructor.avatar_url,
      bio: instructor.bio,
      experience_years: instructor.experience_years,
      specializations: instructor.specializations,
      social_links: instructor.social_links,
      is_instructor: true,
      is_verified: instructor.is_verified,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const profileResult = await supabaseRequest(url, key, 'profiles', 'POST', profile);
    
    if (profileResult.ok) {
      console.log(`✅ Perfil creado: ${instructor.name}`);
      
      // Crear instructor
      const instructorData = {
        profile_id: instructor.id,
        title: instructor.title,
        experience_years: instructor.experience_years,
        bio: instructor.bio,
        specializations: instructor.specializations,
        social_links: instructor.social_links,
        rating: instructor.rating,
        total_students: instructor.total_students,
        total_courses: instructor.total_courses,
        total_hours_taught: instructor.total_hours_taught,
        response_time_hours: instructor.response_time_hours,
        is_verified: instructor.is_verified,
        is_featured: instructor.is_featured,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const instructorResult = await supabaseRequest(url, key, 'instructors', 'POST', instructorData);
      
      if (instructorResult.ok) {
        console.log(`✅ Instructor migrado: ${instructor.name}`);
      } else {
        console.log(`❌ Error migrando instructor ${instructor.name}:`, instructorResult.error);
      }
    } else {
      console.log(`❌ Error creando perfil ${instructor.name}:`, profileResult.error);
    }
  }
}

// Función para migrar cursos
async function migrateCourses(url, key) {
  console.log('🔄 Migrando cursos...');
  
  for (const course of coursesData) {
    const result = await supabaseRequest(url, key, 'courses', 'POST', course);
    
    if (result.ok) {
      console.log(`✅ Curso migrado: ${course.title}`);
    } else {
      console.log(`❌ Error migrando curso ${course.title}:`, result.error);
    }
  }
}

// Función para migrar lecciones
async function migrateLessons(url, key) {
  console.log('🔄 Migrando lecciones...');
  
  for (const lesson of lessonsData) {
    const result = await supabaseRequest(url, key, 'lessons', 'POST', lesson);
    
    if (result.ok) {
      console.log(`✅ Lección migrada: ${lesson.title}`);
    } else {
      console.log(`❌ Error migrando lección ${lesson.title}:`, result.error);
    }
  }
}

// Función para verificar migración
async function verifyMigration(url, key) {
  console.log('🔍 Verificando migración...');
  
  const categoriesResult = await supabaseRequest(url, key, 'categories?select=count', 'GET');
  const instructorsResult = await supabaseRequest(url, key, 'instructors?select=count', 'GET');
  const coursesResult = await supabaseRequest(url, key, 'courses?select=count', 'GET');
  const lessonsResult = await supabaseRequest(url, key, 'lessons?select=count', 'GET');
  
  console.log(`📊 Categorías: ${categoriesResult.data || 0}`);
  console.log(`👨‍🏫 Instructores: ${instructorsResult.data || 0}`);
  console.log(`📚 Cursos: ${coursesResult.data || 0}`);
  console.log(`🎥 Lecciones: ${lessonsResult.data || 0}`);
}

// Función principal
async function runMigrationWithEnv() {
  console.log('🚀 Iniciando migración con variables de entorno...');
  
  // Obtener configuración
  const config = getSupabaseConfig();
  
  if (!config.url || !config.key) {
    console.error('❌ No se pudieron encontrar las variables de entorno');
    console.log('💡 Asegúrate de estar en la página /test-supabase');
    console.log('💡 Verifica que el archivo .env.local esté configurado correctamente');
    return;
  }
  
  console.log('✅ Configuración encontrada');
  console.log('🔗 URL:', config.url);
  console.log('🔑 Key:', config.key.substring(0, 20) + '...');
  
  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await supabaseRequest(config.url, config.key, 'categories?id=in.(cat-1,cat-2)', 'DELETE');
    await supabaseRequest(config.url, config.key, 'profiles?id=in.(inst-1)', 'DELETE');
    await supabaseRequest(config.url, config.key, 'instructors?profile_id=in.(inst-1)', 'DELETE');
    await supabaseRequest(config.url, config.key, 'courses?id=in.(course-1)', 'DELETE');
    await supabaseRequest(config.url, config.key, 'lessons?id=in.(lesson-1)', 'DELETE');
    
    // Migrar datos
    await migrateCategories(config.url, config.key);
    await migrateInstructors(config.url, config.key);
    await migrateCourses(config.url, config.key);
    await migrateLessons(config.url, config.key);
    
    // Verificar migración
    await verifyMigration(config.url, config.key);
    
    console.log('🎉 ¡Migración completada!');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  }
}

// Exportar función
window.runMigrationWithEnv = runMigrationWithEnv;

console.log('🚀 Para ejecutar: runMigrationWithEnv()');
