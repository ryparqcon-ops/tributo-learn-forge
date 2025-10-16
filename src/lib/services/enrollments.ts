import { supabase } from '../supabase'
import type { 
  Enrollment, 
  EnrollmentInsert, 
  EnrollmentUpdate,
  LessonProgress,
  LessonProgressInsert,
  LessonProgressUpdate,
  UserProgress,
  Review,
  ReviewInsert,
  ReviewUpdate
} from '../types/supabase'

// =============================================
// SERVICIOS DE INSCRIPCIONES
// =============================================

export class EnrollmentService {
  // Obtener inscripciones del usuario actual
  static async getUserEnrollments(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', userId)
      .order('enrolled_at', { ascending: false })

    if (error) {
      console.error('Error fetching user enrollments:', error)
      throw new Error('Error al obtener las inscripciones del usuario')
    }

    return data || []
  }

  // Verificar si el usuario está inscrito en un curso
  static async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return false
      }
      console.error('Error checking enrollment:', error)
      throw new Error('Error al verificar la inscripción')
    }

    return !!data
  }

  // Inscribir usuario en un curso
  static async enrollUser(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        student_id: userId,
        course_id: courseId
      })
      .select()
      .single()

    if (error) {
      console.error('Error enrolling user:', error)
      throw new Error('Error al inscribir al usuario en el curso')
    }

    return data
  }

  // Cancelar inscripción
  static async cancelEnrollment(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('enrollments')
      .update({ is_active: false })
      .eq('student_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error canceling enrollment:', error)
      throw new Error('Error al cancelar la inscripción')
    }
  }

  // Obtener progreso de un curso específico
  static async getCourseProgress(userId: string, courseId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching course progress:', error)
      throw new Error('Error al obtener el progreso del curso')
    }

    return data
  }

  // Actualizar último acceso al curso
  static async updateLastAccessed(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('enrollments')
      .update({ last_accessed_at: new Date().toISOString() })
      .eq('student_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error updating last accessed:', error)
      throw new Error('Error al actualizar el último acceso')
    }
  }
}

// =============================================
// SERVICIOS DE PROGRESO DE LECCIONES
// =============================================

export class LessonProgressService {
  // Obtener progreso de lecciones del usuario
  static async getUserLessonProgress(userId: string, courseId?: string): Promise<LessonProgress[]> {
    let query = supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', userId)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    const { data, error } = await query.order('completed_at', { ascending: false })

    if (error) {
      console.error('Error fetching lesson progress:', error)
      throw new Error('Error al obtener el progreso de las lecciones')
    }

    return data || []
  }

  // Marcar lección como completada
  static async completeLesson(userId: string, lessonId: string, courseId: string): Promise<LessonProgress> {
    // Primero verificar si ya existe
    const { data: existing } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    if (existing) {
      // Si ya existe, actualizarlo
      const { data, error } = await supabase
        .from('lesson_progress')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('student_id', userId)
        .eq('lesson_id', lessonId)
        .select()
        .single()

      if (error) {
        console.error('Error updating lesson:', error)
        throw new Error('Error al actualizar la lección como completada')
      }

      return data
    } else {
      // Si no existe, crear nuevo
      const { data, error } = await supabase
        .from('lesson_progress')
        .insert({
          student_id: userId,
          lesson_id: lessonId,
          course_id: courseId,
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating lesson progress:', error)
        throw new Error('Error al crear el progreso de la lección')
      }

      return data
    }
  }

  // Actualizar tiempo de visualización
  static async updateWatchTime(userId: string, lessonId: string, courseId: string, watchTimeSeconds: number): Promise<LessonProgress> {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        student_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        watched_duration: watchTimeSeconds,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating watch time:', error)
      throw new Error('Error al actualizar el tiempo de visualización')
    }

    return data
  }

  // Verificar si una lección está completada
  static async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('is_completed')
      .eq('student_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return false
      }
      console.error('Error checking lesson completion:', error)
      throw new Error('Error al verificar el estado de la lección')
    }

    return data.is_completed
  }

  // Obtener lecciones completadas de un curso
  static async getCompletedLessons(userId: string, courseId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .eq('is_completed', true)

    if (error) {
      console.error('Error fetching completed lessons:', error)
      throw new Error('Error al obtener las lecciones completadas')
    }

    return data.map(item => item.lesson_id)
  }

  // Obtener estadísticas de progreso del usuario
  static async getUserProgressStats(userId: string): Promise<{
    totalCourses: number
    completedCourses: number
    totalLessons: number
    completedLessons: number
    totalWatchTime: number
  }> {
    // Obtener inscripciones del usuario
    const enrollments = await EnrollmentService.getUserEnrollments(userId)
    
    // Obtener progreso de lecciones
    const lessonProgress = await this.getUserLessonProgress(userId)

    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(e => e.progress_percentage === 100).length
    const totalLessons = enrollments.reduce((sum, e) => sum + e.total_lessons, 0)
    const completedLessons = lessonProgress.filter(lp => lp.is_completed).length
    const totalWatchTime = lessonProgress.reduce((sum, lp) => sum + (lp.watched_duration || 0), 0)

    return {
      totalCourses,
      completedCourses,
      totalLessons,
      completedLessons,
      totalWatchTime
    }
  }
}

// =============================================
// SERVICIOS DE RESEÑAS
// =============================================

export class ReviewService {
  // Obtener reseñas de un curso
  static async getCourseReviews(courseId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles!reviews_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching course reviews:', error)
      throw new Error('Error al obtener las reseñas del curso')
    }

    return data || []
  }

  // Obtener reseña del usuario para un curso
  static async getUserReview(userId: string, courseId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching user review:', error)
      throw new Error('Error al obtener la reseña del usuario')
    }

    return data
  }

  // Crear o actualizar reseña
  static async upsertReview(reviewData: ReviewInsert): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .upsert(reviewData)
      .select()
      .single()

    if (error) {
      console.error('Error upserting review:', error)
      throw new Error('Error al guardar la reseña')
    }

    return data
  }

  // Eliminar reseña
  static async deleteReview(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('student_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error deleting review:', error)
      throw new Error('Error al eliminar la reseña')
    }
  }

  // Obtener estadísticas de reseñas de un curso
  static async getCourseReviewStats(courseId: string): Promise<{
    averageRating: number
    totalReviews: number
    ratingDistribution: Record<number, number>
  }> {
    const reviews = await this.getCourseReviews(courseId)
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {}
      }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    const ratingDistribution = reviews.reduce((dist, review) => {
      dist[review.rating] = (dist[review.rating] || 0) + 1
      return dist
    }, {} as Record<number, number>)

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution
    }
  }
}
