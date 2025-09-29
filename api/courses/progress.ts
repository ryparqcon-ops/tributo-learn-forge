import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { token, courseId, progress } = await request.json()

    if (!token || !courseId || progress === undefined) {
      return NextResponse.json(
        { error: 'Token, courseId and progress are required' },
        { status: 400 }
      )
    }

    // Crear cliente con service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verificar el token JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Obtener perfil actual del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('course_progress')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Actualizar progreso del curso
    const courseProgress = profile.course_progress || {}
    courseProgress[courseId] = Math.min(100, Math.max(0, progress)) // Asegurar que esté entre 0-100
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        course_progress: courseProgress,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      courseProgress
    })

  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}












