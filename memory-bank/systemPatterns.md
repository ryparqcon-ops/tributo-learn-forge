# 🏗️ SYSTEM PATTERNS - TRIBUTO LEARN FORGE

## 🏗️ ARQUITECTURA GENERAL

### Patrón de Arquitectura
**Frontend SPA + Backend as a Service (BaaS)**
- Frontend: React SPA con routing del lado del cliente
- Backend: Supabase como BaaS con PostgreSQL
- Autenticación: Supabase Auth con JWT
- Almacenamiento: Supabase Storage para archivos multimedia

### Separación de Responsabilidades
```
Frontend (React) ←→ API Layer (Supabase) ←→ Database (PostgreSQL)
     ↓                      ↓                      ↓
UI Components          REST/GraphQL API        Data Storage
State Management       Authentication          Business Logic
Routing                Authorization           Data Validation
```

## 🏗️ PATRONES DE FRONTEND

### Arquitectura de Componentes
```
App
├── Layout (AppLayout)
│   ├── Header (Navigation)
│   ├── Sidebar (Optional)
│   └── Main Content
├── Pages (Route Components)
│   ├── Public Pages
│   └── Protected Pages
├── Components
│   ├── UI (shadcn/ui)
│   ├── Feature Components
│   └── Layout Components
└── Providers
    ├── Theme Provider
    ├── Query Client
    └── Auth Context
```

### Patrón de Estado
**Zustand + React Query**
- **Zustand**: Estado global de la aplicación (auth, UI, theme)
- **React Query**: Estado del servidor (cursos, instructores, progreso)
- **Local State**: Estado específico de componentes (forms, modals)

### Patrón de Datos
**Service Layer Pattern**
```typescript
// Servicios encapsulan la lógica de datos
coursesService.getCourses()
instructorsService.getInstructors()
enrollmentsService.enrollUser()

// Hooks personalizados para React Query
useCourses() // Hook que usa coursesService
useInstructors() // Hook que usa instructorsService
```

## 🏗️ PATRONES DE BACKEND

### Estructura de Base de Datos
**Normalized Relational Model**
```
users (auth.users)
├── profiles (extended user data)
├── instructors (specialized users)
└── enrollments (user-course relationships)

courses
├── lessons (course content)
├── reviews (user feedback)
└── categories (course classification)

consultations
├── consultation_sessions (booking details)
├── payments (transaction records)
└── reviews (session feedback)
```

### Patrón de Seguridad
**Row Level Security (RLS)**
- Políticas por tabla y operación (SELECT, INSERT, UPDATE, DELETE)
- Roles específicos: student, instructor, admin, staff
- Acceso basado en ownership y permisos

### Patrón de API
**RESTful + Real-time**
- Endpoints REST para operaciones CRUD
- Subscripciones en tiempo real para updates
- Funciones almacenadas para lógica compleja

## 🏗️ PATRONES DE COMPONENTES

### Patrón de Tarjetas
```typescript
// Componente reutilizable para mostrar entidades
<CourseCard course={course} />
<InstructorCard instructor={instructor} />
<LessonCard lesson={lesson} />
```

### Patrón de Modales
```typescript
// Modales para acciones específicas
<CoursePreviewModal course={course} />
<BookingModal consultations={consultations} />
<VideoPlayerModal video={video} />
```

### Patrón de Sistema de Asesorías
```typescript
// Componentes específicos para asesorías
<AdvisoryCard consultation={consultation} />
<DashboardAdvisory sessions={sessions} />
<BookingModal consultations={consultations} />

// Hooks para asesorías
const { consultations } = useConsultations()
const { sessions } = useUserConsultationSessions()
const { cancelSession, rateSession } = useSessionActions()
```

### Patrón de Gestión de Usuario
```typescript
// Componentes para gestión de perfil
<AccountPage />
<UserProfileForm />
<PasswordChangeDialog />
<PreferencesSettings />

// Hooks para gestión de usuario
const { profile, updateProfile } = useUserProfile()
const { preferences, updatePreferences } = useUserPreferences()
const { stats } = useUserStats()
```

