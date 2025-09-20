// Script de migración corregido
// Ejecutar en la consola del navegador en /test-supabase

import { supabase } from './src/lib/supabase'
import coursesData from './src/lib/data/courses.json'
import lessonsData from './src/lib/data/lessons.json'
import instructorsData from './src/lib/data/instructors.json'

// Función para migrar categorías con todos los campos requeridos
async function migrateCategoriesFixed() {
  console.log('🔄 Migrando categorías (versión corregida)...')
  
  const categories = [
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
    },
    {
      id: 'cat-3',
      name: 'Impuesto a la Renta',
      slug: 'impuesto-renta',
      description: 'Impuesto a la Renta de Personas Naturales',
      icon: '📊',
      color: '#F59E0B',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cat-4',
      name: 'Planillas',
      slug: 'planillas',
      description: 'Tributación laboral y planillas',
      icon: '👥',
      color: '#8B5CF6',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cat-5',
      name: 'Fiscalización',
      slug: 'fiscalizacion',
      description: 'Defensa en fiscalizaciones SUNAT',
      icon: '🔍',
      color: '#EF4444',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cat-6',
      name: 'Tributación Digital',
      slug: 'tributacion-digital',
      description: 'E-commerce y tributación digital',
      icon: '💻',
      color: '#06B6D4',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
  
  let successCount = 0
  let errorCount = 0
  
  for (const category of categories) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single()
      
      if (error) {
        console.error(`❌ Error creando categoría ${category.name}:`, error)
        errorCount++
      } else {
        console.log(`✅ Categoría ${category.name} creada correctamente`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error migrando categoría ${category.name}:`, error)
      errorCount++
    }
  }
  
  console.log(`✅ Migración de categorías completada - Exitosos: ${successCount}, Errores: ${errorCount}`)
  return { successCount, errorCount }
}

// Función para migrar instructores con todos los campos requeridos
async function migrateInstructorsFixed() {
  console.log('🔄 Migrando instructores (versión corregida)...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const instructor of instructorsData) {
    try {
      console.log(`🔄 Migrando instructor: ${instructor.name}`)
      
      // Crear perfil del instructor con todos los campos requeridos
      const profileData = {
        id: instructor.id,
        email: `instructor-${instructor.id}@tributo-learn.com`,
        full_name: instructor.name,
        avatar_url: instructor.avatar_url || null,
        bio: instructor.bio || null,
        phone: null,
        company: null,
        job_title: null,
        experience_years: instructor.experience_years || 0,
        specializations: instructor.specializations || [],
        social_links: instructor.social_links || {},
        preferences: {},
        is_instructor: true,
        is_verified: instructor.is_verified || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (profileError) {
        console.error(`❌ Error creando perfil para ${instructor.name}:`, profileError)
        errorCount++
        continue
      }

      console.log(`✅ Perfil creado para ${instructor.name}`)

      // Crear registro de instructor con todos los campos requeridos
      const instructorData = {
        profile_id: instructor.id,
        title: instructor.title || 'Instructor',
        experience_years: instructor.experience_years || 0,
        bio: instructor.bio || 'Instructor especializado',
        specializations: instructor.specializations || [],
        education: instructor.education || [],
        certifications: instructor.certifications || [],
        work_experience: instructor.work_experience || [],
        social_links: instructor.social_links || {},
        teaching_style: instructor.teaching_style || null,
        languages: instructor.languages || ['Español'],
        rating: instructor.rating || 0.0,
        total_students: instructor.total_students || 0,
        total_courses: instructor.total_courses || 0,
        total_hours_taught: instructor.total_hours_taught || 0,
        response_time_hours: instructor.response_time_hours || 24,
        is_verified: instructor.is_verified || false,
        is_featured: instructor.is_featured || false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: instructorResult, error: instructorError } = await supabase
        .from('instructors')
        .insert(instructorData)
        .select()
        .single()

      if (instructorError) {
        console.error(`❌ Error creando instructor ${instructor.name}:`, instructorError)
        errorCount++
      } else {
        console.log(`✅ Instructor ${instructor.name} migrado correctamente`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error migrando instructor ${instructor.name}:`, error)
      errorCount++
    }
  }
  
  console.log(`✅ Migración de instructores completada - Exitosos: ${successCount}, Errores: ${errorCount}`)
  return { successCount, errorCount }
}

