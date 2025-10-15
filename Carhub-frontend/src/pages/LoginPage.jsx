import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import Button from '../components/Button'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { updateAuthState } = useAuth()

  useEffect(() => {
    // Mostrar mensaje de registro exitoso si viene del registro
    if (location.state?.message) {
      toast.success(location.state.message)
    }
  }, [location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Actualizar estado de autenticación
        updateAuthState()
        
        toast.success('¡Bienvenido! Has iniciado sesión correctamente.')
        
        // Navegar al dashboard después de un pequeño delay para asegurar que el estado se actualice
        setTimeout(() => {
          navigate('/dashboard')
        }, 100)
      } else {
        // Mostrar error persistente para credenciales incorrectas
        const errorMessage = result.error || 'Error de autenticación'
        
        // Toast persistente para errores de credenciales
        toast.error(errorMessage, {
          duration: 8000, // 8 segundos
          style: {
            background: '#dc2626',
            color: '#fff',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
          },
        })
        
        setError(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.'
      
      // Toast persistente para errores de conexión
      toast.error(errorMessage, {
        duration: 10000, // 10 segundos para errores de conexión
        style: {
          background: '#dc2626',
          color: '#fff',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#dc2626',
        },
      })
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-blue-500/20 rounded-full border border-blue-400/30">
              <img src="/icono.svg" alt="Logo" className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-700">
              Iniciar Sesión
            </h2>
            
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="Dirección de email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <PasswordField
                label="Contraseña"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-300 hover:text-blue-600 transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
