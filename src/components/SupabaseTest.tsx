import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useCourses } from '@/hooks/use-courses'
import { useInstructors } from '@/hooks/use-instructors'
import { useAllLessons } from '@/hooks/use-lessons'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { DataMigration } from '@/lib/migrations/migrate-to-supabase'
import { NewSchemaMigration } from '@/lib/migrations/migrate-to-new-schema'
import { ConnectionTest } from './ConnectionTest'
import { supabase } from '@/lib/supabase'
import coursesData from '@/lib/data/courses.json'
import lessonsData from '@/lib/data/lessons.json'
import instructorsData from '@/lib/data/instructors.json'

export function SupabaseTest() {
  const [migrationStatus, setMigrationStatus] = useState<string>('')
  const [isMigrating, setIsMigrating] = useState(false)
  
  // Hooks de prueba
  const { courses, loading: coursesLoading, error: coursesError } = useCourses()
  const { instructors, loading: instructorsLoading, error: instructorsError } = useInstructors()
  const { lessons, loading: lessonsLoading, error: lessonsError } = useAllLessons()
  const { enrollments, loading: enrollmentsLoading, error: enrollmentsError } = useUserEnrollments()

  // Función para limpiar datos existentes
  const cleanExistingData = async () => {
    console.log('🧹 Limpiando datos existentes...')
    
    try {
      // Limpiar en orden inverso para respetar las foreign keys
      // Usar delete sin filtros para limpiar todo
      await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('instructors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      console.log('✅ Datos existentes limpiados')
    } catch (error) {
      console.error('❌ Error limpiando datos:', error)
      throw error
    }
  }

  // Función para migrar categorías (versión limpia)
  const migrateCategoriesClean = async () => {
    console.log('🔄 Migrando categorías...')
    
    const categoriesData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
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
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'IVA',
        slug: 'iva',
        description: 'Impuesto al Valor Agregado',
        icon: '💰',
        color: '#10B981',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    for (const category of categoriesData) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert(category)
          .select()
          .single()
        
        if (error) {
          console.error(`❌ Error creando categoría ${category.name}:`, error)
        } else {
          console.log(`✅ Categoría creada: ${category.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creando categoría ${category.name}:`, error)
      }
    }
  }

  // Función para migrar instructores (versión limpia)
  const migrateInstructorsClean = async () => {
    console.log('🔄 Migrando instructores...')
    
    const instructorsData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
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
    ]
    
    for (const instructor of instructorsData) {
      try {
        // Crear usuario primero
        const user = {
          id: instructor.id,
          email: `instructor-${instructor.id}@tributo-learn.com`,
          email_confirmed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert(user)
          .select()
          .single()
        
        if (userError) {
          console.error(`❌ Error creando usuario ${instructor.name}:`, userError)
          continue
        }
        
        console.log(`✅ Usuario creado: ${instructor.name}`)
        
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
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert(profile)
          .select()
          .single()
        
        if (profileError) {
          console.error(`❌ Error creando perfil ${instructor.name}:`, profileError)
          continue
        }
        
        console.log(`✅ Perfil creado: ${instructor.name}`)
        
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
        }
        
        const { data: instructorDataResult, error: instructorError } = await supabase
          .from('instructors')
          .insert(instructorData)
          .select()
          .single()
        
        if (instructorError) {
          console.error(`❌ Error creando instructor ${instructor.name}:`, instructorError)
        } else {
          console.log(`✅ Instructor creado: ${instructor.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creando instructor ${instructor.name}:`, error)
      }
    }
  }

  // Función para migrar cursos (versión limpia)
  const migrateCoursesClean = async () => {
    console.log('🔄 Migrando cursos...')
    
    const coursesData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Fundamentos Tributarios para Pymes',
        slug: 'fundamentos-tributarios-pymes',
        description: 'Aprende los conceptos básicos de la tributación empresarial',
        short_description: 'Conceptos básicos de tributación',
        instructor_id: '550e8400-e29b-41d4-a716-446655440003',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        level: 'beginner',
        language: 'es',
        thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
        preview_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_published: true,
        is_featured: true,
        tags: ['tributación', 'pymes', 'básico'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    for (const course of coursesData) {
      try {
        const { data, error } = await supabase
          .from('courses')
          .insert(course)
          .select()
          .single()
        
        if (error) {
          console.error(`❌ Error creando curso ${course.title}:`, error)
        } else {
          console.log(`✅ Curso creado: ${course.title}`)
        }
      } catch (error) {
        console.error(`❌ Error creando curso ${course.title}:`, error)
      }
    }
  }

  // Función para migrar lecciones (versión limpia)
  const migrateLessonsClean = async () => {
    console.log('🔄 Migrando lecciones...')
    
    const lessonsData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        course_id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Introducción a las obligaciones tributarias',
        description: 'Conceptos básicos de las obligaciones tributarias',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 45,
        order_index: 1,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    for (const lesson of lessonsData) {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .insert(lesson)
          .select()
          .single()
        
        if (error) {
          console.error(`❌ Error creando lección ${lesson.title}:`, error)
        } else {
          console.log(`✅ Lección creada: ${lesson.title}`)
        }
      } catch (error) {
        console.error(`❌ Error creando lección ${lesson.title}:`, error)
      }
    }
  }

  const handleMigration = async () => {
    try {
      setIsMigrating(true)
      setMigrationStatus('Iniciando migración limpia...')
      
      // Limpiar datos existentes primero
      setMigrationStatus('Limpiando datos existentes...')
      await cleanExistingData()
      
      // Migrar categorías primero
      setMigrationStatus('Migrando categorías...')
      await migrateCategoriesClean()
      
      setMigrationStatus('Migrando instructores...')
      await migrateInstructorsClean()
      
      setMigrationStatus('Migrando cursos...')
      await migrateCoursesClean()
      
      setMigrationStatus('Migrando lecciones...')
      await migrateLessonsClean()
      
      setMigrationStatus('Migración completada exitosamente!')
      
      // Verificar datos migrados
      const stats = await DataMigration.verifyMigration()
      setMigrationStatus(`Migración completada! Categorías: ${stats.categories}, Instructores: ${stats.instructors}, Cursos: ${stats.courses}, Lecciones: ${stats.lessons}`)
    } catch (error) {
      console.error('Error en migración:', error)
      setMigrationStatus(`Error en migración: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsMigrating(false)
    }
  }

  const handleNewSchemaMigration = async () => {
    try {
      setIsMigrating(true)
      setMigrationStatus('Iniciando migración a nueva estructura...')
      
      const stats = await NewSchemaMigration.runMigration()
      setMigrationStatus(`Nueva migración completada! Categorías: ${stats.categories}, Instructores: ${stats.instructors}, Cursos: ${stats.courses}, Lecciones: ${stats.lessons}`)
    } catch (error) {
      console.error('Error en nueva migración:', error)
      setMigrationStatus(`Error en nueva migración: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsMigrating(false)
    }
  }

  // Función para diagnóstico de instructor
  const handleInstructorDiagnostic = async () => {
    try {
      setIsMigrating(true)
      setMigrationStatus('Iniciando diagnóstico de instructor...')
      
      console.log('🔍 Iniciando diagnóstico de creación de instructor...')
      
      // 1. Crear usuario
      console.log('1️⃣ Creando usuario...')
      const user = {
        id: '550e8400-e29b-41d4-a716-446655440004',
        email: 'instructor-test@tributo-learn.com',
        role: 'instructor',
        is_active: true,
        email_verified: true
      }
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single()
      
      if (userError) {
        console.error('❌ Error creando usuario:', userError)
        setMigrationStatus(`Error creando usuario: ${userError.message}`)
        return
      }
      
      console.log('✅ Usuario creado:', userData)
      setMigrationStatus('Usuario creado exitosamente...')
      
      // 2. Crear perfil
      console.log('2️⃣ Creando perfil...')
      const profile = {
        id: '550e8400-e29b-41d4-a716-446655440004',
        full_name: 'Dr. Carlos Mendoza Test',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Experto en tributación empresarial',
        is_instructor: true,
        is_verified: true
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert(profile)
        .select()
        .single()
      
      if (profileError) {
        console.error('❌ Error creando perfil:', profileError)
        setMigrationStatus(`Error creando perfil: ${profileError.message}`)
        return
      }
      
      console.log('✅ Perfil creado:', profileData)
      setMigrationStatus('Perfil creado exitosamente...')
      
      // 3. Crear instructor
      console.log('3️⃣ Creando instructor...')
      const instructorData = {
        profile_id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Especialista en Tributación',
        bio: 'Experto en tributación empresarial con más de 15 años de experiencia',
        specializations: ['Tributación Empresarial', 'Planillas'],
        experience_years: 15,
        social_links: {
          linkedin: 'https://linkedin.com/in/carlos-mendoza',
          twitter: 'https://twitter.com/carlos_mendoza'
        },
        rating: 4.8,
        total_students: 1200,
        total_courses: 8,
        total_hours_taught: 240,
        response_time_hours: 2,
        is_verified: true,
        is_featured: true,
        is_active: true
      }
      
      const { data: instructorDataResult, error: instructorError } = await supabase
        .from('instructors')
        .insert(instructorData)
        .select()
        .single()
      
      if (instructorError) {
        console.error('❌ Error creando instructor:', instructorError)
        setMigrationStatus(`Error creando instructor: ${instructorError.message}`)
        return
      }
      
      console.log('✅ Instructor creado:', instructorDataResult)
      setMigrationStatus('🎉 ¡Diagnóstico completado exitosamente! Instructor creado correctamente.')
      
    } catch (error) {
      console.error('❌ Error general:', error)
      setMigrationStatus(`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsMigrating(false)
    }
  }

  // Función para migrar categorías
  const migrateCategoriesFixed = async () => {
    console.log('🔄 Migrando categorías...')
    
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

  // Función para migrar instructores
  const migrateInstructorsFixed = async () => {
    console.log('🔄 Migrando instructores...')
    
    let successCount = 0
    let errorCount = 0
    
    for (const instructor of instructorsData) {
      try {
        console.log(`🔄 Migrando instructor: ${instructor.name}`)
        
        // Crear perfil del instructor
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

        // Crear registro de instructor
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

  // Función para migrar cursos
  const migrateCoursesFixed = async () => {
    console.log('🔄 Migrando cursos...')
    
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

  // Función para migrar lecciones
  const migrateLessonsFixed = async () => {
    console.log('🔄 Migrando lecciones...')
    
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Diagnóstico de conexión */}
      <ConnectionTest />
      
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Integración con Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Botón de migración */}
          <div className="space-y-2">
            <Button 
              onClick={handleMigration} 
              disabled={isMigrating}
              className="w-full"
            >
              {isMigrating ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Migrando datos...
                </>
              ) : (
                'Migrar datos JSON a Supabase'
              )}
            </Button>
            {migrationStatus && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{migrationStatus}</p>
              </div>
            )}
          </div>

          {/* Estado de conexión */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <LoadingSpinner className="h-4 w-4" />
                ) : coursesError ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge variant="default">{courses.length}</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Instructores</CardTitle>
              </CardHeader>
              <CardContent>
                {instructorsLoading ? (
                  <LoadingSpinner className="h-4 w-4" />
                ) : instructorsError ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge variant="default">{instructors.length}</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Lecciones</CardTitle>
              </CardHeader>
              <CardContent>
                {lessonsLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner className="h-4 w-4" />
                    <span className="text-xs">Cargando...</span>
                  </div>
                ) : lessonsError ? (
                  <div className="space-y-1">
                    <Badge variant="destructive">Error</Badge>
                    <p className="text-xs text-red-600">{lessonsError}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Badge variant="default">{lessons.length}</Badge>
                    {lessons.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Última: {lessons[0]?.title?.substring(0, 20)}...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Inscripciones</CardTitle>
              </CardHeader>
              <CardContent>
                {enrollmentsLoading ? (
                  <LoadingSpinner className="h-4 w-4" />
                ) : enrollmentsError ? (
                  <Badge variant="destructive">Error</Badge>
                ) : (
                  <Badge variant="default">{enrollments.length}</Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lista de cursos */}
          {courses.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Cursos encontrados:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Por {course.instructor_name} • {course.total_lessons} lecciones
                        </p>
                      </div>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  </div>
                ))}
                {courses.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Y {courses.length - 5} cursos más...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Lista de instructores */}
          {instructors.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Instructores encontrados:</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {instructors.slice(0, 3).map((instructor) => (
                  <div key={instructor.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{instructor.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {instructor.experience_years} años de experiencia • {instructor.total_students} estudiantes
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{instructor.rating}⭐</Badge>
                        {instructor.is_featured && (
                          <Badge variant="default">Destacado</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {instructors.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Y {instructors.length - 3} instructores más...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Errores */}
          {(coursesError || instructorsError || lessonsError || enrollmentsError) && (
            <div className="space-y-2">
              <h3 className="font-semibold text-destructive">Errores encontrados:</h3>
              <div className="space-y-1 text-sm text-destructive">
                {coursesError && <p>• Cursos: {coursesError}</p>}
                {instructorsError && <p>• Instructores: {instructorsError}</p>}
                {lessonsError && <p>• Lecciones: {lessonsError}</p>}
                {enrollmentsError && <p>• Inscripciones: {enrollmentsError}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sección de migración */}
      <Card>
        <CardHeader>
          <CardTitle>Migración de Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Migra los datos de ejemplo a Supabase para probar la funcionalidad completa.
          </p>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button 
                onClick={handleMigration} 
                disabled={isMigrating}
                className="flex-1"
              >
                {isMigrating ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Migrando...
                  </>
                ) : (
                  'Migrar Datos (Actual)'
                )}
              </Button>
              <Button 
                onClick={handleNewSchemaMigration} 
                disabled={isMigrating}
                variant="outline"
                className="flex-1"
              >
                {isMigrating ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Migrando...
                  </>
                ) : (
                  'Nueva Estructura'
                )}
              </Button>
            </div>
            
            <Button 
              onClick={handleInstructorDiagnostic} 
              disabled={isMigrating}
              variant="secondary"
              className="w-full"
            >
              {isMigrating ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Diagnosticando...
                </>
              ) : (
                '🔍 Diagnóstico de Instructor'
              )}
            </Button>
          </div>
          
          {migrationStatus && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{migrationStatus}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}