import { supabase } from '../supabase'

// =============================================
// TIPOS DE ASESORÍAS
// =============================================

export interface Consultation {
  id: string
  instructor_id: string
  title: string
  description: string | null
  price_per_hour: number
  currency: string
  duration_hours: number
  is_available: boolean
  max_students: number
  created_at: string
  updated_at: string
}

export interface ConsultationWithInstructor {
  id: string
  instructor_id: string
  title: string
  description: string | null
  price_per_hour: number
  currency: string
  duration_hours: number
  is_available: boolean
  max_students: number
  created_at: string
  updated_at: string
  instructor: {
    id: string
    title: string | null
    specializations: string[] | null
    rating: number
    experience_years: number
    response_time_hours: number
    is_verified: boolean
    is_featured: boolean
    profile: {
      id: string
      full_name: string
      avatar_url: string | null
      bio: string | null
    }
  }
}

export interface ConsultationSession {
  id: string
  consultation_id: string
  student_id: string
  instructor_id: string
  scheduled_at: string
  duration_hours: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  meeting_url: string | null
  notes: string | null
  student_rating: number | null
  instructor_rating: number | null
  created_at: string
  updated_at: string
}

export interface CreateConsultationSessionData {
  consultation_id: string
  scheduled_at: string
  student_name: string
  student_email: string
  student_phone: string
  company?: string
  subject: string
  description: string
  payment_method: string
  special_requirements?: string
}

// =============================================
// SERVICIOS DE ASESORÍAS
// =============================================

export class ConsultationService {
  // Obtener todas las asesorías disponibles con información del instructor
  static async getAvailableConsultations(): Promise<ConsultationWithInstructor[]> {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        instructor:instructors!instructor_id (
          id,
          title,
          specializations,
          rating,
          experience_years,
          response_time_hours,
          is_verified,
          is_featured,
          profile:profiles!profile_id (
            id,
            full_name,
            avatar_url,
            bio
          )
        )
      `)
      .eq('is_available', true)

    if (error) {
      console.error('Error fetching consultations:', error)
      throw new Error('Error al obtener las asesorías disponibles')
    }

    return data || []
  }

  // Obtener asesorías por instructor
  static async getConsultationsByInstructor(instructorId: string): Promise<ConsultationWithInstructor[]> {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        instructor:instructors!instructor_id (
          id,
          title,
          specializations,
          rating,
          experience_years,
          response_time_hours,
          is_verified,
          is_featured,
          profile:profiles!profile_id (
            id,
            full_name,
            avatar_url,
            bio
          )
        )
      `)
      .eq('instructor_id', instructorId)
      .eq('is_available', true)
      .order('price_per_hour', { ascending: true })

    if (error) {
      console.error('Error fetching instructor consultations:', error)
      throw new Error('Error al obtener las asesorías del instructor')
    }

    return data || []
  }

  // Obtener asesoría por ID
  static async getConsultationById(id: string): Promise<ConsultationWithInstructor | null> {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        instructor:instructors!instructor_id (
          id,
          title,
          specializations,
          rating,
          experience_years,
          response_time_hours,
          is_verified,
          is_featured,
          profile:profiles!profile_id (
            id,
            full_name,
            avatar_url,
            bio
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching consultation:', error)
      throw new Error('Error al obtener la asesoría')
    }

    return data
  }

  // Crear una sesión de asesoría (reserva)
  static async createConsultationSession(sessionData: CreateConsultationSessionData): Promise<ConsultationSession> {
    // Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    // Obtener información de la asesoría
    const consultation = await this.getConsultationById(sessionData.consultation_id)
    if (!consultation) {
      throw new Error('Asesoría no encontrada')
    }

    // Crear la sesión
    const { data, error } = await supabase
      .from('consultation_sessions')
      .insert({
        consultation_id: sessionData.consultation_id,
        student_id: user.id,
        instructor_id: consultation.instructor_id,
        scheduled_at: sessionData.scheduled_at,
        duration_hours: consultation.duration_hours,
        status: 'scheduled',
        notes: JSON.stringify({
          student_name: sessionData.student_name,
          student_email: sessionData.student_email,
          student_phone: sessionData.student_phone,
          company: sessionData.company,
          subject: sessionData.subject,
          description: sessionData.description,
          payment_method: sessionData.payment_method,
          special_requirements: sessionData.special_requirements
        })
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating consultation session:', error)
      throw new Error('Error al crear la reserva de asesoría')
    }

    return data
  }

  // Obtener sesiones del usuario actual
  static async getUserConsultationSessions(): Promise<ConsultationSession[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('consultation_sessions')
      .select('*')
      .eq('student_id', user.id)
      .order('scheduled_at', { ascending: false })

    if (error) {
      console.error('Error fetching user consultation sessions:', error)
      throw new Error('Error al obtener las sesiones de asesoría')
    }

    return data || []
  }

  // Obtener sesiones por estado
  static async getSessionsByStatus(status: ConsultationSession['status']): Promise<ConsultationSession[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuario no autenticado')
    }

    const { data, error } = await supabase
      .from('consultation_sessions')
      .select('*')
      .eq('student_id', user.id)
      .eq('status', status)
      .order('scheduled_at', { ascending: true })

    if (error) {
      console.error('Error fetching sessions by status:', error)
      throw new Error('Error al obtener las sesiones por estado')
    }

    return data || []
  }

  // Cancelar sesión
  static async cancelSession(sessionId: string): Promise<ConsultationSession> {
    const { data, error } = await supabase
      .from('consultation_sessions')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling session:', error)
      throw new Error('Error al cancelar la sesión')
    }

    return data
  }

  // Calificar sesión
  static async rateSession(sessionId: string, rating: number): Promise<ConsultationSession> {
    const { data, error } = await supabase
      .from('consultation_sessions')
      .update({ 
        student_rating: rating, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error rating session:', error)
      throw new Error('Error al calificar la sesión')
    }

    return data
  }

  // Completar sesión (para instructores)
  static async completeSession(sessionId: string, notes?: string): Promise<ConsultationSession> {
    const { data, error } = await supabase
      .from('consultation_sessions')
      .update({ 
        status: 'completed',
        notes: notes || null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error completing session:', error)
      throw new Error('Error al completar la sesión')
    }

    return data
  }

  // Agregar enlace de reunión (para instructores)
  static async addMeetingUrl(sessionId: string, meetingUrl: string): Promise<ConsultationSession> {
    const { data, error } = await supabase
      .from('consultation_sessions')
      .update({ 
        meeting_url: meetingUrl,
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error adding meeting URL:', error)
      throw new Error('Error al agregar enlace de reunión')
    }

    return data
  }

  // Confirmar sesión (para estudiantes)
  static async confirmSession(sessionId: string): Promise<ConsultationSession> {
    const { data, error } = await supabase
      .from('consultation_sessions')
      .update({ 
        status: 'confirmed',
        updated_at: new Date().toISOString() 
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Error confirming session:', error)
      throw new Error('Error al confirmar la sesión')
    }

    return data
  }
}
