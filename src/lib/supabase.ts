import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Tipos legacy para compatibilidad
export interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: User
}


