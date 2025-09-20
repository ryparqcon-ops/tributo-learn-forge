// Script funcional para migrar datos a Supabase
// Copiar y pegar en la consola del navegador en /test-supabase

// Configuración de Supabase (usa las credenciales correctas)
const SUPABASE_URL = 'https://uyvikdhczecwgrcihwjp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5dmlrZGhjemVjd2dyY2lod2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q';

// Función para hacer peticiones a Supabase
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
async function migrateCategories() {
  console.log('🔄 Migrando categorías...');
  
  for (const category of categoriesData) {
    const result = await supabaseRequest('categories', 'POST', category);
    
    if (result.ok) {
      console.log(`✅ Categoría migrada: ${category.name}`);
    } else {
      console.log(`❌ Error migrando categoría ${category.name}:`, result.error);
    }
  }
}

// Función para migrar instructores
async function migrateInstructors() {
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
    
    const profileResult = await supabaseRequest('profiles', 'POST', profile);
    
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
      
      const instructorResult = await supabaseRequest('instructors', 'POST', instructorData);
      
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
async function migrateCourses() {
  console.log('🔄 Migrando cursos...');
  
  for (const course of coursesData) {
    const result = await supabaseRequest('courses', 'POST', course);
    
    if (result.ok) {
      console.log(`✅ Curso migrado: ${course.title}`);
    } else {
      console.log(`❌ Error migrando curso ${course.title}:`, result.error);
    }
  }
}

// Función para migrar lecciones
async function migrateLessons() {
  console.log('🔄 Migrando lecciones...');
  
  for (const lesson of lessonsData) {
    const result = await supabaseRequest('lessons', 'POST', lesson);
    
    if (result.ok) {
      console.log(`✅ Lección migrada: ${lesson.title}`);
    } else {
      console.log(`❌ Error migrando lección ${lesson.title}:`, result.error);
    }
  }
}

// Función para verificar migración
async function verifyMigration() {
  console.log('🔍 Verificando migración...');
  
  const categoriesResult = await supabaseRequest('categories?select=count', 'GET');
  const instructorsResult = await supabaseRequest('instructors?select=count', 'GET');
  const coursesResult = await supabaseRequest('courses?select=count', 'GET');
  const lessonsResult = await supabaseRequest('lessons?select=count', 'GET');
  
  console.log(`📊 Categorías: ${categoriesResult.data || 0}`);
  console.log(`👨‍🏫 Instructores: ${instructorsResult.data || 0}`);
  console.log(`📚 Cursos: ${coursesResult.data || 0}`);
  console.log(`🎥 Lecciones: ${lessonsResult.data || 0}`);
}

// Función principal
async function runMigration() {
  console.log('🚀 Iniciando migración funcional...');
  
  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await supabaseRequest('categories?id=in.(cat-1,cat-2)', 'DELETE');
    await supabaseRequest('profiles?id=in.(inst-1)', 'DELETE');
    await supabaseRequest('instructors?profile_id=in.(inst-1)', 'DELETE');
    await supabaseRequest('courses?id=in.(course-1)', 'DELETE');
    await supabaseRequest('lessons?id=in.(lesson-1)', 'DELETE');
    
    // Migrar datos
    await migrateCategories();
    await migrateInstructors();
    await migrateCourses();
    await migrateLessons();
    
    // Verificar migración
    await verifyMigration();
    
    console.log('🎉 ¡Migración completada!');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  }
}

// Exportar función
window.runMigration = runMigration;

console.log('🚀 Para ejecutar: runMigration()');
