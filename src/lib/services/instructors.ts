import { supabase } from '../supabase'
import type { 
  Instructor, 
  InstructorInsert, 
  InstructorUpdate,
  InstructorWithProfile,
  Profile,
  ProfileInsert,
  ProfileUpdate
} from '../types/supabase'

// =============================================
// SERVICIOS DE INSTRUCTORES
// =============================================

export class InstructorService {
  // Obtener todos los instructores activos
  static async getActiveInstructors(): Promise<InstructorWithProfile[]> {
    const { data, error } = await supabase
      .from('instructor_with_profile')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching instructors:', error)
      throw new Error('Error al obtener los instructores')
    }

    return data || []
  }

  // Obtener instructores destacados
  static async getFeaturedInstructors(): Promise<InstructorWithProfile[]> {
    const { data, error } = await supabase
      .from('instructor_with_profile')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured instructors:', error)
      throw new Error('Error al obtener los instructores destacados')
    }

    return data || []
  }

  // Obtener instructor por ID
  static async getInstructorById(id: string): Promise<InstructorWithProfile | null> {
    const { data, error } = await supabase
      .from('instructor_with_profile')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching instructor:', error)
      throw new Error('Error al obtener el instructor')
    }

    return data
  }

  // Obtener instructor por profile_id
  static async getInstructorByProfileId(profileId: string): Promise<InstructorWithProfile | null> {
    const { data, error } = await supabase
      .from('instructor_with_profile')
      .select('*')
      .eq('profile_id', profileId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching instructor by profile:', error)
      throw new Error('Error al obtener el instructor')
    }

    return data
  }

  // Buscar instructores
  static async searchInstructors(query: string, filters?: {
    specializations?: string[]
    minRating?: number
    experienceMin?: number
  }): Promise<InstructorWithProfile[]> {
    let queryBuilder = supabase
      .from('instructors')
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url,
          bio,
          phone,
          country,
          city
        )
      `)
      .eq('is_active', true)

    // Búsqueda por texto
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,bio.ilike.%${query}%`)
    }

    // Filtros
    if (filters?.specializations && filters.specializations.length > 0) {
      queryBuilder = queryBuilder.overlaps('specializations', filters.specializations)
    }

    if (filters?.minRating !== undefined) {
      queryBuilder = queryBuilder.gte('rating', filters.minRating)
    }

    if (filters?.experienceMin !== undefined) {
      queryBuilder = queryBuilder.gte('experience_years', filters.experienceMin)
    }

    const { data, error } = await queryBuilder.order('rating', { ascending: false })

    if (error) {
      console.error('Error searching instructors:', error)
      throw new Error('Error al buscar instructores')
    }

    return data || []
  }

  // Crear instructor
  static async createInstructor(instructorData: InstructorInsert): Promise<Instructor> {
    const { data, error } = await supabase
      .from('instructors')
      .insert(instructorData)
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url,
          bio,
          phone,
          country,
          city
        )
      `)
      .single()

    if (error) {
      console.error('Error creating instructor:', error)
      throw new Error('Error al crear el instructor')
    }

    return data
  }

  // Actualizar instructor
  static async updateInstructor(id: string, instructorData: InstructorUpdate): Promise<Instructor> {
    const { data, error } = await supabase
      .from('instructors')
      .update(instructorData)
      .eq('id', id)
      .select(`
        *,
        profiles (
          id,
          full_name,
          avatar_url,
          bio,
          phone,
          country,
          city
        )
      `)
      .single()

    if (error) {
      console.error('Error updating instructor:', error)
      throw new Error('Error al actualizar el instructor')
    }

    return data
  }

  // Actualizar perfil de instructor
  static async updateInstructorProfile(profileId: string, profileData: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      console.error('Error updating instructor profile:', error)
      throw new Error('Error al actualizar el perfil del instructor')
    }

    return data
  }

  // Eliminar instructor
  static async deleteInstructor(id: string): Promise<void> {
    const { error } = await supabase
      .from('instructors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting instructor:', error)
      throw new Error('Error al eliminar el instructor')
    }
  }

  // Obtener estadísticas del instructor
  static async getInstructorStats(instructorId: string): Promise<{
    totalCourses: number
    totalStudents: number
    totalHours: number
    averageRating: number
  }> {
    const { data, error } = await supabase
      .from('instructors')
      .select('total_courses, total_students, total_hours_taught, rating')
      .eq('id', instructorId)
      .single()

    if (error) {
      console.error('Error fetching instructor stats:', error)
      throw new Error('Error al obtener las estadísticas del instructor')
    }

    return {
      totalCourses: data.total_courses,
      totalStudents: data.total_students,
      totalHours: data.total_hours_taught,
      averageRating: data.rating
    }
  }
}

// =============================================
// SERVICIOS DE PERFILES
// =============================================

export class ProfileService {
  // Obtener perfil por ID
  static async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching profile:', error)
      throw new Error('Error al obtener el perfil')
    }

    return data
  }

  // Crear perfil
  static async createProfile(profileData: ProfileInsert): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw new Error('Error al crear el perfil')
    }

    return data
  }

  // Actualizar perfil
  static async updateProfile(id: string, profileData: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw new Error('Error al actualizar el perfil')
    }

    return data
  }

  // Obtener perfil actual del usuario autenticado
  static async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    return this.getProfileById(user.id)
  }

  // Convertir usuario en instructor
  static async becomeInstructor(profileId: string, instructorData: Omit<InstructorInsert, 'profile_id'>): Promise<Instructor> {
    // Primero actualizar el perfil para marcar como instructor
    await this.updateProfile(profileId, { is_instructor: true })

    // Luego crear el registro de instructor
    return InstructorService.createInstructor({
      ...instructorData,
      profile_id: profileId
    })
  }
}
