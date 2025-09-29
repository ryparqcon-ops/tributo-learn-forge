import { useState, useEffect } from 'react'
import { 
  ConsultationService, 
  type ConsultationWithInstructor, 
  type ConsultationSession,
  type CreateConsultationSessionData 
} from '@/lib/services/consultations'

// =============================================
// HOOKS PARA ASESORÍAS
// =============================================

// Hook para obtener todas las asesorías disponibles
export function useConsultations() {
  const [consultations, setConsultations] = useState<ConsultationWithInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ConsultationService.getAvailableConsultations()
        setConsultations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las asesorías')
        console.error('Error fetching consultations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [])

  return { consultations, loading, error }
}

// Hook para obtener asesorías por instructor
export function useConsultationsByInstructor(instructorId: string) {
  const [consultations, setConsultations] = useState<ConsultationWithInstructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!instructorId) {
      setConsultations([])
      setLoading(false)
      return
    }

    const fetchConsultations = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ConsultationService.getConsultationsByInstructor(instructorId)
        setConsultations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las asesorías del instructor')
        console.error('Error fetching instructor consultations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [instructorId])

  return { consultations, loading, error }
}

// Hook para obtener una asesoría específica
export function useConsultation(id: string) {
  const [consultation, setConsultation] = useState<ConsultationWithInstructor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setConsultation(null)
      setLoading(false)
      return
    }

    const fetchConsultation = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ConsultationService.getConsultationById(id)
        setConsultation(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la asesoría')
        console.error('Error fetching consultation:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultation()
  }, [id])

  return { consultation, loading, error }
}

// Hook para manejar sesiones de asesoría del usuario
export function useUserConsultationSessions() {
  const [sessions, setSessions] = useState<ConsultationSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ConsultationService.getUserConsultationSessions()
      setSessions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las sesiones')
      console.error('Error fetching user sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const refetch = () => {
    fetchSessions()
  }

  return { sessions, loading, error, refetch }
}

// Hook para crear una sesión de asesoría
export function useCreateConsultationSession() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSession = async (sessionData: CreateConsultationSessionData): Promise<ConsultationSession> => {
    try {
      setLoading(true)
      setError(null)
      const session = await ConsultationService.createConsultationSession(sessionData)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la reserva'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { createSession, loading, error }
}

// Hook para obtener sesiones por estado
export function useSessionsByStatus(status: ConsultationSession['status']) {
  const [sessions, setSessions] = useState<ConsultationSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ConsultationService.getSessionsByStatus(status)
        setSessions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las sesiones')
        console.error('Error fetching sessions by status:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [status])

  return { sessions, loading, error }
}

// Hook para acciones de sesión (cancelar, calificar)
export function useSessionActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancelSession = async (sessionId: string): Promise<ConsultationSession> => {
    try {
      setLoading(true)
      setError(null)
      const session = await ConsultationService.cancelSession(sessionId)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const rateSession = async (sessionId: string, rating: number): Promise<ConsultationSession> => {
    try {
      setLoading(true)
      setError(null)
      const session = await ConsultationService.rateSession(sessionId, rating)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calificar la sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const completeSession = async (sessionId: string, notes?: string): Promise<ConsultationSession> => {
    try {
      setLoading(true)
      setError(null)
      const session = await ConsultationService.completeSession(sessionId, notes)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar la sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addMeetingUrl = async (sessionId: string, meetingUrl: string): Promise<ConsultationSession> => {
    try {
      setLoading(true)
      setError(null)
      const session = await ConsultationService.addMeetingUrl(sessionId, meetingUrl)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar enlace de reunión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const confirmSession = async (sessionId: string): Promise<ConsultationSession> => {
    try {
      setLoading(true)
      setError(null)
      const session = await ConsultationService.confirmSession(sessionId)
      return session
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al confirmar la sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { 
    cancelSession, 
    rateSession, 
    completeSession, 
    addMeetingUrl, 
    confirmSession, 
    loading, 
    error 
  }
}

// =============================================
// HOOKS ESPECÍFICOS PARA LA UI
// =============================================

// Hook para agrupar asesorías por tipo (como en la UI actual)
export function useGroupedConsultations() {
  const { consultations, loading, error } = useConsultations()
  const [groupedServices, setGroupedServices] = useState<{
    express: ConsultationWithInstructor[]
    specialized: ConsultationWithInstructor[]
    enterprise: ConsultationWithInstructor[]
  }>({
    express: [],
    specialized: [],
    enterprise: []
  })

  useEffect(() => {
    if (consultations.length > 0) {
      const grouped = {
        express: consultations.filter(c => c.duration_hours <= 0.5),
        specialized: consultations.filter(c => c.duration_hours > 0.5 && c.duration_hours <= 1),
        enterprise: consultations.filter(c => c.duration_hours > 1 || c.max_students > 1)
      }
      setGroupedServices(grouped)
    }
  }, [consultations])

  return { groupedServices, loading, error }
}

// Hook para obtener precios promedio por tipo
export function useConsultationPricing() {
  const { consultations, loading } = useConsultations()
  const [pricing, setPricing] = useState({
    express: { min: 0, max: 0, avg: 0 },
    specialized: { min: 0, max: 0, avg: 0 },
    enterprise: { min: 0, max: 0, avg: 0 }
  })

  useEffect(() => {
    if (consultations.length > 0) {
      const express = consultations.filter(c => c.duration_hours <= 0.5)
      const specialized = consultations.filter(c => c.duration_hours > 0.5 && c.duration_hours <= 1)
      const enterprise = consultations.filter(c => c.duration_hours > 1 || c.max_students > 1)

      const calculatePricing = (items: ConsultationWithInstructor[]) => {
        if (items.length === 0) return { min: 0, max: 0, avg: 0 }
        const prices = items.map(item => item.price_per_hour * item.duration_hours)
        return {
          min: Math.min(...prices),
          max: Math.max(...prices),
          avg: prices.reduce((sum, price) => sum + price, 0) / prices.length
        }
      }

      setPricing({
        express: calculatePricing(express),
        specialized: calculatePricing(specialized),
        enterprise: calculatePricing(enterprise)
      })
    }
  }, [consultations])

  return { pricing, loading }
}
