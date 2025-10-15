import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { carsService } from '../services/cars'
import toast from 'react-hot-toast'
import FormField from '../components/FormField'
import Button from '../components/Button'
import ColorSelector from '../components/ColorSelector'

export default function CarFormPage({ edit = false }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    license_plate: '',
    vin: '',
    mileage: '',
    fuel_type: 'Gasoline',
    transmission: 'Manual',
    engine_size: '',
    description: '',
    price: '',
    status: 'available'
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (edit && id) {
      loadCarData()
    }
  }, [edit, id])

  const loadCarData = async () => {
    try {
      setIsLoadingData(true)
      const result = await carsService.getCarById(id)
      if (result.success) {
        setFormData(result.data)
      } else {
        toast.error(result.error)
        navigate('/cars')
      }
    } catch (error) {
      toast.error('Error al cargar los datos del auto')
      navigate('/cars')
    } finally {
      setIsLoadingData(false)
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
    
    if (!formData.make.trim()) newErrors.make = 'La marca es requerida'
    if (!formData.model.trim()) newErrors.model = 'El modelo es requerido'
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'El año debe ser válido'
    }
    if (!formData.color.trim()) newErrors.color = 'El color es requerido'
    if (!formData.license_plate.trim()) newErrors.license_plate = 'La placa es requerida'
    if (!formData.mileage || formData.mileage < 0) {
      newErrors.mileage = 'El kilometraje debe ser válido'
    }
    if (!formData.fuel_type) newErrors.fuel_type = 'El tipo de combustible es requerido'
    if (!formData.transmission) newErrors.transmission = 'La transmisión es requerida'
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'El precio debe ser válido'
    }
    if (!formData.status) newErrors.status = 'El estado es requerido'
    
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
      let result
      if (edit) {
        result = await carsService.updateCar(id, formData)
      } else {
        result = await carsService.createCar(formData)
      }
      
      if (result.success) {
        toast.success(edit ? 'Auto actualizado correctamente' : 'Auto creado correctamente')
        navigate('/cars')
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Error al guardar el auto')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/cars')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {edit ? 'Editar Auto' : 'Agregar Nuevo Auto'}
              </h1>
              <p className="text-gray-200 mt-2">
                {edit ? 'Modifica la información del auto' : 'Completa los datos del nuevo auto'}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Marca"
                  name="make"
                  type="text"
                  placeholder="Ej: Toyota, Honda, Ford..."
                  value={formData.make}
                  onChange={handleChange}
                  error={errors.make?.[0]}
                  required
                />

                <FormField
                  label="Modelo"
                  name="model"
                  type="text"
                  placeholder="Ej: Corolla, Civic, Focus..."
                  value={formData.model}
                  onChange={handleChange}
                  error={errors.model?.[0]}
                  required
                />

                <FormField
                  label="Año"
                  name="year"
                  type="number"
                  placeholder="2020"
                  value={formData.year}
                  onChange={handleChange}
                  error={errors.year?.[0]}
                  required
                />

                <ColorSelector
                  value={formData.color}
                  onChange={handleChange}
                  error={errors.color?.[0]}
                  required
                />

                <FormField
                  label="Placa"
                  name="license_plate"
                  type="text"
                  placeholder="ABC-123"
                  value={formData.license_plate}
                  onChange={handleChange}
                  error={errors.license_plate?.[0]}
                  required
                />

                <FormField
                  label="VIN (Opcional)"
                  name="vin"
                  type="text"
                  placeholder="Número de identificación del vehículo"
                  value={formData.vin}
                  onChange={handleChange}
                  error={errors.vin?.[0]}
                />
              </div>
            </div>

            {/* Información Técnica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Información Técnica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Kilometraje"
                  name="mileage"
                  type="number"
                  placeholder="50000"
                  value={formData.mileage}
                  onChange={handleChange}
                  error={errors.mileage?.[0]}
                  required
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Tipo de Combustible <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="Gasoline">Gasolina</option>
                    <option value="Diesel">Diésel</option>
                    <option value="Electric">Eléctrico</option>
                    <option value="Hybrid">Híbrido</option>
                    <option value="LPG">GLP</option>
                  </select>
                  {errors.fuel_type?.[0] && (
                    <p className="mt-1 text-sm text-red-200">{errors.fuel_type[0]}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Transmisión <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automática</option>
                    <option value="CVT">CVT</option>
                    <option value="Semi-Automatic">Semi-Automática</option>
                  </select>
                  {errors.transmission?.[0] && (
                    <p className="mt-1 text-sm text-red-200">{errors.transmission[0]}</p>
                  )}
                </div>

                <FormField
                  label="Tamaño del Motor (Opcional)"
                  name="engine_size"
                  type="text"
                  placeholder="Ej: 2.0L, 1.6L..."
                  value={formData.engine_size}
                  onChange={handleChange}
                  error={errors.engine_size?.[0]}
                />
              </div>
            </div>

            {/* Información Comercial */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                Información Comercial
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Precio"
                  name="price"
                  type="number"
                  placeholder="25000.00"
                  value={formData.price}
                  onChange={handleChange}
                  error={errors.price?.[0]}
                  required
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white mb-1">
                    Estado <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="available">Disponible</option>
                    <option value="sold">Vendido</option>
                    <option value="reserved">Reservado</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                  {errors.status?.[0] && (
                    <p className="mt-1 text-sm text-red-200">{errors.status[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-white mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe el estado del vehículo, características especiales, etc."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 resize-none"
                />
                {errors.description?.[0] && (
                  <p className="mt-1 text-sm text-red-200">{errors.description[0]}</p>
                )}
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
                <span>{edit ? 'Actualizar Auto' : 'Crear Auto'}</span>
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/cars')}
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