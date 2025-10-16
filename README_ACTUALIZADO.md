# 🎓 Tributo Learn Forge

Plataforma de educación tributaria desarrollada en React + TypeScript + Supabase.

## 🚀 Inicio Rápido

### 1. Configurar Supabase

1. **Crear proyecto en Supabase**: https://supabase.com
2. **Ejecutar esquema SQL**:
   - Ir al SQL Editor en Supabase
   - Ejecutar el archivo `complete-clean-schema.sql`
   - Verificar que se crearon 11 tablas y 4 vistas

3. **Configurar variables de entorno**:
   ```bash
   # Crear archivo .env.local
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
   ```

### 2. Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ir a http://localhost:8080/test-supabase
# Hacer clic en "Nueva Estructura" para migrar datos de ejemplo
```

## 📁 Archivos Principales

### Esquema de Base de Datos
- `complete-clean-schema.sql` - **ESQUEMA COMPLETO** (usar este)

### Documentación
- `CONTEXTO_COMPLETO_TRIBUTO_LEARN.md` - Guía completa del proyecto
- `INSTRUCCIONES_MIGRACION.md` - Instrucciones de migración

### Configuración
- `src/lib/supabase.ts` - Cliente Supabase
- `src/lib/types/supabase.ts` - Tipos TypeScript

## 🎯 Funcionalidades

- ✅ Cursos de educación tributaria
- ✅ Sistema de instructores especializados
- ✅ Asesorías personalizadas
- ✅ Seguimiento de progreso
- ✅ Sistema de reseñas
- ✅ Roles de usuario (estudiante, instructor, admin, staff)
- ✅ Sistema de pagos
- ✅ Dashboard completo

## 🔧 Comandos

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

## 📞 Soporte

Para más detalles, consultar `CONTEXTO_COMPLETO_TRIBUTO_LEARN.md`

---

**Estado**: ✅ Producción Ready
**Versión**: 1.0.0
