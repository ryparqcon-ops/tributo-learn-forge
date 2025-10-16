import { supabase } from '../supabase'
import type { 
  Course, 
  CourseInsert, 
  CourseUpdate, 
  CourseWithDetails,
  Lesson,
  LessonInsert,
  LessonUpdate,
  Instructor,
  Category
} from '../types/supabase'

// =============================================
// SERVICIOS DE CURSOS
// =============================================

export class CourseService {
  // Obtener todos los cursos publicados
  static async getPublishedCourses(): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('courses_with_details')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching published courses:', error)
      throw new Error('Error al obtener los cursos')
    }

    return data || []
  }

  // Obtener cursos destacados
  static async getFeaturedCourses(): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('courses_with_details')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured courses:', error)
      throw new Error('Error al obtener los cursos destacados')
    }

    return data || []
  }

  // Obtener curso por slug
  static async getCourseBySlug(slug: string): Promise<CourseWithDetails | null> {
    const { data, error } = await supabase
      .from('courses_with_details')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No encontrado
      }
      console.error('Error fetching course by slug:', error)
      throw new Error('Error al obtener el curso')
    }

    return data
  }

  // Obtener curso por ID
  static async getCourseById(id: string): Promise<CourseWithDetails | null> {
    const { data, error } = await supabase
      .from('courses_with_details')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching course by id:', error)
      throw new Error('Error al obtener el curso')
    }

    return data
  }

  // Buscar cursos
  static async searchCourses(query: string, filters?: {
    category?: string
    level?: string
    priceMin?: number
    priceMax?: number
  }): Promise<CourseWithDetails[]> {
    let queryBuilder = supabase
      .from('courses_with_details')
      .select('*')
      .eq('is_published', true)

    // Búsqueda por texto
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Filtros
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category_slug', filters.category)
    }

    if (filters?.level) {
      queryBuilder = queryBuilder.eq('level', filters.level)
    }

    if (filters?.priceMin !== undefined) {
      queryBuilder = queryBuilder.gte('price_cents', filters.priceMin * 100)
    }

    if (filters?.priceMax !== undefined) {
      queryBuilder = queryBuilder.lte('price_cents', filters.priceMax * 100)
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching courses:', error)
      throw new Error('Error al buscar cursos')
    }

    return data || []
  }

  // Obtener cursos por instructor
  static async getCoursesByInstructor(instructorId: string): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('courses_with_details')
      .select('*')
      .eq('instructor_id', instructorId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching courses by instructor:', error)
      throw new Error('Error al obtener los cursos del instructor')
    }

    return data || []
  }

  // Obtener cursos por categoría
  static async getCoursesByCategory(categorySlug: string): Promise<CourseWithDetails[]> {
    const { data, error } = await supabase
      .from('courses_with_details')
      .select('*')
      .eq('category_slug', categorySlug)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching courses by category:', error)
      throw new Error('Error al obtener los cursos de la categoría')
    }

    return data || []
  }

  // Crear curso (solo instructores)
  static async createCourse(courseData: CourseInsert): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      throw new Error('Error al crear el curso')
    }

    return data
  }

  // Actualizar curso (solo instructores)
  static async updateCourse(id: string, courseData: CourseUpdate): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      throw new Error('Error al actualizar el curso')
    }

    return data
  }

  // Eliminar curso (solo instructores)
  static async deleteCourse(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting course:', error)
      throw new Error('Error al eliminar el curso')
    }
  }
}

// =============================================
// SERVICIOS DE LECCIONES
// =============================================

export class LessonService {
  // Obtener todas las lecciones publicadas
  static async getAllLessons(): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all lessons:', error)
      throw new Error('Error al obtener las lecciones')
    }

    return data || []
  }

  // Obtener lecciones de un curso
  static async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching lessons:', error)
      throw new Error('Error al obtener las lecciones')
    }

    return data || []
  }

  // Obtener lección por ID
  static async getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching lesson:', error)
      throw new Error('Error al obtener la lección')
    }

    return data
  }

  // Crear lección (solo instructores)
  static async createLesson(lessonData: LessonInsert): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lessonData)
      .select()
      .single()

    if (error) {
      console.error('Error creating lesson:', error)
      throw new Error('Error al crear la lección')
    }

    return data
  }

  // Actualizar lección (solo instructores)
  static async updateLesson(id: string, lessonData: LessonUpdate): Promise<Lesson> {
    const { data, error } = await supabase
      .from('lessons')
      .update(lessonData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating lesson:', error)
      throw new Error('Error al actualizar la lección')
    }

    return data
  }

  // Eliminar lección (solo instructores)
  static async deleteLesson(id: string): Promise<void> {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting lesson:', error)
      throw new Error('Error al eliminar la lección')
    }
  }
}

// =============================================
// SERVICIOS DE CATEGORÍAS
// =============================================

export class CategoryService {
  // Obtener todas las categorías activas
  static async getActiveCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Error al obtener las categorías')
    }

    return data || []
  }

  // Obtener categoría por slug
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching category:', error)
      throw new Error('Error al obtener la categoría')
    }

    return data
  }
}
