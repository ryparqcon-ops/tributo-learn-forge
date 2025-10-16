import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

export function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [envStatus, setEnvStatus] = useState<{
    url: boolean
    key: boolean
  }>({ url: false, key: false })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      setErrorMessage('')

      // Verificar variables de entorno
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      setEnvStatus({
        url: !!url,
        key: !!key
      })

      if (!url || !key) {
        setConnectionStatus('error')
        setErrorMessage('Variables de entorno no configuradas')
        return
      }

      // Probar conexión a Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (error) {
        setConnectionStatus('error')
        setErrorMessage(`Error de Supabase: ${error.message}`)
      } else {
        setConnectionStatus('success')
      }
    } catch (err) {
      setConnectionStatus('error')
      setErrorMessage(`Error de red: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800'
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'checking':
        return 'Verificando conexión...'
      case 'success':
        return 'Conexión exitosa'
      case 'error':
        return 'Error de conexión'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Diagnóstico de Conexión Supabase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado general */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Estado de conexión:</span>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>

        {/* Variables de entorno */}
        <div className="space-y-2">
          <h4 className="font-medium">Variables de entorno:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              {envStatus.url ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>VITE_SUPABASE_URL: {envStatus.url ? '✅ Configurada' : '❌ No configurada'}</span>
            </div>
            <div className="flex items-center gap-2">
              {envStatus.key ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>VITE_SUPABASE_ANON_KEY: {envStatus.key ? '✅ Configurada' : '❌ No configurada'}</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error:</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botón de reintento */}
        <Button 
          onClick={checkConnection} 
          disabled={connectionStatus === 'checking'}
          className="w-full"
        >
          {connectionStatus === 'checking' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            'Reintentar conexión'
          )}
        </Button>

        {/* Instrucciones */}
        {!envStatus.url || !envStatus.key ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Configuración requerida:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Crea un archivo <code className="bg-blue-100 px-1 rounded">.env.local</code> en la raíz del proyecto</li>
              <li>Agrega las siguientes variables:</li>
              <li><code className="bg-blue-100 px-1 rounded">VITE_SUPABASE_URL=https://tu-proyecto.supabase.co</code></li>
              <li><code className="bg-blue-100 px-1 rounded">VITE_SUPABASE_ANON_KEY=tu_clave_anonima</code></li>
              <li>Reinicia el servidor de desarrollo</li>
            </ol>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
