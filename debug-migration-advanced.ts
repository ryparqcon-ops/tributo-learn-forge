// Script avanzado de debug para la migración
// Ejecutar en la consola del navegador en /test-supabase

import { supabase } from './src/lib/supabase'
import coursesData from './src/lib/data/courses.json'
import lessonsData from './src/lib/data/lessons.json'
import instructorsData from './src/lib/data/instructors.json'

// Función para probar la inserción de un perfil
async function testProfileInsert() {
  console.log('🧪 Probando inserción de perfil...')
  
  const testProfile = {
    id: 'test-profile-id-123',
    email: 'test@tributo-learn.com',
    full_name: 'Test Instructor',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    experience_years: 5,
    specializations: ['Test'],
    social_links: {},
    is_instructor: true,
    is_verified: false
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error insertando perfil:', error)
      return false
    }
    
    console.log('✅ Perfil insertado correctamente:', data)
    return true
  } catch (err) {
    console.error('❌ Error en inserción de perfil:', err)
    return false
  }
}

// Función para probar la inserción de un instructor
async function testInstructorInsert() {
  console.log('🧪 Probando inserción de instructor...')
  
  const testInstructor = {
    profile_id: 'test-profile-id-123',
    title: 'Test Instructor Title',
    experience_years: 5,
    bio: 'Test bio',
    specializations: ['Test'],
    education: [],
    certifications: [],
    work_experience: [],
    social_links: {},
    teaching_style: 'Test style',
    languages: ['Español'],
    rating: 4.5,
    total_students: 100,
    total_courses: 5,
    total_hours_taught: 200,
    is_verified: false,
    is_featured: false
  }
  
  try {
    const { data, error } = await supabase
      .from('instructors')
      .insert(testInstructor)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error insertando instructor:', error)
      return false
    }
    
    console.log('✅ Instructor insertado correctamente:', data)
    return true
  } catch (err) {
    console.error('❌ Error en inserción de instructor:', err)
    return false
  }
}

// Función para probar la inserción de un curso
async function testCourseInsert() {
  console.log('🧪 Probando inserción de curso...')
  
  const testCourse = {
    id: 'test-course-id-123',
    instructor_id: 'test-instructor-id-123',
    category_id: 'test-category-id-123',
    title: 'Test Course',
    slug: 'test-course',
    summary: 'Test summary',
    description: 'Test description',
    thumbnail: 'https://example.com/thumbnail.jpg',
    preview_video: 'https://example.com/preview.mp4',
    price: 99.99,
    currency: 'PEN',
    duration_minutes: 120,
    level: 'beginner',
    language: 'es',
    tags: ['test'],
    is_published: true,
    is_featured: false,
    enrollment_count: 0,
    rating: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert(testCourse)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error insertando curso:', error)
      return false
    }
    
    console.log('✅ Curso insertado correctamente:', data)
    return true
  } catch (err) {
    console.error('❌ Error en inserción de curso:', err)
    return false
  }
}

// Función para limpiar datos de prueba
async function cleanupTestData() {
  console.log('🧹 Limpiando datos de prueba...')
  
  try {
    await supabase.from('courses').delete().eq('id', 'test-course-id-123')
    await supabase.from('instructors').delete().eq('profile_id', 'test-profile-id-123')
    await supabase.from('profiles').delete().eq('id', 'test-profile-id-123')
    
    console.log('✅ Datos de prueba limpiados')
  } catch (error) {
    console.error('❌ Error limpiando datos de prueba:', error)
  }
}

// Función para verificar permisos
async function checkPermissions() {
  console.log('🔐 Verificando permisos...')
  
  try {
    // Verificar si podemos leer las tablas
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    console.log('📖 Lectura de profiles:', profilesError ? `Error: ${profilesError.message}` : '✅ OK')
    
    const { data: instructors, error: instructorsError } = await supabase
      .from('instructors')
      .select('id')
      .limit(1)
    
    console.log('📖 Lectura de instructors:', instructorsError ? `Error: ${instructorsError.message}` : '✅ OK')
    
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)
    
    console.log('📖 Lectura de courses:', coursesError ? `Error: ${coursesError.message}` : '✅ OK')
    
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .limit(1)
    
    console.log('📖 Lectura de lessons:', lessonsError ? `Error: ${lessonsError.message}` : '✅ OK')
    
  } catch (error) {
    console.error('❌ Error verificando permisos:', error)
  }
}

// Función para probar la migración paso a paso
async function testMigrationStepByStep() {
  console.log('🚀 Iniciando prueba de migración paso a paso...')
  
  // 1. Verificar permisos
  await checkPermissions()
  
  // 2. Probar inserción de perfil
  const profileSuccess = await testProfileInsert()
  if (!profileSuccess) {
    console.log('❌ Falló la inserción de perfil, deteniendo prueba')
    return
  }
  
  // 3. Probar inserción de instructor
  const instructorSuccess = await testInstructorInsert()
  if (!instructorSuccess) {
    console.log('❌ Falló la inserción de instructor, deteniendo prueba')
    await cleanupTestData()
    return
  }
  
  // 4. Probar inserción de curso
  const courseSuccess = await testCourseInsert()
  if (!courseSuccess) {
    console.log('❌ Falló la inserción de curso, deteniendo prueba')
    await cleanupTestData()
    return
  }
  
  // 5. Limpiar datos de prueba
  await cleanupTestData()
  
  console.log('✅ Todas las pruebas pasaron correctamente')
}

// Exportar funciones para usar en la consola
window.debugMigrationAdvanced = {
  testProfileInsert,
  testInstructorInsert,
  testCourseInsert,
  cleanupTestData,
  checkPermissions,
  testMigrationStepByStep
}

console.log('🔧 Funciones avanzadas de debug disponibles:')
console.log('- debugMigrationAdvanced.testProfileInsert()')
console.log('- debugMigrationAdvanced.testInstructorInsert()')
console.log('- debugMigrationAdvanced.testCourseInsert()')
console.log('- debugMigrationAdvanced.checkPermissions()')
console.log('- debugMigrationAdvanced.testMigrationStepByStep()')
console.log('- debugMigrationAdvanced.cleanupTestData()')
