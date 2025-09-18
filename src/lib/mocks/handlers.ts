import { http, HttpResponse } from 'msw';
import coursesData from '../data/courses.json';
import lessonsData from '../data/lessons.json';
import usersData from '../data/users.json';
import bookingsData from '../data/bookings.json';

export const handlers = [
  // Courses endpoints
  http.get('/api/courses', () => {
    return HttpResponse.json(coursesData);
  }),

  http.get('/api/courses/:slug', ({ params }) => {
    const { slug } = params;
    const course = coursesData.find(c => c.slug === slug);
    
    if (!course) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Add lessons to course data
    const courseLessons = lessonsData.filter(l => course.lessons.includes(l.id));
    const courseWithLessons = {
      ...course,
      lessons: courseLessons
    };
    
    return HttpResponse.json(courseWithLessons);
  }),

  // User endpoints
  http.get('/api/users/me', () => {
    return HttpResponse.json(usersData[0]);
  }),

  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    // Mock authentication - in real app, validate credentials
    if (email && password) {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: usersData[0]
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ message: 'Invalid credentials' }), 
      { status: 401 }
    );
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const userData = await request.json() as any;
    
    // Mock registration
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email,
      role: 'student' as const,
      enrolled: [],
      progress: {},
      avatar: `https://i.pravatar.cc/100?u=${userData.email}`
    };
    
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: newUser
    });
  }),

  // Course enrollment
  http.post('/api/enroll', async ({ request }) => {
    const { courseId } = await request.json() as { courseId: string };
    
    return HttpResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      courseId
    });
  }),

  // Bookings
  http.get('/api/bookings', () => {
    return HttpResponse.json(bookingsData);
  }),

  http.post('/api/bookings', async ({ request }) => {
    const bookingData = await request.json() as any;
    
    const newBooking = {
      id: `meet_${Date.now()}`,
      type: bookingData.type || '1:1_advisory',
      title: bookingData.title || 'Advisory Session',
      host: 'inst1',
      attendee: bookingData.attendee || 'user_123',
      start: bookingData.start,
      duration_minutes: bookingData.duration_minutes || 60,
      meeting_url: null,
      status: 'confirmed' as const
    };
    
    return HttpResponse.json(newBooking);
  }),

  // Stripe payments
  http.post('/api/payments/stripe-session', async ({ request }) => {
    const { courseId, priceId } = await request.json() as { courseId: string; priceId: string };
    
    // Mock Stripe session
    return HttpResponse.json({
      sessionId: 'cs_mock_session_id',
      url: `https://checkout.stripe.com/pay/cs_mock_session_id#fidkdWxhJGlhbHYlMnBWaWEjYWJ`
    });
  }),

  // Sabio-IA enrichment
  http.post('/api/sabio-enrich', async ({ request }) => {
    const { lessonId, content } = await request.json() as { lessonId: string; content: string };
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return HttpResponse.json({
      summary: "Resumen mock de Sabio-IA sobre la norma X. Esta lección cubre aspectos fundamentales de las obligaciones tributarias, incluyendo los plazos de presentación, formularios requeridos y sanciones por incumplimiento.",
      sources: [
        { 
          title: "Resolución SUNAT 123-2024", 
          url: "#", 
          date: "2024-11-01" 
        },
        { 
          title: "Texto Único Ordenado del Código Tributario", 
          url: "#", 
          date: "2024-10-15" 
        }
      ],
      confidence: 0.92,
      timestamp: new Date().toISOString(),
      recommendations: [
        "Revisar las fechas límite de presentación",
        "Validar la documentación requerida",
        "Considerar las implicancias fiscales"
      ]
    });
  }),
];