// Función para migrar cursos con todos los campos requeridos
async function migrateCoursesFixed() {
  console.log('🔄 Migrando cursos (versión corregida)...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const course of coursesData) {
    try {
      console.log(`🔄 Migrando curso: ${course.title}`)
      
      const courseData = {
        id: course.id,
        instructor_id: course.instructor.id,
        category_id: 'cat-1', // Usar la primera categoría por defecto
        title: course.title,
        slug: course.slug || course.title.toLowerCase().replace(/\s+/g, '-'),
        summary: course.summary || course.description?.substring(0, 200) || '',
        description: course.description || '',
        thumbnail: course.thumbnail || null,
        preview_video: course.preview_video || null,
        price: course.price || 0,
        currency: course.currency || 'PEN',
        duration_minutes: course.duration_minutes || 0,
        level: course.level || 'beginner',
        language: course.language || 'es',
        tags: course.tags || [],
        is_published: course.is_published !== false,
        is_featured: course.is_featured || false,
        enrollment_count: course.enrollment_count || 0,
        rating: course.rating || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single()
      
      if (error) {
        console.error(`❌ Error creando curso ${course.title}:`, error)
        errorCount++
      } else {
        console.log(`✅ Curso ${course.title} migrado correctamente`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error migrando curso ${course.title}:`, error)
      errorCount++
    }
  }
  
  console.log(`✅ Migración de cursos completada - Exitosos: ${successCount}, Errores: ${errorCount}`)
  return { successCount, errorCount }
}

// Función para migrar lecciones con todos los campos requeridos
async function migrateLessonsFixed() {
  console.log('🔄 Migrando lecciones (versión corregida)...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const lesson of lessonsData) {
    try {
      console.log(`🔄 Migrando lección: ${lesson.title}`)
      
      const lessonData = {
        id: lesson.id,
        course_id: lesson.courseId,
        title: lesson.title,
        description: lesson.description || '',
        duration_minutes: lesson.duration_minutes || 0,
        video_url: lesson.video_url || null,
        thumbnail: lesson.thumbnail || null,
        transcript: lesson.transcript || null,
        objectives: lesson.objectives || [],
        resources: lesson.resources || [],
        order_index: lesson.order || 0,
        is_published: lesson.is_published !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single()
      
      if (error) {
        console.error(`❌ Error creando lección ${lesson.title}:`, error)
        errorCount++
      } else {
        console.log(`✅ Lección ${lesson.title} migrada correctamente`)
        successCount++
      }
    } catch (error) {
      console.error(`❌ Error migrando lección ${lesson.title}:`, error)
      errorCount++
    }
  }
  
  console.log(`✅ Migración de lecciones completada - Exitosos: ${successCount}, Errores: ${errorCount}`)
  return { successCount, errorCount }
}

// Función para ejecutar migración completa corregida
async function runFixedMigration() {
  console.log('🚀 Iniciando migración completa corregida...')
  
  try {
    // 1. Migrar categorías
    const categoriesResult = await migrateCategoriesFixed()
    
    // 2. Migrar instructores
    const instructorsResult = await migrateInstructorsFixed()
    
    // 3. Migrar cursos
    const coursesResult = await migrateCoursesFixed()
    
    // 4. Migrar lecciones
    const lessonsResult = await migrateLessonsFixed()
    
    console.log('🎉 ¡Migración completada exitosamente!')
    console.log(`📊 Resumen:`)
    console.log(`- Categorías: ${categoriesResult.successCount} exitosos, ${categoriesResult.errorCount} errores`)
    console.log(`- Instructores: ${instructorsResult.successCount} exitosos, ${instructorsResult.errorCount} errores`)
    console.log(`- Cursos: ${coursesResult.successCount} exitosos, ${coursesResult.errorCount} errores`)
    console.log(`- Lecciones: ${lessonsResult.successCount} exitosos, ${lessonsResult.errorCount} errores`)
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
  }
}

// Exportar funciones para usar en la consola
window.fixedMigration = {
  migrateCategoriesFixed,
  migrateInstructorsFixed,
  migrateCoursesFixed,
  migrateLessonsFixed,
  runFixedMigration
}

console.log('🔧 Funciones de migración corregida disponibles:')
console.log('- fixedMigration.runFixedMigration()')
console.log('- fixedMigration.migrateCategoriesFixed()')
console.log('- fixedMigration.migrateInstructorsFixed()')
console.log('- fixedMigration.migrateCoursesFixed()')
console.log('- fixedMigration.migrateLessonsFixed()')
