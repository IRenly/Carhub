import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, User, Mail, Phone, Calendar, Camera, Lock } from 'lucide-react'
import { userService } from '../services/user'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'
import FormField from '../components/FormField'
import PhoneInput from '../components/PhoneInput'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import { formatPhone, cleanPhone, formatDateForInput, isValidPhone, isValidBirthDate } from '../utils/formatters'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateAuthState } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        birth_date: formatDateForInput(user.birth_date) || ''
      })
    }
  }, [user])

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo específico
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateProfileForm = () => {
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

  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!passwordData.current_password.trim()) {
      newErrors.current_password = 'La contraseña actual es requerida'
    }
    if (!passwordData.new_password.trim()) {
      newErrors.new_password = 'La nueva contraseña es requerida'
    }
    if (passwordData.new_password && passwordData.new_password.length < 6) {
      newErrors.new_password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Las contraseñas no coinciden'
    }
    
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateProfileForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsLoading(true)
    
    try {
      // Preparar datos para enviar (el PhoneInput ya envía el número completo con prefijo)
      const dataToSend = {
        ...formData
      }
      
      const result = await userService.updateProfile(dataToSend)
      
      if (result.success) {
        toast.success('Perfil actualizado correctamente')
        updateAuthState() // Actualizar el estado de autenticación
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsPasswordLoading(true)
    
    try {
      const result = await userService.changePassword(passwordData)
      
      if (result.success) {
        toast.success('Contraseña cambiada correctamente')
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        })
      } else {
        if (result.errors) {
          setPasswordErrors(result.errors)
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Error al cambiar la contraseña')
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 5MB')
      return
    }

    try {
      const result = await userService.uploadProfilePhoto(file)
      
      if (result.success) {
        toast.success('Foto de perfil actualizada correctamente')
        updateAuthState()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Error al subir la foto de perfil')
    }
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-black">Mi Perfil</h1>
              <p className="text-gray-400 mt-2">Gestiona tu información personal</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del usuario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar name={user?.name || user?.email} size="xl" />
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {user?.first_name || user?.name || 'Usuario'}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Miembro desde {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Formularios */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'password'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lock className="h-4 w-4 inline mr-2" />
                Cambiar Contraseña
              </button>
            </div>

            {/* Tab de Información Personal */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Información Personal
                </h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Nombre Completo"
                      name="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name?.[0]}
                      required
                    />

                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email?.[0]}
                      required
                    />

                    <FormField
                      label="Nombre"
                      name="first_name"
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={errors.first_name?.[0]}
                    />

                    <FormField
                      label="Apellido"
                      name="last_name"
                      type="text"
                      placeholder="Tu apellido"
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

                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>Guardar Cambios</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab de Cambiar Contraseña */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-blue-600" />
                  Cambiar Contraseña
                </h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <FormField
                    label="Contraseña Actual"
                    name="current_password"
                    type="password"
                    placeholder="Tu contraseña actual"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    error={passwordErrors.current_password?.[0]}
                    required
                  />

                  <FormField
                    label="Nueva Contraseña"
                    name="new_password"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    error={passwordErrors.new_password?.[0]}
                    required
                  />

                  <FormField
                    label="Confirmar Nueva Contraseña"
                    name="new_password_confirmation"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    error={passwordErrors.new_password_confirmation?.[0]}
                    required
                  />

                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      isLoading={isPasswordLoading}
                      disabled={isPasswordLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Lock className="h-5 w-5" />
                      <span>Cambiar Contraseña</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
