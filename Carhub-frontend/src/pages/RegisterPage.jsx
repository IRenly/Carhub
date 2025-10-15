import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '../services/auth'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import Button from '../components/Button'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('')
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setErrors({})

    try {
      const result = await register(formData)
      
      if (result.success) {
        // Mostrar mensaje de éxito y redirigir al login
        toast.success('¡Registro exitoso! Por favor inicia sesión.')
        navigate('/login', { state: { message: '¡Registro exitoso! Por favor inicia sesión.' } })
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
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
              Crear Cuenta
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <FormField
                label="Nombre de Usuario"
                name="name"
                type="text"
                placeholder="Nombre de usuario (ej: juan123)"
                value={formData.name}
                onChange={handleChange}
                error={errors.name?.[0]}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Primer Nombre"
                  name="first_name"
                  type="text"
                  placeholder="Primer nombre"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name?.[0]}
                  required
                />

                <FormField
                  label="Apellido"
                  name="last_name"
                  type="text"
                  placeholder="Apellido"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name?.[0]}
                  required
                />
              </div>

              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="Dirección de email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email?.[0]}
                autoComplete="email"
                required
              />

              <PasswordField
                label="Contraseña"
                name="password"
                placeholder="Contraseña (mínimo 8 caracteres)"
                value={formData.password}
                onChange={handleChange}
                error={errors.password?.[0]}
                autoComplete="new-password"
                required
              />

              <PasswordField
                label="Confirmar Contraseña"
                name="password_confirmation"
                placeholder="Confirmar contraseña"
                value={formData.password_confirmation}
                onChange={handleChange}
                error={errors.password_confirmation?.[0]}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg">
                {error}
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
                Crear Cuenta
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-300 hover:text-blue-600 transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}