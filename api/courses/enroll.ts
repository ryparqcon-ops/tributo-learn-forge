import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const { token, courseId } = await request.json()

    if (!token || !courseId) {
      return NextResponse.json(
        { error: 'Token and courseId are required' },
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
      .select('enrolled_courses')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Verificar si ya está inscrito
    const enrolledCourses = profile.enrolled_courses || []
    if (enrolledCourses.includes(courseId)) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    // Agregar curso a la lista de inscritos
    const updatedCourses = [...enrolledCourses, courseId]
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        enrolled_courses: updatedCourses,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to enroll in course' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      enrolledCourses: updatedCourses
    })

  } catch (error) {
    console.error('Error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}












