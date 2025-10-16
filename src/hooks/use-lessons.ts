import { useState, useEffect } from 'react'
import { LessonService } from '@/lib/services/courses'
import type { Lesson } from '@/lib/types/supabase'

// =============================================
// HOOK PARA LECCIONES
// =============================================

// Hook para obtener todas las lecciones
export function useAllLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await LessonService.getAllLessons()
        setLessons(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las lecciones')
        console.error('Error fetching lessons:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  return { lessons, loading, error }
}

export function useLessons(courseId: string) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return

    const fetchLessons = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await LessonService.getLessonsByCourse(courseId)
        setLessons(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las lecciones')
        console.error('Error fetching lessons:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [courseId])

  return { lessons, loading, error }
}

export function useLesson(id: string) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchLesson = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await LessonService.getLessonById(id)
        setLesson(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la lección')
        console.error('Error fetching lesson:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id])

  return { lesson, loading, error }
}
