import React, { useState } from 'react'
import { Settings, Save, RefreshCw, Globe, Car, Users, Bell, FileText, Palette } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'Generales', icon: Globe },
    { id: 'cars', label: 'Autos', icon: Car },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'appearance', label: 'Apariencia', icon: Palette }
  ]

  const handleSave = () => {
    toast.success('Configuraciones guardadas (simulado)')
  }

  const handleReset = () => {
    toast.info('Configuraciones restablecidas (simulado)')
  }

  return (
    <div className="h-full overflow-y-auto p-6 text-gray-800">
      <div className="max-w-6xl mx-auto h-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-blue-600" />
            Configuraciones
          </h1>
          <p className="text-gray-700 mt-2">
            Personaliza la aplicación según tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categorías</h3>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Tab: Generales */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-600" />
                    Configuraciones Generales
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Aplicación
                      </label>
                      <input
                        type="text"
                        defaultValue="CarHub"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre de la app"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda por Defecto
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="MXN">MXN - Peso Mexicano</option>
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Fecha
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="America/Mexico_City">America/Mexico_City</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/Madrid">Europe/Madrid</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Autos */}
              {activeTab === 'cars' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-blue-600" />
                    Configuraciones de Autos
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Estados Disponibles
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['available', 'sold', 'maintenance', 'reserved'].map((status) => (
                          <div key={status} className="flex items-center">
                            <input
                              type="checkbox"
                              id={status}
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={status} className="ml-2 text-sm text-gray-700 capitalize">
                              {status === 'available' ? 'Disponible' :
                               status === 'sold' ? 'Vendido' :
                               status === 'maintenance' ? 'Mantenimiento' : 'Reservado'}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipos de Combustible
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'].map((fuel) => (
                          <div key={fuel} className="flex items-center">
                            <input
                              type="checkbox"
                              id={fuel}
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={fuel} className="ml-2 text-sm text-gray-700">
                              {fuel}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipos de Transmisión
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Manual', 'Automatic', 'CVT', 'Semi-Automatic'].map((transmission) => (
                          <div key={transmission} className="flex items-center">
                            <input
                              type="checkbox"
                              id={transmission}
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={transmission} className="ml-2 text-sm text-gray-700">
                              {transmission}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Usuarios */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Configuraciones de Usuarios
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Límite de Autos por Usuario
                      </label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitud Mínima de Contraseña
                      </label>
                      <input
                        type="number"
                        defaultValue="8"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo de Sesión (minutos)
                      </label>
                      <input
                        type="number"
                        defaultValue="60"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roles Disponibles
                      </label>
                      <div className="space-y-2">
                        {['admin', 'user', 'manager', 'viewer'].map((role) => (
                          <div key={role} className="flex items-center">
                            <input
                              type="checkbox"
                              id={role}
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={role} className="ml-2 text-sm text-gray-700 capitalize">
                              {role}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Notificaciones */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                    Configuraciones de Notificaciones
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Email de Notificaciones
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@carhub.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="admin@carhub.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Eventos a Notificar
                      </label>
                      <div className="space-y-3">
                        {[
                          'Auto vendido',
                          'Auto en mantenimiento',
                          'Nuevo auto agregado',
                          'Auto reservado',
                          'Recordatorio de mantenimiento'
                        ].map((event) => (
                          <div key={event} className="flex items-center">
                            <input
                              type="checkbox"
                              id={event}
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={event} className="ml-2 text-sm text-gray-700">
                              {event}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Reportes */}
              {activeTab === 'reports' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Configuraciones de Reportes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Reportes
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Período por Defecto
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="30">Últimos 30 días</option>
                        <option value="90">Últimos 90 días</option>
                        <option value="365">Último año</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Campos a Incluir en Reportes
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Marca', 'Modelo', 'Año', 'Precio', 'Estado', 'Kilometraje', 'Fecha de Creación', 'Usuario'].map((field) => (
                          <div key={field} className="flex items-center">
                            <input
                              type="checkbox"
                              id={field}
                              defaultChecked
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={field} className="ml-2 text-sm text-gray-700">
                              {field}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Apariencia */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-blue-600" />
                    Configuraciones de Apariencia
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tema de Color
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="blue">Azul (Predeterminado)</option>
                        <option value="green">Verde</option>
                        <option value="purple">Morado</option>
                        <option value="red">Rojo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idioma
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Densidad de Información
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="compact">Compacta</option>
                        <option value="comfortable">Cómoda</option>
                        <option value="spacious">Espaciosa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño de Fuente
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="small">Pequeña</option>
                        <option value="medium">Mediana</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restablecer
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
