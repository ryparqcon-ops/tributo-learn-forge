// Script de debug para la migración
// Ejecutar en la consola del navegador en /test-supabase

import { supabase } from './src/lib/supabase'
import coursesData from './src/lib/data/courses.json'
import lessonsData from './src/lib/data/lessons.json'
import instructorsData from './src/lib/data/instructors.json'

// Función para verificar datos antes de migrar
async function checkDataBeforeMigration() {
  console.log('🔍 Verificando datos antes de la migración...')
  
  console.log('📊 Datos disponibles:')
  console.log('- Instructores:', instructorsData.length)
  console.log('- Cursos:', coursesData.length)
  console.log('- Lecciones:', lessonsData.length)
  
  // Verificar estructura de datos
  if (instructorsData.length > 0) {
    console.log('📋 Primer instructor:', instructorsData[0])
  }
  
  if (coursesData.length > 0) {
    console.log('📋 Primer curso:', coursesData[0])
  }
  
  if (lessonsData.length > 0) {
    console.log('📋 Primera lección:', lessonsData[0])
  }
}

// Función para verificar datos después de migrar
async function checkDataAfterMigration() {
  console.log('🔍 Verificando datos después de la migración...')
  
  // Verificar perfiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, email')
  
  console.log('👥 Perfiles:', profiles?.length || 0, profilesError ? `Error: ${profilesError.message}` : '')
  
  // Verificar instructores
  const { data: instructors, error: instructorsError } = await supabase
    .from('instructors')
    .select('id, title, profile_id')
  
  console.log('👨‍🏫 Instructores:', instructors?.length || 0, instructorsError ? `Error: ${instructorsError.message}` : '')
  
  // Verificar categorías
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name, slug')
  
  console.log('📚 Categorías:', categories?.length || 0, categoriesError ? `Error: ${categoriesError.message}` : '')
  
  // Verificar cursos
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, instructor_id, is_published')
  
  console.log('🎓 Cursos:', courses?.length || 0, coursesError ? `Error: ${coursesError.message}` : '')
  
  // Verificar lecciones
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, course_id, is_published')
  
  console.log('📖 Lecciones:', lessons?.length || 0, lessonsError ? `Error: ${lessonsError.message}` : '')
  
  // Verificar vista
  const { data: coursesWithDetails, error: viewError } = await supabase
    .from('courses_with_details')
    .select('id, title, instructor_name')
  
  console.log('🔍 Vista courses_with_details:', coursesWithDetails?.length || 0, viewError ? `Error: ${viewError.message}` : '')
}

// Función para limpiar datos existentes
async function clearExistingData() {
  console.log('🧹 Limpiando datos existentes...')
  
  try {
    // Eliminar en orden inverso para respetar las foreign keys
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('instructors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('✅ Datos limpiados correctamente')
  } catch (error) {
    console.error('❌ Error limpiando datos:', error)
  }
}

// Función para migrar un instructor específico
async function migrateSingleInstructor() {
  console.log('🔄 Migrando un instructor de prueba...')
  
  const instructor = instructorsData[0]
  if (!instructor) {
    console.log('❌ No hay instructores en los datos')
    return
  }
  
  try {
    // Crear perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: instructor.id,
        email: `instructor-${instructor.id}@tributo-learn.com`,
        full_name: instructor.name,
        avatar_url: instructor.avatar_url,
        bio: instructor.bio,
        experience_years: instructor.experience_years,
        specializations: instructor.specializations,
        social_links: instructor.social_links,
        is_instructor: true,
        is_verified: instructor.is_verified
      })
      .select()
      .single()
    
    if (profileError) {
      console.error('❌ Error creando perfil:', profileError)
      return
    }
    
    console.log('✅ Perfil creado:', profile)
    
    // Crear instructor
    const { data: instructorData, error: instructorError } = await supabase
      .from('instructors')
      .insert({
        profile_id: instructor.id,
        title: instructor.title,
        experience_years: instructor.experience_years,
        bio: instructor.bio,
        specializations: instructor.specializations,
        education: instructor.education,
        certifications: instructor.certifications,
        work_experience: instructor.work_experience,
        social_links: instructor.social_links,
        teaching_style: instructor.teaching_style,
        languages: instructor.languages,
        rating: instructor.rating,
        total_students: instructor.total_students,
        total_courses: instructor.total_courses,
        total_hours_taught: instructor.total_hours_taught,
        is_verified: instructor.is_verified,
        is_featured: instructor.is_featured
      })
      .select()
      .single()
    
    if (instructorError) {
      console.error('❌ Error creando instructor:', instructorError)
      return
    }
    
    console.log('✅ Instructor creado:', instructorData)
    
  } catch (error) {
    console.error('❌ Error en migración:', error)
  }
}

// Exportar funciones para usar en la consola
window.debugMigration = {
  checkDataBeforeMigration,
  checkDataAfterMigration,
  clearExistingData,
  migrateSingleInstructor
}

console.log('🔧 Funciones de debug disponibles:')
console.log('- debugMigration.checkDataBeforeMigration()')
console.log('- debugMigration.checkDataAfterMigration()')
console.log('- debugMigration.clearExistingData()')
console.log('- debugMigration.migrateSingleInstructor()')