### Patrón de Formularios
```typescript
// Formularios con validación
<LoginForm onSubmit={handleLogin} />
<CourseForm course={course} onSubmit={handleSubmit} />
<ReviewForm courseId={courseId} onSubmit={handleReview} />
```

## 🏗️ PATRONES DE ROUTING

### Estructura de Rutas
```
/ (Página principal)
├── /courses (Lista de cursos)
│   └── /course/:slug (Detalle de curso)
├── /instructors (Lista de instructores)
│   └── /instructor/:id (Perfil de instructor)
├── /advisory (Servicios de asesoría)
├── /pricing (Planes y precios)
├── /about (Acerca de)
├── /contact (Contacto)
├── /login (Inicio de sesión)
├── /register (Registro)
└── /dashboard/* (Área protegida)
    ├── /courses (Mis cursos)
    ├── /progress (Mi progreso)
    └── /profile (Mi perfil)
```

### Patrón de Protección de Rutas
```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 🏗️ PATRONES DE DATOS

### Patrón de Hooks Personalizados
```typescript
// Hooks que encapsulan lógica de datos
const { courses, isLoading, error } = useCourses()
const { instructors } = useInstructors()
const { enrollments } = useEnrollments()

// Hooks para asesorías
const { consultations } = useConsultations()
const { sessions } = useUserConsultationSessions()
const { cancelSession, rateSession, completeSession } = useSessionActions()

// Hooks para gestión de usuario
const { profile, updateProfile, updatePassword, deleteAccount } = useUserProfile()
const { preferences, updatePreferences } = useUserPreferences()
const { stats } = useUserStats()
```

### Patrón de Servicios
```typescript
// Servicios que encapsulan operaciones de datos
class CoursesService {
  async getCourses() { /* ... */ }
  async getCourse(slug) { /* ... */ }
  async enrollUser(courseId) { /* ... */ }
}

class ConsultationService {
  async getAvailableConsultations() { /* ... */ }
  async createConsultationSession() { /* ... */ }
  async completeSession() { /* ... */ }
  async addMeetingUrl() { /* ... */ }
}
```

### Patrón de Tipos
```typescript
// Tipos TypeScript generados desde Supabase
interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
  // ...
}
```

## 🏗️ PATRONES DE UI/UX

### Sistema de Diseño
**shadcn/ui + Tailwind CSS**
- Componentes base reutilizables
- Sistema de tokens de diseño consistente
- Tema claro/oscuro
- Responsive design mobile-first

### Patrón de Layout
```typescript
<AppLayout>
  <Header />
  <main>
    <Routes>
      {/* Páginas */}
    </Routes>
  </main>
  <Footer />
</AppLayout>
```

### Patrón de Loading States
```typescript
// Estados de carga consistentes
{isLoading ? <LoadingSpinner /> : <Content />}
```

## 🏗️ PATRONES DE TESTING

### Patrón de Testing
**MSW (Mock Service Worker)**
- Mocks de API para desarrollo
- Datos de prueba consistentes
- Testing de componentes aislado

### Patrón de Datos de Prueba
```typescript
// Datos mock en archivos JSON
courses.json
instructors.json
lessons.json
users.json
```

## 🏗️ PATRONES DE DEPLOYMENT

### Patrón de Build
**Vite + TypeScript**
- Build optimizado para producción
- Tree shaking automático
- Hot reload en desarrollo

### Patrón de Variables de Entorno
```typescript
// Configuración por ambiente
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
NODE_ENV
```

## 🏗️ PATRONES DE MIGRACIÓN

### Patrón de Migración de Datos
```typescript
// Scripts de migración estructurados
migrateToSupabase() // Migración inicial
migrateToNewSchema() // Migración de estructura
```

### Patrón de Testing de Conexión
```typescript
// Componentes de testing para verificar integración
<SupabaseTest />
<ConnectionTest />
```

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: Implementado
