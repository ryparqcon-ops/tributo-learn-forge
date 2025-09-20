import { useState, useEffect } from 'react'
import { InstructorService } from '@/lib/services/instructors'
import type { Instructor } from '@/lib/types/supabase'

// =============================================
// HOOK PARA INSTRUCTORES
// =============================================

export function useInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await InstructorService.getActiveInstructors()
        setInstructors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los instructores')
        console.error('Error fetching instructors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  return { instructors, loading, error }
}

export function useFeaturedInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedInstructors = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await InstructorService.getFeaturedInstructors()
        setInstructors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los instructores destacados')
        console.error('Error fetching featured instructors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedInstructors()
  }, [])

  return { instructors, loading, error }
}

export function useInstructor(id: string) {
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchInstructor = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await InstructorService.getInstructorById(id)
        setInstructor(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el instructor')
        console.error('Error fetching instructor:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructor()
  }, [id])

  return { instructor, loading, error }
}

export function useSearchInstructors(query: string, filters?: {
  specializations?: string[]
  minRating?: number
  experienceMin?: number
}) {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query && !filters) return

    const searchInstructors = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await InstructorService.searchInstructors(query, filters)
        setInstructors(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al buscar instructores')
        console.error('Error searching instructors:', err)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchInstructors, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [query, filters])

  return { instructors, loading, error }
}
