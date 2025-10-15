import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Car, Users, BarChart3, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { carsService } from '../services/cars'
import toast from 'react-hot-toast'
import { getColorHex } from '../components/ColorSelector'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    maintenanceCars: 0,
    recentCars: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Obtener estadísticas
      const statsResult = await carsService.getCarStatistics()
      if (statsResult.success) {
        setStats(prevStats => ({
          ...prevStats,
          ...statsResult.data
        }))
      }

      // Obtener autos recientes
      const carsResult = await carsService.getAllCars()
      if (carsResult.success) {
        setStats(prevStats => ({
          ...prevStats,
          recentCars: carsResult.data.slice(0, 5) // Últimos 5 autos
        }))
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
      toast.error('Error al cargar datos del dashboard')
    } finally {
      setIsLoading(false)
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
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenid@, {user?.first_name || user?.name || 'Usuario'}! 👋
          </h1>
          <p className="text-gray-700 mt-2">
            Gestiona tu flota de vehículos desde aquí
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Autos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Mantenimiento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenanceCars}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Últimos Agregados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentCars.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agregar Auto */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2 text-blue-600" />
              Acciones Rápidas
            </h2>
            <div className="space-y-4">
              <Link
                to="/cars/new"
                className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/25"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Nuevo Auto
              </Link>
              <Link
                to="/cars"
                className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-300"
              >
                <Car className="h-5 w-5 mr-2" />
                Ver Todos los Autos
              </Link>
            </div>
          </div>

          {/* Autos Recientes */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2 text-purple-600" />
              Autos Recientes
            </h2>
            {stats.recentCars.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCars.map((car) => (
                  <div key={car.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{car.make} {car.model}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{car.year} • {car.license_plate}</span>
                        <div className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded border border-gray-300"
                            style={{ backgroundColor: getColorHex(car.color) }}
                            title={car.color}
                          ></div>
                          <span className="text-xs">{car.color}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      car.status === 'available' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : car.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : car.status === 'sold'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {car.status === 'available' ? 'Disponible' : 
                       car.status === 'maintenance' ? 'Mantenimiento' : 
                       car.status === 'sold' ? 'Vendido' : 'Reservado'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No tienes autos registrados aún</p>
                <Link
                  to="/cars/new"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Agregar tu primer auto →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-300">
            CarHub Dashboard • Gestiona tu flota de manera eficiente
          </p>
        </div>
      </div>
    </div>
  )
}
