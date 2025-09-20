// Script para probar la conexión a Supabase
// Ejecutar en la consola del navegador

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Verificando configuración de Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? '✅ Configurada' : '❌ No configurada')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas')
  console.log('Crea un archivo .env.local con:')
  console.log('VITE_SUPABASE_URL=tu_url_de_supabase')
  console.log('VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase')
} else {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // Probar conexión
  supabase
    .from('profiles')
    .select('count')
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Error de conexión:', error)
      } else {
        console.log('✅ Conexión exitosa a Supabase')
        console.log('📊 Datos encontrados:', data)
      }
    })
    .catch(err => {
      console.error('❌ Error de red:', err)
    })
}
