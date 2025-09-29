import { useState, useEffect } from 'react'
import { useUserEnrollments } from './use-enrollments'
import { useCourses } from './use-courses'
import { useAllLessons } from './use-lessons'
import { supabase } from '@/lib/supabase'
import type { CourseWithDetails } from '@/lib/types/supabase'

export interface DashboardCourse {
  id: string
  title: string
  slug: string
  thumbnail_url: string | null
  short_description: string
  duration_hours: number
  price: string | number
  currency: string
  level: string
  rating: number
  instructor_name: string
  instructor_title: string
  instructor_avatar: string | null
  progress: number
  completedLessons: number
  totalLessons: number
  nextLesson: {
    id: string
    title: string
    duration_minutes: number
  } | null
  lastAccessed: string
  timeSpent: number
  isCompleted: boolean
  hasStarted: boolean
}

export function useDashboard() {
  const { enrollments, loading: enrollmentsLoading, error: enrollmentsError } = useUserEnrollments()
  const { courses, loading: coursesLoading, error: coursesError } = useCourses()
  const { lessons, loading: lessonsLoading, error: lessonsError } = useAllLessons()
  
  const [dashboardCourses, setDashboardCourses] = useState<DashboardCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lessonProgress, setLessonProgress] = useState<any[]>([])
  const [progressLoading, setProgressLoading] = useState(true)

  // Effect to load lesson progress data
  useEffect(() => {
    const fetchLessonProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProgressLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('student_id', user.id)

        if (error) {
          console.error('Error fetching lesson progress:', error)
        } else {
          setLessonProgress(data || [])
        }
      } catch (err) {
        console.error('Error in fetchLessonProgress:', err)
      } finally {
        setProgressLoading(false)
      }
    }

    fetchLessonProgress()
  }, [])

  // Effect to handle loading states and errors
  useEffect(() => {
    if (enrollmentsLoading || coursesLoading || lessonsLoading || progressLoading) {
      console.log('⏳ Esperando datos...', { enrollmentsLoading, coursesLoading, lessonsLoading, progressLoading })
      setLoading(true)
      return
    }

    if (enrollmentsError || coursesError || lessonsError) {
      setError(enrollmentsError || coursesError || lessonsError)
      setLoading(false)
      return
    }

    setLoading(false)
  }, [enrollmentsLoading, coursesLoading, lessonsLoading, progressLoading, enrollmentsError, coursesError, lessonsError])

  // Effect to process data when arrays change
  useEffect(() => {
    if (enrollmentsLoading || coursesLoading || lessonsLoading || progressLoading) {
      return
    }

    if (enrollmentsError || coursesError || lessonsError) {
      return
    }

    const processDashboardData = () => {
      try {
        console.log('🔄 Procesando datos del dashboard...', {
          enrollments: enrollments?.length,
          courses: courses?.length,
          lessons: lessons?.length
        })

        // Get enrolled course IDs
        const enrolledCourseIds = enrollments.map(enrollment => enrollment.course_id)
        
        // Get enrolled courses with details
        const enrolledCourses = courses?.filter(course => 
          enrolledCourseIds.includes(course.id)
        ) || []

        // Process each enrolled course
        const processedCourses: DashboardCourse[] = enrolledCourses.map(course => {
          const enrollment = enrollments.find(e => e.course_id === course.id)
          const courseLessons = lessons?.filter(lesson => lesson.course_id === course.id) || []
          
          // Get real completed lessons for this course
          const completedLessonsForCourse = lessonProgress.filter(progress => 
            progress.course_id === course.id && progress.is_completed
          )
          
          const totalLessons = courseLessons.length
          const completedCount = completedLessonsForCourse.length
          const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
          
          // Get completed lesson IDs
          const completedLessonIds = completedLessonsForCourse.map(p => p.lesson_id)
          
          // Get next lesson (first uncompleted lesson)
          const nextLesson = courseLessons
            .sort((a, b) => a.order_index - b.order_index)
            .find(lesson => !completedLessonIds.includes(lesson.id))
          
          // Calculate real time spent from watched_duration
          const timeSpentSeconds = lessonProgress
            .filter(p => p.course_id === course.id)
            .reduce((total, p) => total + (p.watched_duration || 0), 0)
          const timeSpent = Math.floor(timeSpentSeconds / 60) // Convert to minutes
          
          // Check if course has been started (has any lesson progress)
          const hasStarted = lessonProgress.some(p => p.course_id === course.id && p.watched_duration > 0)
          
          return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            thumbnail_url: course.thumbnail_url,
            short_description: course.short_description,
            duration_hours: course.duration_hours,
            price: course.price,
            currency: course.currency,
            level: course.level,
            rating: course.rating,
            instructor_name: course.instructor_name,
            instructor_title: course.instructor_title,
            instructor_avatar: course.instructor_avatar,
            progress,
            completedLessons: completedCount,
            totalLessons,
            nextLesson: nextLesson ? {
              id: nextLesson.id,
              title: nextLesson.title,
              duration_minutes: nextLesson.duration_minutes
            } : null,
            lastAccessed: enrollment?.last_accessed || new Date().toISOString().split('T')[0],
            timeSpent,
            isCompleted: progress === 100,
            hasStarted
          }
        })

        console.log('✅ Datos del dashboard procesados:', {
          processedCourses: processedCourses.length,
          courses: processedCourses.map(c => ({ id: c.id, title: c.title, progress: c.progress }))
        })
        
        setDashboardCourses(processedCourses)
      } catch (err) {
        console.error('❌ Error processing dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Error al procesar los datos del dashboard')
      } finally {
        console.log('🏁 Finalizando procesamiento del dashboard')
      }
    }

    processDashboardData()
  }, [enrollments, courses, lessons, lessonProgress])

  // Calculate overall statistics
  const totalLessons = dashboardCourses.reduce((sum, course) => sum + course.totalLessons, 0)
  const completedLessons = dashboardCourses.reduce((sum, course) => sum + course.completedLessons, 0)
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const totalTimeSpent = dashboardCourses.reduce((sum, course) => sum + course.timeSpent, 0)
  const completedCourses = dashboardCourses.filter(course => course.isCompleted).length
  const inProgressCourses = dashboardCourses.filter(course => 
    course.hasStarted && !course.isCompleted
  ).length

  return {
    courses: dashboardCourses,
    stats: {
      totalCourses: dashboardCourses.length,
      completedCourses,
      inProgressCourses,
      totalLessons,
      completedLessons,
      overallProgress,
      totalTimeSpent
    },
    loading: loading || enrollmentsLoading || coursesLoading || lessonsLoading,
    error: error || enrollmentsError || coursesError || lessonsError
  }
}
