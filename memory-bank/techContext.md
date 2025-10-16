# 🛠️ TECH CONTEXT - TRIBUTO LEARN FORGE

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **React 18.3.1**: Framework principal con hooks y functional components
- **TypeScript 5.8.3**: Tipado estático para mayor robustez
- **Vite 5.4.19**: Build tool moderno con HMR y optimizaciones
- **React Router v6.30.1**: Routing del lado del cliente
- **Tailwind CSS 3.4.17**: Framework de estilos utility-first
- **shadcn/ui**: Sistema de componentes basado en Radix UI

### Backend & Database
- **Supabase**: Backend as a Service (BaaS)
- **PostgreSQL**: Base de datos relacional
- **Supabase Auth**: Autenticación y autorización
- **Supabase Storage**: Almacenamiento de archivos
- **Row Level Security (RLS)**: Seguridad a nivel de fila

### State Management
- **Zustand 5.0.8**: Estado global ligero
- **React Query 5.89.0**: Estado del servidor y caché
- **React Hook Form 7.63.0**: Manejo de formularios
- **Zod 4.1.9**: Validación de esquemas

### UI & Styling
- **Radix UI**: Componentes primitivos accesibles
- **Lucide React**: Iconografía consistente
- **Framer Motion 12.23.15**: Animaciones fluidas
- **Next Themes 0.3.0**: Manejo de temas claro/oscuro
- **Tailwind Merge**: Utilidad para combinar clases CSS

### Development Tools
- **ESLint 9.32.0**: Linting de código
- **TypeScript ESLint**: Linting específico para TypeScript
- **Prettier**: Formateo de código
- **MSW 2.11.2**: Mock Service Worker para testing
- **Lovable Tagger**: Herramienta de etiquetado

## 🛠️ CONFIGURACIÓN DE DESARROLLO

### Scripts Disponibles
```json
{
  "dev": "vite",                    // Servidor de desarrollo
  "build": "vite build",           // Build de producción
  "build:dev": "vite build --mode development",
  "build:force": "rm -rf dist && vite build",
  "build:vercel": "rm -rf dist && rm -rf node_modules/.vite && vite build",
  "lint": "eslint .",              // Linting
  "preview": "vite preview"        // Preview del build
}
```

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
NODE_ENV=development|production
```

### Configuración de Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## 🛠️ ARQUITECTURA DE CARPETAS

### Estructura del Proyecto
```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── course/          # Componentes específicos de cursos
│   ├── instructor/      # Componentes específicos de instructores
│   ├── dashboard/       # Componentes del dashboard
│   ├── advisory/        # Componentes específicos de asesorías
│   ├── auth/           # Componentes de autenticación
│   └── layout/         # Componentes de layout
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades y configuración
│   ├── services/       # Servicios de datos
│   ├── types/          # Tipos TypeScript
│   ├── store/          # Stores de Zustand
│   └── migrations/     # Scripts de migración
├── pages/              # Páginas de la aplicación
├── assets/             # Recursos estáticos
└── main.tsx           # Punto de entrada
```

## 🛠️ CONFIGURACIÓN DE SUPABASE

### Cliente Supabase
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/supabase'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)
```

### Tipos TypeScript
- **Generados automáticamente** desde Supabase
- **Tipos legacy** para compatibilidad
- **Interfaces personalizadas** para componentes

## 🛠️ CONFIGURACIÓN DE TAILWIND

