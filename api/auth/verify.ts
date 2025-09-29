import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Crear cliente con service role key para verificar el token
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verificar el token JWT
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Obtener datos del perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.user_metadata?.full_name || 'Usuario',
        role: profile?.role || 'student',
        enrolled: profile?.enrolled_courses || [],
        progress: profile?.course_progress || {},
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url,
        phone: profile?.phone,
        location: profile?.location,
        bio: profile?.bio,
        company: profile?.company,
        position: profile?.position,
        website: profile?.website,
      },
      valid: true
    })

  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}












