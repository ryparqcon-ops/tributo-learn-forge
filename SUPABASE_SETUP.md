# Configuración de Supabase para Tributo Learn Forge

## 📋 Resumen

Este documento explica cómo configurar y migrar el sistema de Tributo Learn Forge para usar Supabase como base de datos principal, reemplazando los archivos JSON estáticos.

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anónima

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Ejecutar Esquemas de Base de Datos

Ejecuta los siguientes archivos SQL en el editor SQL de Supabase:

1. **Primero**: `supabase-schema.sql` - Estructura básica de tablas
2. **Segundo**: `supabase-schema-extended.sql` - Índices, triggers y políticas

## 📊 Migración de Datos

### Opción 1: Migración Automática (Recomendada)

1. Abre la consola del navegador en tu aplicación
2. Ejecuta: `runMigration()`
3. Verifica que los datos se migraron correctamente

### Opción 2: Migración Manual

Si prefieres migrar manualmente, puedes usar el componente de prueba:

1. Ve a `/test-supabase` en tu aplicación
2. Haz clic en "Migrar datos JSON a Supabase"
3. Verifica el estado de la migración

## 🔧 Estructura de la Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuarios
- **instructors**: Instructores con información detallada
- **categories**: Categorías de cursos
- **courses**: Cursos con relaciones completas
- **lessons**: Lecciones de cada curso
- **enrollments**: Inscripciones de usuarios
- **lesson_progress**: Progreso de lecciones
- **reviews**: Reseñas de cursos
- **advisory_bookings**: Citas de asesoría

### Relaciones

- Un instructor tiene un perfil (1:1)
- Un curso pertenece a un instructor (N:1)
- Un curso puede tener una categoría (N:1)
- Un curso tiene muchas lecciones (1:N)
- Un usuario puede inscribirse en muchos cursos (N:N)
- Un usuario puede tener progreso en muchas lecciones (N:N)

## 🎯 Funcionalidades Implementadas

### Servicios Disponibles

- **CourseService**: Gestión completa de cursos
- **LessonService**: Gestión de lecciones
- **InstructorService**: Gestión de instructores
- **EnrollmentService**: Gestión de inscripciones
- **LessonProgressService**: Seguimiento de progreso
- **ReviewService**: Sistema de reseñas

### Hooks Personalizados

- `useCourses()`: Obtener todos los cursos
- `useFeaturedCourses()`: Cursos destacados
- `useCourse(slug)`: Curso específico por slug
- `useInstructors()`: Lista de instructores
- `useLessons(courseId)`: Lecciones de un curso
- `useUserEnrollments()`: Inscripciones del usuario
- `useCourseProgress(courseId)`: Progreso de un curso

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen políticas de seguridad configuradas:

- Los usuarios solo pueden ver sus propios datos
- Los cursos publicados son visibles para todos
- Los instructores pueden gestionar sus propios cursos
- Las reseñas son públicas pero solo los usuarios inscritos pueden crear

### Políticas Implementadas

- Lectura pública de cursos e instructores activos
- Escritura restringida a propietarios
- Validación de inscripciones antes de reseñas
- Protección de datos personales

## 📈 Triggers y Funciones

### Actualización Automática

- **update_updated_at_column()**: Actualiza timestamps automáticamente
- **update_instructor_stats()**: Actualiza estadísticas de instructores
- **update_course_progress()**: Calcula progreso de cursos automáticamente

### Vistas Útiles

- **courses_with_details**: Cursos con información completa del instructor
- **user_progress**: Progreso de usuarios con estadísticas

## 🧪 Pruebas

### Componente de Prueba

El componente `SupabaseTest` permite:

- Verificar conexión a Supabase
- Migrar datos automáticamente
- Ver estadísticas de datos migrados
- Probar hooks y servicios

### Verificación Manual

1. Verifica que los cursos se cargan correctamente
2. Comprueba que los instructores aparecen con sus datos
3. Confirma que las lecciones se asocian correctamente
4. Prueba la funcionalidad de inscripciones

## 🚨 Solución de Problemas

### Errores Comunes

1. **Error de conexión**: Verifica las variables de entorno
2. **Datos no aparecen**: Ejecuta la migración de datos
3. **Permisos denegados**: Verifica las políticas RLS
4. **Tipos TypeScript**: Asegúrate de que los tipos estén actualizados

### Logs Útiles

- Revisa la consola del navegador para errores
- Verifica los logs de Supabase en el dashboard
- Usa el componente de prueba para diagnóstico

## 📚 Próximos Pasos

1. **Autenticación**: Implementar sistema de login/registro
2. **Pagos**: Integrar sistema de pagos
3. **Notificaciones**: Sistema de notificaciones en tiempo real
4. **Analytics**: Dashboard de estadísticas
5. **API**: Endpoints REST para integraciones externas

## 🔄 Migración desde JSON

### Archivos JSON Reemplazados

- `src/lib/data/courses.json` → Base de datos Supabase
- `src/lib/data/lessons.json` → Base de datos Supabase  
- `src/lib/data/instructors.json` → Base de datos Supabase

### Compatibilidad

Los componentes existentes han sido actualizados para usar los nuevos tipos de Supabase manteniendo la compatibilidad con la interfaz existente.

## 📞 Soporte

Si encuentras problemas:

1. Revisa este documento
2. Verifica los logs de error
3. Usa el componente de prueba para diagnóstico
4. Consulta la documentación de Supabase

---

**¡El sistema está listo para usar Supabase como base de datos principal!** 🎉
