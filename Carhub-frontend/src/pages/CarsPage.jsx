import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Edit, Trash2, Eye, Car as CarIcon } from 'lucide-react'
import { carsService } from '../services/cars'
import { useConfirm } from '../hooks/useConfirm'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import ConfirmDialog from '../components/ConfirmDialog'
import { getColorHex } from '../components/ColorSelector'

export default function CarsPage() {
  const { confirm, cancel, confirmState } = useConfirm()
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterMake, setFilterMake] = useState('all')

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      setIsLoading(true)
      const result = await carsService.getAllCars()
      if (result.success) {
        setCars(result.data)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Error al cargar los autos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (car) => {
    const confirmed = await confirm({
      title: '¿Eliminar auto?',
      message: `¿Estás seguro de que quieres eliminar el auto ${car.make} ${car.model} (${car.license_plate})? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (confirmed) {
      try {
        const result = await carsService.deleteCar(car.id)
        if (result.success) {
          toast.success('Auto eliminado correctamente')
          loadCars() // Recargar la lista
        } else {
          toast.error(result.error)
        }
      } catch (error) {
        toast.error('Error al eliminar el auto')
      }
    }
  }

  const handleStatusUpdate = async (carId, newStatus) => {
    try {
      const result = await carsService.updateCar(carId, { status: newStatus })
      if (result.success) {
        toast.success('Estado actualizado correctamente')
        loadCars()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Error al actualizar el estado')
    }
  }

  // Filtrar autos
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus
    const matchesMake = filterMake === 'all' || car.make.toLowerCase() === filterMake.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesMake
  })

  // Obtener marcas únicas para el filtro
  const uniqueMakes = [...new Set(cars.map(car => car.make))]

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'rented':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible'
      case 'maintenance':
        return 'Mantenimiento'
      case 'rented':
        return 'Alquilado'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 text-gray-800">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Autos</h1>
              <p className="text-gray-600 mt-2">
                Gestiona tu flota de vehículos ({cars.length} autos)
              </p>
            </div>
            <Link to="/cars/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Agregar Auto</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo o placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="rented">Alquilado</option>
            </select>

            {/* Filtro por marca */}
            <select
              value={filterMake}
              onChange={(e) => setFilterMake(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las marcas</option>
              {uniqueMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de autos */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-gray-600">{car.year}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(car.status)}`}>
                    {getStatusText(car.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Placa:</span> {car.license_plate}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: getColorHex(car.color) }}
                        title={car.color}
                      ></div>
                      <span>{car.color}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link to={`/cars/${car.id}/edit`} className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  
                  {car.status === 'available' ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusUpdate(car.id, 'maintenance')}
                      className="flex-1"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Mantenimiento
                    </Button>
                  ) : car.status === 'maintenance' ? (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusUpdate(car.id, 'available')}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Disponible
                    </Button>
                  ) : null}

                  <Button
                    variant="danger"
                    onClick={() => handleDelete(car)}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <CarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {cars.length === 0 ? 'No tienes autos registrados' : 'No se encontraron autos'}
            </h3>
            <p className="text-gray-600 mb-6">
              {cars.length === 0 
                ? 'Comienza agregando tu primer auto a la flota'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {cars.length === 0 && (
              <Link to="/cars/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-5 w-5 mr-2" />
                  Agregar Primer Auto
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Dialog de confirmación */}
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          onClose={cancel}
          onConfirm={confirmState.onConfirm}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          type={confirmState.type}
        />
      </div>
    </div>
  )
}