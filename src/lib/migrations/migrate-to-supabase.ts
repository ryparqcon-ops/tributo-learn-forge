import { supabase } from '../supabase'
import coursesData from '../data/courses.json'
import lessonsData from '../data/lessons.json'
import instructorsData from '../data/instructors.json'

// =============================================
// SCRIPT DE MIGRACIÓN DE DATOS A SUPABASE
// =============================================

export class DataMigration {
  // Migrar instructores
  static async migrateInstructors() {
    console.log('🔄 Migrando instructores...')
    console.log(`📊 Total instructores a migrar: ${instructorsData.length}`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const instructor of instructorsData) {
      try {
        console.log(`🔄 Migrando instructor: ${instructor.name}`)
        
        // Crear perfil del instructor
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
          console.error(`❌ Error creando perfil para ${instructor.name}:`, profileError)
          errorCount++
          continue
        }

        console.log(`✅ Perfil creado para ${instructor.name}`)

        // Crear registro de instructor
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
            response_time_hours: instructor.response_time_hours,
            is_verified: instructor.is_verified,
            is_featured: instructor.is_featured,
            is_active: true
          })

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
  }

  // Migrar categorías
  static async migrateCategories() {
    console.log('🔄 Migrando categorías...')
    
    const categories = [
      { name: 'Tributación Básica', slug: 'tributacion-basica', description: 'Conceptos fundamentales de tributación peruana', icon: 'book', color: '#3B82F6' },
      { name: 'IVA', slug: 'iva', description: 'Impuesto General a las Ventas', icon: 'receipt', color: '#10B981' },
      { name: 'Impuesto a la Renta', slug: 'impuesto-renta', description: 'Impuesto a la Renta de personas y empresas', icon: 'calculator', color: '#F59E0B' },
      { name: 'Planillas', slug: 'planillas', description: 'Nóminas y tributación laboral', icon: 'users', color: '#8B5CF6' },
      { name: 'Fiscalización', slug: 'fiscalizacion', description: 'Defensa ante fiscalizaciones de SUNAT', icon: 'shield', color: '#EF4444' },
      { name: 'Tributación Digital', slug: 'tributacion-digital', description: 'E-commerce y obligaciones digitales', icon: 'monitor', color: '#06B6D4' }
    ]

    for (const category of categories) {
      try {
        const { error } = await supabase
          .from('categories')
          .insert(category)

        if (error) {
          console.error(`Error creando categoría ${category.name}:`, error)
        } else {
          console.log(`✅ Categoría ${category.name} migrada correctamente`)
        }
      } catch (error) {
        console.error(`Error migrando categoría ${category.name}:`, error)
      }
    }
    
    console.log('✅ Migración de categorías completada')
  }

  // Migrar cursos
  static async migrateCourses() {
    console.log('🔄 Migrando cursos...')
    
    // Mapeo de categorías por tags
    const categoryMapping: Record<string, string> = {
      'local': 'tributacion-basica',
      'práctico': 'tributacion-basica',
      'básico': 'tributacion-basica',
      'pymes': 'tributacion-basica',
      'iva': 'iva',
      'avanzado': 'iva',
      'jurisprudencia': 'iva',
      'optimización': 'iva',
      'planillas': 'planillas',
      'laboral': 'planillas',
      'essalud': 'planillas',
      'afp': 'planillas',
      'beneficios': 'planillas',
      'renta': 'impuesto-renta',
      'personas': 'impuesto-renta',
      'declaración': 'impuesto-renta',
      'deducciones': 'impuesto-renta',
      'digital': 'tributacion-digital',
      'ecommerce': 'tributacion-digital',
      'facturación': 'tributacion-digital',
      'startups': 'tributacion-digital',
      'tecnología': 'tributacion-digital',
      'fiscalización': 'fiscalizacion',
      'defensa': 'fiscalizacion',
      'sunat': 'fiscalizacion',
      'auditoría': 'fiscalizacion',
      'estrategias': 'fiscalizacion'
    }

    for (const course of coursesData) {
      try {
        // Determinar categoría basada en tags
        let categoryId = null
        for (const tag of course.tags) {
          const categorySlug = categoryMapping[tag.toLowerCase()]
          if (categorySlug) {
            const { data: category } = await supabase
              .from('categories')
              .select('id')
              .eq('slug', categorySlug)
              .single()
            if (category) {
              categoryId = category.id
              break
            }
          }
        }

        const { error } = await supabase
          .from('courses')
          .insert({
            id: course.id,
            title: course.title,
            slug: course.slug,
            summary: course.summary,
            description: course.description,
            instructor_id: course.instructor.id,
            category_id: categoryId,
            price_cents: course.price_cents,
            currency: course.currency,
            duration_minutes: course.duration_minutes,
            avg_lesson_time: course.avg_lesson_time,
            thumbnail: course.thumbnail,
            preview_video: course.preview_video,
            preview_duration: course.preview_duration,
            level: course.level as 'Principiante' | 'Intermedio' | 'Avanzado',
            language: course.language || 'Español',
            tags: course.tags,
            rating: course.rating,
            students_enrolled: course.students_enrolled,
            ai_enabled: course.ai_enabled,
            certificate: course.certificate,
            lifetime_access: course.lifetime_access,
            is_published: true,
            is_featured: false
          })

        if (error) {
          console.error(`Error creando curso ${course.title}:`, error)
        } else {
          console.log(`✅ Curso ${course.title} migrado correctamente`)
        }
      } catch (error) {
        console.error(`Error migrando curso ${course.title}:`, error)
      }
    }
    
    console.log('✅ Migración de cursos completada')
  }

  // Migrar lecciones
  static async migrateLessons() {
    console.log('🔄 Migrando lecciones...')
    
    for (const lesson of lessonsData) {
      try {
        const { error } = await supabase
          .from('lessons')
          .insert({
            id: lesson.id,
            course_id: lesson.courseId,
            title: lesson.title,
            description: lesson.description,
            duration_minutes: lesson.duration_minutes,
            video_url: lesson.video_url,
            thumbnail: lesson.thumbnail,
            transcript: lesson.transcript,
            objectives: lesson.objectives,
            resources: lesson.resources,
            order_index: lesson.order,
            is_published: true
          })

        if (error) {
          console.error(`Error creando lección ${lesson.title}:`, error)
        } else {
          console.log(`✅ Lección ${lesson.title} migrada correctamente`)
        }
      } catch (error) {
        console.error(`Error migrando lección ${lesson.title}:`, error)
      }
    }
    
    console.log('✅ Migración de lecciones completada')
  }

  // Ejecutar migración completa
  static async runFullMigration() {
    console.log('🚀 Iniciando migración completa de datos a Supabase...')
    
    try {
      await this.migrateCategories()
      await this.migrateInstructors()
      await this.migrateCourses()
      await this.migrateLessons()
      
      console.log('🎉 ¡Migración completada exitosamente!')
    } catch (error) {
      console.error('❌ Error durante la migración:', error)
      throw error
    }
  }

  // Verificar datos migrados
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
}

// Función para ejecutar la migración desde la consola del navegador
export const runMigration = async () => {
  try {
    await DataMigration.runFullMigration()
    await DataMigration.verifyMigration()
  } catch (error) {
    console.error('Error ejecutando migración:', error)
  }
}

// Hacer disponible globalmente para uso en consola
if (typeof window !== 'undefined') {
  (window as any).runMigration = runMigration
}
