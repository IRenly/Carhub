import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Shield } from 'lucide-react'
import { usersService } from '../services/users'
import toast from 'react-hot-toast'
import FormField from '../components/FormField'
import PhoneInput from '../components/PhoneInput'
import Button from '../components/Button'
import { formatPhone, cleanPhone, formatDateForInput, isValidPhone, isValidBirthDate } from '../utils/formatters'

export default function EditUserPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    role: 'user'
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    loadUser()
  }, [id])

  const loadUser = async () => {
    setIsLoadingUser(true)
    try {
      const result = await usersService.getUser(id)
      if (result.success) {
        const user = result.data
        setFormData({
          name: user.name || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          birth_date: formatDateForInput(user.birth_date) || '',
          role: user.role || 'user'
        })
      } else {
        toast.error(result.error)
        navigate('/admin/users')
      }
    } catch (error) {
      toast.error('Error al cargar usuario')
      navigate('/admin/users')
    } finally {
      setIsLoadingUser(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'El teléfono no es válido'
    }
    if (formData.birth_date && !isValidBirthDate(formData.birth_date)) {
      newErrors.birth_date = 'La fecha de nacimiento no es válida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsLoading(true)
    
    try {
      // Preparar datos para enviar (el PhoneInput ya envía el número completo con prefijo)
      const dataToSend = {
        ...formData
      }
      
      const result = await usersService.updateUser(id, dataToSend)
      
      if (result.success) {
        toast.success('Usuario actualizado correctamente')
        navigate('/admin/users')
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Error al actualizar usuario')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingUser) {
    return (
      <div className="min-h-screen hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-black">Editar Usuario</h1>
              <p className="text-gray-400 mt-2">Modifica la información del usuario</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nombre Completo"
                  name="name"
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name?.[0]}
                  required
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email?.[0]}
                  required
                />

                <FormField
                  label="Nombre"
                  name="first_name"
                  type="text"
                  placeholder="Nombre"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name?.[0]}
                />

                <FormField
                  label="Apellido"
                  name="last_name"
                  type="text"
                  placeholder="Apellido"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name?.[0]}
                />

                <PhoneInput
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone?.[0]}
                  placeholder="Número de teléfono"
                />

                <FormField
                  label="Fecha de Nacimiento"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  error={errors.birth_date?.[0]}
                />
              </div>
            </div>

            {/* Rol del Usuario */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Permisos y Rol
              </h3>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Rol del Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="user">Usuario Regular</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role?.[0] && (
                  <p className="mt-1 text-sm text-red-600">{errors.role[0]}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Los administradores pueden gestionar usuarios y ver todos los autos del sistema.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                size="lg"
              >
                <Save className="h-5 w-5" />
                <span>Actualizar Usuario</span>
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/admin/users')}
                className="px-6 py-3"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
