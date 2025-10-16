// Script de migración para la nueva estructura de base de datos
// Ejecutar desde el componente SupabaseTest

import { supabase } from '@/lib/supabase'

export class NewSchemaMigration {
  // Función para limpiar datos existentes
  static async cleanExistingData() {
    console.log('🧹 Limpiando datos existentes...')
    
    try {
      // Limpiar en orden inverso para respetar las foreign keys
      await supabase.from('lesson_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('consultations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('instructors').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      console.log('✅ Datos existentes limpiados')
    } catch (error) {
      console.error('❌ Error limpiando datos:', error)
      throw error
    }
  }

  // Función para migrar categorías
  static async migrateCategories() {
    console.log('🔄 Migrando categorías...')
    
    const categoriesData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Tributación Básica',
        slug: 'tributacion-basica',
        description: 'Fundamentos de la tributación empresarial',
        icon: '📚',
        color: '#3B82F6',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'IVA',
        slug: 'iva',
        description: 'Impuesto al Valor Agregado',
        icon: '💰',
        color: '#10B981',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Impuesto a la Renta',
        slug: 'impuesto-renta',
        description: 'Impuesto a la Renta de Personas Naturales y Jurídicas',
        icon: '📊',
        color: '#F59E0B',
        is_active: true
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

  // Función para migrar instructores
  static async migrateInstructors() {
    console.log('🔄 Migrando instructores...')
    
    const instructorsData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
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
        is_featured: true,
        consultation_rate: 150.00
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Dra. Andrea Vásquez',
        title: 'CPC Especialista en Contabilidad',
        bio: 'Contadora Pública Colegiada con amplia experiencia en contabilidad empresarial',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        experience_years: 12,
        specializations: ['Contabilidad', 'Auditoría', 'NIIF'],
        social_links: {
          linkedin: 'https://linkedin.com/in/andrea-vasquez',
          website: 'https://andrea-contadora.com'
        },
        is_verified: true,
        rating: 4.9,
        total_students: 800,
        total_courses: 6,
        total_hours_taught: 180,
        response_time_hours: 4,
        is_featured: true,
        consultation_rate: 120.00
      }
    ]
    
    for (const instructor of instructorsData) {
      try {
        // Primero crear usuario
        const user = {
          id: instructor.id,
          email: `instructor-${instructor.id}@tributo-learn.com`,
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
          console.error(`❌ Error creando usuario ${instructor.name}:`, userError)
          continue
        }
        
        console.log(`✅ Usuario creado: ${instructor.name}`)
        
        // Luego crear perfil
        const profile = {
          id: instructor.id,
          full_name: instructor.name,
          avatar_url: instructor.avatar_url,
          bio: instructor.bio,
          is_instructor: true,
          is_verified: instructor.is_verified
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
          bio: instructor.bio,
          specializations: instructor.specializations,
          experience_years: instructor.experience_years,
          social_links: instructor.social_links,
          rating: instructor.rating,
          total_students: instructor.total_students,
          total_courses: instructor.total_courses,
          total_hours_taught: instructor.total_hours_taught,
          response_time_hours: instructor.response_time_hours,
          is_verified: instructor.is_verified,
          is_featured: instructor.is_featured,
          is_active: true
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

  // Función para migrar cursos
  static async migrateCourses() {
    console.log('🔄 Migrando cursos...')
    
    const coursesData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Fundamentos Tributarios para Pymes',
        slug: 'fundamentos-tributarios-pymes',
        description: 'Aprende los conceptos básicos de la tributación empresarial para pequeñas y medianas empresas',
        short_description: 'Conceptos básicos de tributación para Pymes',
        instructor_id: '550e8400-e29b-41d4-a716-446655440004',
        category_id: '550e8400-e29b-41d4-a716-446655440001',
        price: 299.99,
        level: 'beginner',
        duration_hours: 8,
        thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
        preview_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_published: true,
        is_featured: true,
        tags: ['tributación', 'pymes', 'básico'],
        learning_outcomes: [
          'Comprender las obligaciones tributarias básicas',
          'Aprender a calcular impuestos principales',
          'Conocer los plazos y procedimientos'
        ]
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'IVA Avanzado: Casos y Jurisprudencia',
        slug: 'iva-avanzado-casos-jurisprudencia',
        description: 'Curso avanzado de IVA con casos prácticos y análisis de jurisprudencia',
        short_description: 'IVA avanzado con casos prácticos',
        instructor_id: '550e8400-e29b-41d4-a716-446655440004',
        category_id: '550e8400-e29b-41d4-a716-446655440002',
        price: 499.99,
        level: 'advanced',
        duration_hours: 12,
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        preview_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        is_published: true,
        is_featured: true,
        tags: ['iva', 'avanzado', 'jurisprudencia'],
        learning_outcomes: [
          'Dominar casos complejos de IVA',
          'Analizar jurisprudencia relevante',
          'Aplicar criterios SUNAT'
        ]
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

  // Función para migrar lecciones
  static async migrateLessons() {
    console.log('🔄 Migrando lecciones...')
    
    const lessonsData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        course_id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Introducción a las obligaciones tributarias',
        description: 'Conceptos básicos de las obligaciones tributarias para empresas',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 45,
        order_index: 1,
        is_published: true,
        is_preview: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        course_id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Registro contable y comprobantes',
        description: 'Cómo llevar el registro contable y manejar comprobantes de pago',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 60,
        order_index: 2,
        is_published: true,
        is_preview: false
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        course_id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'Conceptos avanzados de IVA',
        description: 'Conceptos avanzados y casos especiales de IVA',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 90,
        order_index: 1,
        is_published: true,
        is_preview: true
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

  // Función para actualizar contadores de cursos
  static async updateCourseCounters() {
    console.log('🔄 Actualizando contadores de cursos...')
    
    try {
      // Actualizar total_lessons en cursos
      const { data: courses } = await supabase.from('courses').select('id')
      
      if (courses) {
        for (const course of courses) {
          const { count: lessonCount } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
          
          await supabase
            .from('courses')
            .update({ total_lessons: lessonCount || 0 })
            .eq('id', course.id)
        }
      }
      
      console.log('✅ Contadores de cursos actualizados')
    } catch (error) {
      console.error('❌ Error actualizando contadores:', error)
    }
  }

  // Función para verificar migración
  static async verifyMigration() {
    console.log('🔍 Verificando migración...')
    
    try {
      const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
      const { count: instructorsCount } = await supabase.from('instructors').select('*', { count: 'exact', head: true })
      const { count: coursesCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
      const { count: lessonsCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true })
      
      console.log(`📊 Categorías migradas: ${categoriesCount || 0}`)
      console.log(`👨‍🏫 Instructores migrados: ${instructorsCount || 0}`)
      console.log(`📚 Cursos migrados: ${coursesCount || 0}`)
      console.log(`🎥 Lecciones migradas: ${lessonsCount || 0}`)
      
      return {
        categories: categoriesCount || 0,
        instructors: instructorsCount || 0,
        courses: coursesCount || 0,
        lessons: lessonsCount || 0
      }
    } catch (error) {
      console.error('Error verificando migración:', error)
      throw error
    }
  }

  // Función principal de migración
  static async runMigration() {
    console.log('🚀 Iniciando migración a nueva estructura...')
    
    try {
      // Limpiar datos existentes
      await this.cleanExistingData()
      
      // Migrar datos
      await this.migrateCategories()
      await this.migrateInstructors()
      await this.migrateCourses()
      await this.migrateLessons()
      
      // Actualizar contadores
      await this.updateCourseCounters()
      
      // Verificar migración
      const stats = await this.verifyMigration()
      
      console.log('🎉 ¡Migración completada exitosamente!')
      return stats
    } catch (error) {
      console.error('❌ Error en migración:', error)
      throw error
    }
  }
}
