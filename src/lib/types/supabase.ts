// =============================================
// TIPOS DE BASE DE DATOS SUPABASE
// =============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          company: string | null
          job_title: string | null
          experience_years: number
          specializations: string[] | null
          social_links: Record<string, any>
          preferences: Record<string, any>
          is_instructor: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          experience_years?: number
          specializations?: string[] | null
          social_links?: Record<string, any>
          preferences?: Record<string, any>
          is_instructor?: boolean
          is_verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          experience_years?: number
          specializations?: string[] | null
          social_links?: Record<string, any>
          preferences?: Record<string, any>
          is_instructor?: boolean
          is_verified?: boolean
        }
      }
      instructors: {
        Row: {
          id: string
          profile_id: string
          title: string
          experience_years: number
          bio: string
          specializations: string[]
          education: Record<string, any>[]
          certifications: Record<string, any>[]
          work_experience: Record<string, any>[]
          social_links: Record<string, any>
          teaching_style: string | null
          languages: string[]
          rating: number
          total_students: number
          total_courses: number
          total_hours_taught: number
          response_time_hours: number
          is_verified: boolean
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          experience_years: number
          bio: string
          specializations: string[]
          education?: Record<string, any>[]
          certifications?: Record<string, any>[]
          work_experience?: Record<string, any>[]
          social_links?: Record<string, any>
          teaching_style?: string | null
          languages?: string[]
          rating?: number
          total_students?: number
          total_courses?: number
          total_hours_taught?: number
          response_time_hours?: number
          is_verified?: boolean
          is_featured?: boolean
          is_active?: boolean
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          experience_years?: number
          bio?: string
          specializations?: string[]
          education?: Record<string, any>[]
          certifications?: Record<string, any>[]
          work_experience?: Record<string, any>[]
          social_links?: Record<string, any>
          teaching_style?: string | null
          languages?: string[]
          rating?: number
          total_students?: number
          total_courses?: number
          total_hours_taught?: number
          response_time_hours?: number
          is_verified?: boolean
          is_featured?: boolean
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          is_active?: boolean
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          description: string | null
          instructor_id: string
          category_id: string | null
          price_cents: number
          currency: string
          duration_minutes: number
          avg_lesson_time: number
          thumbnail: string | null
          preview_video: string | null
          preview_duration: number
          level: 'Principiante' | 'Intermedio' | 'Avanzado'
          language: string
          tags: string[]
          rating: number
          students_enrolled: number
          ai_enabled: boolean
          certificate: boolean
          lifetime_access: boolean
          is_published: boolean
          is_featured: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary: string
          description?: string | null
          instructor_id: string
          category_id?: string | null
          price_cents?: number
          currency?: string
          duration_minutes?: number
          avg_lesson_time?: number
          thumbnail?: string | null
          preview_video?: string | null
          preview_duration?: number
          level: 'Principiante' | 'Intermedio' | 'Avanzado'
          language?: string
          tags?: string[]
          rating?: number
          students_enrolled?: number
          ai_enabled?: boolean
          certificate?: boolean
          lifetime_access?: boolean
          is_published?: boolean
          is_featured?: boolean
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string
          description?: string | null
          instructor_id?: string
          category_id?: string | null
          price_cents?: number
          currency?: string
          duration_minutes?: number
          avg_lesson_time?: number
          thumbnail?: string | null
          preview_video?: string | null
          preview_duration?: number
          level?: 'Principiante' | 'Intermedio' | 'Avanzado'
          language?: string
          tags?: string[]
          rating?: number
          students_enrolled?: number
          ai_enabled?: boolean
          certificate?: boolean
          lifetime_access?: boolean
          is_published?: boolean
          is_featured?: boolean
          published_at?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string
          duration_minutes: number
          video_url: string | null
          thumbnail: string | null
          transcript: string | null
          objectives: string[]
          resources: Record<string, any>[]
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description: string
          duration_minutes?: number
          video_url?: string | null
          thumbnail?: string | null
          transcript?: string | null
          objectives?: string[]
          resources?: Record<string, any>[]
          order_index?: number
          is_published?: boolean
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          duration_minutes?: number
          video_url?: string | null
          thumbnail?: string | null
          transcript?: string | null
          objectives?: string[]
          resources?: Record<string, any>[]
          order_index?: number
          is_published?: boolean
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
          last_accessed_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          last_accessed_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          last_accessed_at?: string
          is_active?: boolean
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          course_id: string
          is_completed: boolean
          watch_time_seconds: number
          completed_at: string | null
          last_watched_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          course_id: string
          is_completed?: boolean
          watch_time_seconds?: number
          completed_at?: string | null
          last_watched_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          course_id?: string
          is_completed?: boolean
          watch_time_seconds?: number
          completed_at?: string | null
          last_watched_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          course_id: string
          rating: number
          title: string | null
          comment: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          rating: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
        }
      }
      advisory_bookings: {
        Row: {
          id: string
          user_id: string
          instructor_id: string
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          meeting_url: string | null
          notes: string | null
          price_cents: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          instructor_id: string
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          meeting_url?: string | null
          notes?: string | null
          price_cents?: number
          currency?: string
        }
        Update: {
          id?: string
          user_id?: string
          instructor_id?: string
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          meeting_url?: string | null
          notes?: string | null
          price_cents?: number
          currency?: string
        }
      }
    }
    Views: {
      courses_with_details: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          description: string | null
          instructor_id: string
          category_id: string | null
          price_cents: number
          currency: string
          duration_minutes: number
          avg_lesson_time: number
          thumbnail: string | null
          preview_video: string | null
          preview_duration: number
          level: 'Principiante' | 'Intermedio' | 'Avanzado'
          language: string
          tags: string[]
          rating: number
          students_enrolled: number
          ai_enabled: boolean
          certificate: boolean
          lifetime_access: boolean
          is_published: boolean
          is_featured: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          instructor_name: string
          instructor_title: string
          instructor_avatar: string | null
          instructor_rating: number
          category_name: string | null
          category_slug: string | null
          total_lessons: number
          avg_rating: number
          total_reviews: number
        }
      }
      user_progress: {
        Row: {
          user_id: string
          course_id: string
          course_title: string
          course_thumbnail: string | null
          progress_percentage: number
          enrolled_at: string
          completed_at: string | null
          completed_lessons: number
          total_lessons: number
        }
      }
    }
  }
}

// =============================================
// TIPOS DE APLICACIÓN
// =============================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Instructor = Database['public']['Tables']['instructors']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type AdvisoryBooking = Database['public']['Tables']['advisory_bookings']['Row']

export type CourseWithDetails = Database['public']['Views']['courses_with_details']['Row']
export type UserProgress = Database['public']['Views']['user_progress']['Row']

// =============================================
// TIPOS DE INSERCIÓN
// =============================================

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type InstructorInsert = Database['public']['Tables']['instructors']['Insert']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type LessonInsert = Database['public']['Tables']['lessons']['Insert']
export type EnrollmentInsert = Database['public']['Tables']['enrollments']['Insert']
export type LessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type AdvisoryBookingInsert = Database['public']['Tables']['advisory_bookings']['Insert']

// =============================================
// TIPOS DE ACTUALIZACIÓN
// =============================================

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type InstructorUpdate = Database['public']['Tables']['instructors']['Update']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']
export type LessonUpdate = Database['public']['Tables']['lessons']['Update']
export type EnrollmentUpdate = Database['public']['Tables']['enrollments']['Update']
export type LessonProgressUpdate = Database['public']['Tables']['lesson_progress']['Update']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
export type AdvisoryBookingUpdate = Database['public']['Tables']['advisory_bookings']['Update']
