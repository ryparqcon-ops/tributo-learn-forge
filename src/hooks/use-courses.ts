import { useState, useEffect } from 'react'
import { CourseService } from '@/lib/services/courses'
import type { CourseWithDetails } from '@/lib/types/supabase'

// =============================================
// HOOK PARA CURSOS
// =============================================

export function useCourses() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.getPublishedCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los cursos')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return { courses, loading, error }
}

export function useFeaturedCourses() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.getFeaturedCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los cursos destacados')
        console.error('Error fetching featured courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCourses()
  }, [])

  return { courses, loading, error }
}

export function useCourse(slug: string) {
  const [course, setCourse] = useState<CourseWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.getCourseBySlug(slug)
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el curso')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [slug])

  return { course, loading, error }
}

export function useCourseById(id: string) {
  const [course, setCourse] = useState<CourseWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.getCourseById(id)
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el curso')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  return { course, loading, error }
}

export function useSearchCourses(query: string, filters?: {
  category?: string
  level?: string
  priceMin?: number
  priceMax?: number
}) {
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query && !filters) return

    const searchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.searchCourses(query, filters)
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar cursos')
        console.error('Error searching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchCourses, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [query, filters])

  return { courses, loading, error }
}

export function useCoursesByInstructor(instructorId: string) {
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!instructorId) return

    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.getCoursesByInstructor(instructorId)
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los cursos del instructor')
        console.error('Error fetching instructor courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [instructorId])

  return { courses, loading, error }
}

export function useCoursesByCategory(categorySlug: string) {
  const [courses, setCourses] = useState<CourseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categorySlug) return

    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await CourseService.getCoursesByCategory(categorySlug)
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los cursos de la categoría')
        console.error('Error fetching category courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [categorySlug])

  return { courses, loading, error }
}