### Configuración Base
```typescript
// tailwind.config.ts
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Configuración personalizada
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### Sistema de Colores
- **Primary**: Colores principales de la marca
- **Secondary**: Colores secundarios
- **Muted**: Colores para texto secundario
- **Accent**: Colores de acento
- **Destructive**: Colores para errores

## 🛠️ CONFIGURACIÓN DE TYPESCRIPT

### Configuración Base
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🛠️ CONFIGURACIÓN DE ESLINT

### Reglas Configuradas
```javascript
// eslint.config.js
export default [
  {
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "warn"
    }
  }
]
```

## 🛠️ DEPENDENCIAS PRINCIPALES

### Core Dependencies
- **@supabase/supabase-js**: Cliente de Supabase
- **@tanstack/react-query**: Manejo de estado del servidor
- **zustand**: Estado global
- **react-router-dom**: Routing
- **framer-motion**: Animaciones

### UI Dependencies
- **@radix-ui/react-***: Componentes primitivos
- **class-variance-authority**: Variantes de componentes
- **clsx**: Utilidad para clases CSS
- **tailwind-merge**: Merge de clases Tailwind
- **lucide-react**: Iconos

### Form Dependencies
- **react-hook-form**: Manejo de formularios
- **@hookform/resolvers**: Resolvers para validación
- **zod**: Validación de esquemas

## 🛠️ HERRAMIENTAS DE DESARROLLO

### Mock Service Worker
```typescript
// src/lib/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

### Datos de Prueba
- **courses.json**: Cursos de ejemplo
- **instructors.json**: Instructores de ejemplo
- **lessons.json**: Lecciones de ejemplo
- **users.json**: Usuarios de ejemplo
- **consultations.json**: Asesorías de ejemplo
- **consultation_sessions.json**: Sesiones de asesoría de ejemplo
- **user_preferences.json**: Preferencias de usuario de ejemplo

## 🛠️ CONFIGURACIÓN DE BUILD

### Vite Build
- **Tree shaking** automático
- **Code splitting** por rutas
- **Asset optimization**
- **Source maps** en desarrollo

### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": "dist"
}
```

## 🛠️ CONFIGURACIÓN DE BASE DE DATOS

### Esquema SQL
- **Archivo principal**: `complete-clean-schema.sql`
- **Migraciones**: Scripts en `src/lib/migrations/`
- **Testing**: Componente `SupabaseTest.tsx`

### Políticas RLS
- **Público**: Cursos, instructores, categorías, asesorías disponibles
- **Privado**: Datos de usuario, progreso, pagos, sesiones de asesoría
- **Roles**: student, instructor, admin, staff

## 🛠️ SISTEMA DE ASESORÍAS

### Servicios Implementados
- **ConsultationService**: Gestión completa de asesorías
- **useConsultations**: Hook para obtener asesorías disponibles
- **useUserConsultationSessions**: Hook para sesiones del usuario
- **useSessionActions**: Hook para acciones de sesión (cancelar, calificar, completar)

### Componentes de Asesorías
- **BookingModal**: Modal de reserva con selección de instructor
- **DashboardAdvisory**: Componente del dashboard para gestión de asesorías
- **Advisory.tsx**: Página principal de asesorías

### Flujo de Datos
```
Supabase → ConsultationService → Hooks → Componentes → UI
```

### Estados de Sesión
- **scheduled**: Sesión programada
- **confirmed**: Sesión confirmada
- **in_progress**: Sesión en progreso
- **completed**: Sesión completada
- **cancelled**: Sesión cancelada

## 🛠️ SISTEMA DE GESTIÓN DE USUARIO

### Hooks Implementados
- **useUserProfile**: Gestión completa de perfil de usuario
- **useUserPreferences**: Preferencias de notificaciones y privacidad
- **useUserStats**: Estadísticas dinámicas del usuario

### Funcionalidades de Perfil
- **Edición de perfil**: Actualización de datos personales y profesionales
- **Cambio de contraseña**: Integración con Supabase Auth
- **Eliminación de cuenta**: Cleanup completo de datos
- **Estadísticas personales**: Métricas de cursos y asesorías

### Preferencias de Usuario
- **Notificaciones**: Email, push, SMS, marketing
- **Privacidad**: Control de información visible
- **Persistencia**: Cambios guardados en tiempo real
- **Auto-creación**: Preferencias por defecto si no existen

### Base de Datos
- **Tabla user_preferences**: Preferencias con RLS habilitado
- **Políticas de seguridad**: Usuarios solo ven sus propias preferencias
- **Triggers automáticos**: updated_at se actualiza automáticamente

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: Configurado
