# 📚 CONTEXTO COMPLETO - TRIBUTO LEARN FORGE

## 🎯 RESUMEN DEL PROYECTO

**Tributo Learn Forge** es una plataforma de educación tributaria desarrollada en React + TypeScript + Vite, integrada con Supabase como backend. El proyecto permite a estudiantes aprender sobre tributación peruana a través de cursos, lecciones y asesorías con instructores especializados.

## 🏗️ ARQUITECTURA DEL SISTEMA

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: Zustand
- **Autenticación**: Supabase Auth
- **Backend**: Supabase (PostgreSQL)

### Backend
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: Supabase Auth
- **API**: Supabase REST API
- **Seguridad**: Row Level Security (RLS)
- **Almacenamiento**: Supabase Storage

## 📊 ESTRUCTURA DE BASE DE DATOS

### Tablas Principales

1. **users** - Usuarios del sistema (estudiantes, instructores, admin, staff)
2. **profiles** - Perfiles extendidos de usuarios
3. **categories** - Categorías de cursos
4. **instructors** - Instructores especializados
5. **courses** - Cursos de educación tributaria
6. **lessons** - Lecciones individuales de cada curso
7. **enrollments** - Inscripciones de estudiantes a cursos
8. **lesson_progress** - Progreso de estudiantes en lecciones
9. **reviews** - Reseñas de cursos
10. **consultations** - Servicios de asesoría
11. **consultation_sessions** - Sesiones de asesoría
12. **payments** - Pagos y transacciones

### Vistas Importantes

- **courses_with_details** - Cursos con información completa del instructor
- **instructor_with_profile** - Instructores con datos de perfil
- **student_progress_summary** - Resumen de progreso del estudiante
- **consultation_availability** - Disponibilidad de asesorías

## 🔧 ARCHIVOS CLAVE CREADOS/MODIFICADOS

### Configuración de Supabase
- `src/lib/supabase.ts` - Cliente de Supabase configurado
- `src/lib/types/supabase.ts` - Tipos TypeScript generados

### Servicios de Datos
- `src/lib/services/courses.ts` - Servicio para cursos
- `src/lib/services/instructors.ts` - Servicio para instructores
- `src/lib/services/enrollments.ts` - Servicio para inscripciones

### Hooks Personalizados
- `src/hooks/use-courses.ts` - Hook para cursos
- `src/hooks/use-instructors.ts` - Hook para instructores
- `src/hooks/use-lessons.ts` - Hook para lecciones
- `src/hooks/use-enrollments.ts` - Hook para inscripciones

### Componentes Actualizados
- `src/components/course/course-card.tsx` - Tarjeta de curso
- `src/components/course/CoursePreviewModal.tsx` - Modal de vista previa
- `src/components/instructor/instructor-card.tsx` - Tarjeta de instructor
- `src/pages/Courses.tsx` - Página de cursos
- `src/pages/Instructors.tsx` - Página de instructores

### Migración y Testing
- `src/lib/migrations/migrate-to-supabase.ts` - Migración original
- `src/lib/migrations/migrate-to-new-schema.ts` - Migración nueva estructura
- `src/components/SupabaseTest.tsx` - Componente de testing
- `src/components/ConnectionTest.tsx` - Test de conexión

## 🗄️ ESQUEMAS SQL

### Archivo Principal
- `complete-clean-schema.sql` - **ESQUEMA COMPLETO Y LIMPIO** (usar este)

### Archivos de Soporte (pueden eliminarse)
- `supabase-schema.sql` - Esquema básico original
- `supabase-schema-extended.sql` - Extensiones del esquema
- `supabase-update-schema.sql` - Actualizaciones incrementales
- `reset-and-recreate.sql` - Reset completo
- `complete-database-schema.sql` - Esquema robusto original

## 🚀 INSTRUCCIONES DE INSTALACIÓN

