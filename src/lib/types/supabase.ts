export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      consultation_sessions: {
        Row: {
          consultation_id: string
          created_at: string | null
          duration_hours: number | null
          id: string
          instructor_id: string
          instructor_rating: number | null
          meeting_url: string | null
          notes: string | null
          scheduled_at: string
          status: string | null
          student_id: string
          student_rating: number | null
          updated_at: string | null
        }
        Insert: {
          consultation_id: string
          created_at?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id: string
          instructor_rating?: number | null
          meeting_url?: string | null
          notes?: string | null
          scheduled_at: string
          status?: string | null
          student_id: string
          student_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          consultation_id?: string
          created_at?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string
          instructor_rating?: number | null
          meeting_url?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: string | null
          student_id?: string
          student_rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_sessions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultation_availability"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_sessions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_with_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          duration_hours: number | null
          id: string
          instructor_id: string
          is_available: boolean | null
          max_students: number | null
          price_per_hour: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id: string
          is_available?: boolean | null
          max_students?: number | null
          price_per_hour: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string
          is_available?: boolean | null
          max_students?: number | null
          price_per_hour?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_with_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          duration_hours: number | null
          id: string
          instructor_id: string
          is_featured: boolean | null
          is_free: boolean | null
          is_published: boolean | null
          learning_outcomes: string[] | null
          level: string
          preview_video: string | null
          price: number | null
          rating: number | null
          requirements: string[] | null
          short_description: string | null
          slug: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          total_enrollments: number | null
          total_lessons: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id: string
          is_featured?: boolean | null
          is_free?: boolean | null
          is_published?: boolean | null
          learning_outcomes?: string[] | null
          level?: string
          preview_video?: string | null
          price?: number | null
          rating?: number | null
          requirements?: string[] | null
          short_description?: string | null
          slug: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_enrollments?: number | null
          total_lessons?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string
          is_featured?: boolean | null
          is_free?: boolean | null
          is_published?: boolean | null
          learning_outcomes?: string[] | null
          level?: string
          preview_video?: string | null
          price?: number | null
          rating?: number | null
          requirements?: string[] | null
          short_description?: string | null
          slug?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_enrollments?: number | null
          total_lessons?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_with_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          enrolled_at: string | null
          id: string
          is_active: boolean | null
          progress_percentage: number | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          progress_percentage?: number | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          is_active?: boolean | null
          progress_percentage?: number | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors: {
        Row: {
          bio: string | null
          certifications: Json | null
          created_at: string | null
          education: Json | null
          experience_years: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          profile_id: string
          rating: number | null
          response_time_hours: number | null
          social_links: Json | null
          specializations: string[] | null
          teaching_style: string | null
          title: string | null
          total_courses: number | null
          total_hours_taught: number | null
          total_students: number | null
          updated_at: string | null
          work_experience: Json | null
        }
        Insert: {
          bio?: string | null
          certifications?: Json | null
          created_at?: string | null
          education?: Json | null
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          profile_id: string
          rating?: number | null
          response_time_hours?: number | null
          social_links?: Json | null
          specializations?: string[] | null
          teaching_style?: string | null
          title?: string | null
          total_courses?: number | null
          total_hours_taught?: number | null
          total_students?: number | null
          updated_at?: string | null
          work_experience?: Json | null
        }
        Update: {
          bio?: string | null
          certifications?: Json | null
          created_at?: string | null
          education?: Json | null
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          profile_id?: string
          rating?: number | null
          response_time_hours?: number | null
          social_links?: Json | null
          specializations?: string[] | null
          teaching_style?: string | null
          title?: string | null
          total_courses?: number | null
          total_hours_taught?: number | null
          total_students?: number | null
          updated_at?: string | null
          work_experience?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          lesson_id: string
          student_id: string
          updated_at: string | null
          watched_duration: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id: string
          student_id: string
          updated_at?: string | null
          watched_duration?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          lesson_id?: string
          student_id?: string
          updated_at?: string | null
          watched_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          is_published: boolean | null
          order_index: number
          resources: Json | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          is_published?: boolean | null
          order_index?: number
          resources?: Json | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          is_published?: boolean | null
          order_index?: number
          resources?: Json | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_important: boolean | null
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_important?: boolean | null
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_important?: boolean | null
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_method: string
          payment_provider: string | null
          payment_status: string | null
          provider_transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method: string
          payment_provider?: string | null
          payment_status?: string | null
          provider_transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string
          payment_provider?: string | null
          payment_status?: string | null
          provider_transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          country: string | null
          created_at: string | null
          experience_years: number | null
          full_name: string
          gender: string | null
          id: string
          is_instructor: boolean | null
          is_verified: boolean | null
          language: string | null
          phone: string | null
          social_links: Json | null
          specializations: string[] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          experience_years?: number | null
          full_name: string
          gender?: string | null
          id: string
          is_instructor?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          phone?: string | null
          social_links?: Json | null
          specializations?: string[] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          experience_years?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          is_instructor?: boolean | null
          is_verified?: boolean | null
          language?: string | null
          phone?: string | null
          social_links?: Json | null
          specializations?: string[] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          course_id: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          student_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          student_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean | null
          last_login: string | null
          password_hash: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          password_hash?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      consultation_availability: {
        Row: {
          completed_sessions: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_hours: number | null
          id: string | null
          instructor_avatar: string | null
          instructor_id: string | null
          instructor_name: string | null
          instructor_rating: number | null
          is_available: boolean | null
          max_students: number | null
          price_per_hour: number | null
          title: string | null
          total_sessions: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_with_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      courses_with_details: {
        Row: {
          actual_total_lessons: number | null
          actual_total_reviews: number | null
          avg_rating: number | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_hours: number | null
          id: string | null
          instructor_avatar: string | null
          instructor_id: string | null
          instructor_languages: string[] | null
          instructor_name: string | null
          instructor_rating: number | null
          instructor_title: string | null
          is_featured: boolean | null
          is_free: boolean | null
          is_published: boolean | null
          learning_outcomes: string[] | null
          level: string | null
          preview_video: string | null
          price: number | null
          rating: number | null
          requirements: string[] | null
          short_description: string | null
          slug: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          total_enrollments: number | null
          total_lessons: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructor_with_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_with_profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certifications: Json | null
          created_at: string | null
          education: Json | null
          experience_years: number | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          profile_bio: string | null
          profile_experience: number | null
          profile_id: string | null
          profile_social_links: Json | null
          profile_specializations: string[] | null
          rating: number | null
          response_time_hours: number | null
          social_links: Json | null
          specializations: string[] | null
          teaching_style: string | null
          title: string | null
          total_courses: number | null
          total_hours_taught: number | null
          total_students: number | null
          updated_at: string | null
          work_experience: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress_summary: {
        Row: {
          calculated_progress: number | null
          completed_at: string | null
          course_id: string | null
          course_title: string | null
          enrolled_at: string | null
          lessons_completed: number | null
          progress_percentage: number | null
          student_id: string | null
          total_lessons: number | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_course_rating: {
        Args: { course_id: string }
        Returns: number
      }
      get_instructor_stats: {
        Args: { instructor_id: string }
        Returns: Json
      }
      get_student_progress: {
        Args: { student_id: string }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// =============================================
// TIPOS LEGACY (COMPATIBILIDAD)
// =============================================

// Tipos básicos de tablas
export type User = Tables<'users'>
export type Profile = Tables<'profiles'>
export type Course = Tables<'courses'>
export type Lesson = Tables<'lessons'>
export type Instructor = Tables<'instructors'>
export type Category = Tables<'categories'>
export type Enrollment = Tables<'enrollments'>
export type Review = Tables<'reviews'>
export type Consultation = Tables<'consultations'>
export type ConsultationSession = Tables<'consultation_sessions'>
export type Payment = Tables<'payments'>
export type Notification = Tables<'notifications'>
export type SystemSetting = Tables<'system_settings'>

// Tipos de vistas
export type CourseWithDetails = Tables<'courses_with_details'>
export type InstructorWithProfile = Tables<'instructor_with_profile'>
export type ConsultationAvailability = Tables<'consultation_availability'>
export type StudentProgressSummary = Tables<'student_progress_summary'>

// Tipos de inserción
export type UserInsert = TablesInsert<'users'>
export type ProfileInsert = TablesInsert<'profiles'>
export type CourseInsert = TablesInsert<'courses'>
export type LessonInsert = TablesInsert<'lessons'>
export type InstructorInsert = TablesInsert<'instructors'>
export type CategoryInsert = TablesInsert<'categories'>
export type EnrollmentInsert = TablesInsert<'enrollments'>
export type ReviewInsert = TablesInsert<'reviews'>
export type ConsultationInsert = TablesInsert<'consultations'>
export type ConsultationSessionInsert = TablesInsert<'consultation_sessions'>
export type PaymentInsert = TablesInsert<'payments'>
export type NotificationInsert = TablesInsert<'notifications'>
export type SystemSettingInsert = TablesInsert<'system_settings'>

// Tipos de actualización
export type UserUpdate = TablesUpdate<'users'>
export type ProfileUpdate = TablesUpdate<'profiles'>
export type CourseUpdate = TablesUpdate<'courses'>
export type LessonUpdate = TablesUpdate<'lessons'>
export type InstructorUpdate = TablesUpdate<'instructors'>
export type CategoryUpdate = TablesUpdate<'categories'>
export type EnrollmentUpdate = TablesUpdate<'enrollments'>
export type ReviewUpdate = TablesUpdate<'reviews'>
export type ConsultationUpdate = TablesUpdate<'consultations'>
export type ConsultationSessionUpdate = TablesUpdate<'consultation_sessions'>
export type PaymentUpdate = TablesUpdate<'payments'>
export type NotificationUpdate = TablesUpdate<'notifications'>
export type SystemSettingUpdate = TablesUpdate<'system_settings'>

// =============================================
// TIPOS COMPUESTOS
// =============================================

// InstructorWithProfile ya está definido arriba como Tables<'instructor_with_profile'>