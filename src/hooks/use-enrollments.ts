import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { EnrollmentService, LessonProgressService, ReviewService } from '@/lib/services/enrollments'
import type { UserProgress, LessonProgress, Review } from '@/lib/types/supabase'

// =============================================
// HOOK PARA INSCRIPCIONES Y PROGRESO
// =============================================

export function useUserEnrollments() {
  const [enrollments, setEnrollments] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setEnrollments([])
          return
        }

        const data = await EnrollmentService.getUserEnrollments(user.id)
        setEnrollments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las inscripciones')
        console.error('Error fetching enrollments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrollments()
  }, [])

  return { enrollments, loading, error }
}

export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const fetchProgress = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProgress(null)
          return
        }

        const data = await EnrollmentService.getCourseProgress(user.id, courseId)
        setProgress(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el progreso del curso')
        console.error('Error fetching course progress:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [courseId])

  return { progress, loading, error }
}

export function useIsEnrolled(courseId: string) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const checkEnrollment = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsEnrolled(false)
          return
        }

        const enrolled = await EnrollmentService.isUserEnrolled(user.id, courseId)
        setIsEnrolled(enrolled)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al verificar la inscripción')
        console.error('Error checking enrollment:', err)
      } finally {
        setLoading(false)
      }
    }

    checkEnrollment()
  }, [courseId])

  return { isEnrolled, loading, error }
}

export function useLessonProgress(courseId?: string) {
  const [progress, setProgress] = useState<LessonProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProgress([])
          return
        }

        const data = await LessonProgressService.getUserLessonProgress(user.id, courseId)
        setProgress(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el progreso de las lecciones')
        console.error('Error fetching lesson progress:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [courseId])

  return { progress, loading, error }
}

export function useCompletedLessons(courseId: string) {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const addCompletedLessonOptimistic = (lessonId: string) => {
    setCompletedLessons(prev => [...new Set([...prev, lessonId])])
  }

  useEffect(() => {
    if (!courseId || courseId.trim() === '') {
      console.log('⚠️ useCompletedLessons: courseId no proporcionado o vacío');
      setCompletedLessons([])
      setLoading(false)
      return
    }

    console.log('🔄 useCompletedLessons: Iniciando carga para courseId:', courseId);

    const fetchCompletedLessons = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('⚠️ useCompletedLessons: Usuario no autenticado');
          setCompletedLessons([])
          return
        }

        console.log('👤 useCompletedLessons: Usuario encontrado:', user.id);
        const data = await LessonProgressService.getCompletedLessons(user.id, courseId)
        console.log('✅ useCompletedLessons: Lecciones completadas obtenidas:', data);
        setCompletedLessons(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las lecciones completadas')
        console.error('❌ useCompletedLessons: Error fetching completed lessons:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedLessons()
  }, [courseId, refreshTrigger])

  return { completedLessons, loading, error, refetch, addCompletedLessonOptimistic }
}

export function useUserProgressStats() {
  const [stats, setStats] = useState<{
    totalCourses: number
    completedCourses: number
    totalLessons: number
    completedLessons: number
    totalWatchTime: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setStats(null)
          return
        }

        const data = await LessonProgressService.getUserProgressStats(user.id)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas de progreso')
        console.error('Error fetching progress stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

// =============================================
// HOOK PARA RESEÑAS
// =============================================

export function useCourseReviews(courseId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ReviewService.getCourseReviews(courseId)
        setReviews(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las reseñas')
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [courseId])

  return { reviews, loading, error }
}

export function useUserReview(courseId: string) {
  const [review, setReview] = useState<Review | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const fetchUserReview = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setReview(null)
          return
        }

        const data = await ReviewService.getUserReview(user.id, courseId)
        setReview(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la reseña del usuario')
        console.error('Error fetching user review:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserReview()
  }, [courseId])

  return { review, loading, error }
}

export function useCourseReviewStats(courseId: string) {
  const [stats, setStats] = useState<{
    averageRating: number
    totalReviews: number
    ratingDistribution: Record<number, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ReviewService.getCourseReviewStats(courseId)
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas de reseñas')
        console.error('Error fetching review stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [courseId])

  return { stats, loading, error }
}