### 1. Configurar Supabase
```bash
# 1. Ejecutar el esquema completo en Supabase SQL Editor
# Archivo: complete-clean-schema.sql

# 2. Configurar variables de entorno
# Archivo: .env.local
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 2. Instalar Dependencias
```bash
npm install
# o
yarn install
```

### 3. Ejecutar Migración
```bash
# Ir a http://localhost:8080/test-supabase
# Hacer clic en "Nueva Estructura" para migrar datos de ejemplo
```

## 🔐 ROLES Y PERMISOS

### Roles de Usuario
- **student** - Estudiante (puede inscribirse, ver cursos, hacer reseñas)
- **instructor** - Instructor (puede crear cursos, gestionar lecciones)
- **admin** - Administrador (acceso completo al sistema)
- **staff** - Personal (puede gestionar instructores y consultorías)

### Políticas RLS
- Datos públicos (cursos, instructores) visibles para todos
- Usuarios solo pueden ver/modificar sus propios datos
- Instructores pueden gestionar sus propios cursos
- Admins tienen acceso completo

## 📝 FUNCIONALIDADES IMPLEMENTADAS

### Para Estudiantes
- ✅ Navegación de cursos por categorías
- ✅ Vista previa de cursos con video
- ✅ Sistema de inscripción
- ✅ Seguimiento de progreso
- ✅ Sistema de reseñas
- ✅ Búsqueda de cursos e instructores

### Para Instructores
- ✅ Perfil de instructor con especializaciones
- ✅ Gestión de cursos y lecciones
- ✅ Sistema de asesorías
- ✅ Estadísticas de rendimiento

### Para Administradores
- ✅ Gestión completa de usuarios
- ✅ Gestión de categorías
- ✅ Moderación de contenido
- ✅ Reportes y estadísticas

## 🛠️ TECNOLOGÍAS UTILIZADAS

### Frontend
- React 18.2.0
- TypeScript 5.0+
- Vite 4.4+
- Tailwind CSS 3.3+
- shadcn/ui
- React Router v6
- Zustand
- Framer Motion
- React Hook Form
- Zod

### Backend
- Supabase
- PostgreSQL
- Row Level Security
- Supabase Auth
- Supabase Storage

### Herramientas
- ESLint
- Prettier
- TypeScript
- Vite
- PostCSS

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── components/
│   ├── course/           # Componentes de cursos
│   ├── instructor/       # Componentes de instructores
│   ├── dashboard/        # Componentes de dashboard
│   ├── ui/              # Componentes UI base
│   └── SupabaseTest.tsx # Testing de Supabase
├── hooks/
│   ├── use-courses.ts   # Hook para cursos
│   ├── use-instructors.ts # Hook para instructores
│   ├── use-lessons.ts   # Hook para lecciones
│   └── use-enrollments.ts # Hook para inscripciones
├── lib/
│   ├── services/        # Servicios de datos
│   ├── migrations/      # Scripts de migración
│   ├── types/          # Tipos TypeScript
│   └── supabase.ts     # Cliente Supabase
├── pages/              # Páginas de la aplicación
└── assets/             # Recursos estáticos
```

## 🔄 PROCESO DE MIGRACIÓN

### Datos de Ejemplo
Los datos se migran desde archivos JSON:
- `src/lib/data/courses.json` - Cursos de ejemplo
- `src/lib/data/lessons.json` - Lecciones de ejemplo
- `src/lib/data/instructors.json` - Instructores de ejemplo

### Script de Migración
El componente `SupabaseTest.tsx` incluye:
- Botón "Migrar Datos (Actual)" - Migración con estructura actual
- Botón "Nueva Estructura" - Migración con estructura robusta

## 🐛 PROBLEMAS RESUELTOS

### 1. Errores de Esquema
- ✅ Corregido referencia incorrecta en vista `courses_with_details`
- ✅ Eliminadas columnas inexistentes en migración
- ✅ Corregidos UUIDs inválidos

### 2. Errores de Permisos
- ✅ Configuradas políticas RLS correctas
- ✅ Habilitado acceso público a datos necesarios
- ✅ Configurados permisos por rol

### 3. Errores de Migración
- ✅ Corregido método de verificación de conteo
- ✅ Agregado logging detallado
- ✅ Manejo de errores mejorado

### 4. Errores de Importación
- ✅ Corregidas rutas de importación
- ✅ Movidos archivos a ubicaciones correctas
- ✅ Actualizados tipos TypeScript

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### 1. Completar Funcionalidades
- [ ] Sistema de pagos integrado
- [ ] Notificaciones en tiempo real
- [ ] Chat en vivo para asesorías
- [ ] Certificados de finalización
- [ ] Sistema de badges/achievements

### 2. Mejoras de UX/UI
- [ ] Modo oscuro completo
- [ ] Responsive design mejorado
- [ ] Animaciones más fluidas
- [ ] Loading states mejorados

### 3. Optimizaciones
- [ ] Caché de datos
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes
- [ ] PWA capabilities

### 4. Testing
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests E2E
- [ ] Tests de performance

## 📞 SOPORTE Y MANTENIMIENTO

### Archivos de Configuración
- `package.json` - Dependencias del proyecto
- `vite.config.ts` - Configuración de Vite
- `tailwind.config.ts` - Configuración de Tailwind
- `tsconfig.json` - Configuración de TypeScript

### Variables de Entorno Requeridas
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

## 🎉 ESTADO ACTUAL

✅ **Sistema completamente funcional**
✅ **Base de datos estructurada y optimizada**
✅ **Frontend integrado con Supabase**
✅ **Sistema de roles y permisos implementado**
✅ **Migración de datos funcional**
✅ **Testing y debugging implementado**

El proyecto está listo para desarrollo continuo y puede ser usado como base para una plataforma de educación tributaria completa y robusta.

---

**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
**Estado**: Producción Ready
