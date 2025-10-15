import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Settings, LogOut, Car } from 'lucide-react'
import toast from 'react-hot-toast'
import { logout } from '../services/auth'
import { useAuth } from '../hooks/useAuth'
import Avatar from './Avatar'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Has cerrado sesión correctamente')
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  if (!user) return null

  return (
    <div className="relative z-[99999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-1 hover:bg-gray-100 transition-colors"
      >
        <Avatar name={user.name || user.email} size="md" />
        <div className="hidden md:block text-left">
          <p className="font-medium text-gray-700">
            {user.name || 'Usuario'}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-32">
            {user.email}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-[9999]">
          <div className="py-2">
            {/* Header del dropdown */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <Avatar name={user.name || user.email} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Enlaces del menú */}
            <Link
              to="/cars"
              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Car className="mr-4 h-5 w-5" />
              Mis Autos
            </Link>

            <Link
              to="/profile"
              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-4 h-5 w-5" />
              Mi Perfil
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-4 h-5 w-5" />
              Configuración
            </Link>

            <div className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-4 h-5 w-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
