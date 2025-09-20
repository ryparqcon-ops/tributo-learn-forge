// Script de migración simple para diagnosticar problemas
// Ejecutar en la consola del navegador en /test-supabase

import { supabase } from './src/lib/supabase'

// Función para probar inserción de un perfil simple
async function testSimpleProfileInsert() {
  console.log('🧪 Probando inserción de perfil simple...')
  
  const simpleProfile = {
    id: 'test-profile-123',
    email: 'test@example.com',
    full_name: 'Test User'
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(simpleProfile)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error insertando perfil simple:', error)
      console.error('Detalles del error:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Perfil simple insertado correctamente:', data)
    return true
  } catch (err) {
    console.error('❌ Error en inserción de perfil simple:', err)
    return false
  }
}

// Función para probar inserción de una categoría simple
async function testSimpleCategoryInsert() {
  console.log('🧪 Probando inserción de categoría simple...')
  
  const simpleCategory = {
    id: 'test-category-123',
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test description'
  }
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(simpleCategory)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error insertando categoría simple:', error)
      console.error('Detalles del error:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Categoría simple insertada correctamente:', data)
    return true
  } catch (err) {
    console.error('❌ Error en inserción de categoría simple:', err)
    return false
  }
}

// Función para probar inserción de un instructor simple
async function testSimpleInstructorInsert() {
  console.log('🧪 Probando inserción de instructor simple...')
  
  const simpleInstructor = {
    profile_id: 'test-profile-123',
    title: 'Test Instructor',
    experience_years: 5,
    bio: 'Test bio',
    specializations: ['Test']
  }
  
  try {
    const { data, error } = await supabase
      .from('instructors')
      .insert(simpleInstructor)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error insertando instructor simple:', error)
      console.error('Detalles del error:', JSON.stringify(error, null, 2))
      return false
    }
    
    console.log('✅ Instructor simple insertado correctamente:', data)
    return true
  } catch (err) {
    console.error('❌ Error en inserción de instructor simple:', err)
    return false
  }
}

// Función para limpiar datos de prueba
async function cleanupTestData() {
  console.log('🧹 Limpiando datos de prueba...')
  
  try {
    await supabase.from('instructors').delete().eq('profile_id', 'test-profile-123')
    await supabase.from('profiles').delete().eq('id', 'test-profile-123')
    await supabase.from('categories').delete().eq('id', 'test-category-123')
    
    console.log('✅ Datos de prueba limpiados')
  } catch (error) {
    console.error('❌ Error limpiando datos de prueba:', error)
  }
}

// Función para probar migración paso a paso
async function testMigrationStepByStep() {
  console.log('🚀 Iniciando prueba de migración paso a paso...')
  
  // 1. Probar inserción de categoría
  const categorySuccess = await testSimpleCategoryInsert()
  if (!categorySuccess) {
    console.log('❌ Falló la inserción de categoría, deteniendo prueba')
    return
  }
  
  // 2. Probar inserción de perfil
  const profileSuccess = await testSimpleProfileInsert()
  if (!profileSuccess) {
    console.log('❌ Falló la inserción de perfil, deteniendo prueba')
    await cleanupTestData()
    return
  }
  
  // 3. Probar inserción de instructor
  const instructorSuccess = await testSimpleInstructorInsert()
  if (!instructorSuccess) {
    console.log('❌ Falló la inserción de instructor, deteniendo prueba')
    await cleanupTestData()
    return
  }
  
  // 4. Limpiar datos de prueba
  await cleanupTestData()
  
  console.log('✅ Todas las pruebas pasaron correctamente')
}

// Exportar funciones para usar en la consola
window.testSimpleMigration = {
  testSimpleProfileInsert,
  testSimpleCategoryInsert,
  testSimpleInstructorInsert,
  cleanupTestData,
  testMigrationStepByStep
}

console.log('🔧 Funciones de prueba simple disponibles:')
console.log('- testSimpleMigration.testSimpleProfileInsert()')
console.log('- testSimpleMigration.testSimpleCategoryInsert()')
console.log('- testSimpleMigration.testSimpleInstructorInsert()')
console.log('- testSimpleMigration.testMigrationStepByStep()')
console.log('- testSimpleMigration.cleanupTestData()')
