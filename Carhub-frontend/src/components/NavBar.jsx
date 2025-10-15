import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Plus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { config } from '../config/env'
import UserDropdown from './UserDropdown'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
        <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/icono.svg" alt="Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-blue-700"> {config.APP_NAME}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/cars" 
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Mis Autos
                    </Link>
                    <Link 
                      to="/cars/new" 
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Auto</span>
                    </Link>
                <UserDropdown />
              </>
            ) : (
              <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Registrarse
                    </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <div className="mr-2">
                <UserDropdown />
              </div>
            )}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
                >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/20">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/cars" 
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Mis Autos
                      </Link>
                      <Link 
                        to="/cars/new" 
                        className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar Auto</span>
                      </Link>
                      <Link 
                        to="/profile" 
                        className="text-blue-200 hover:text-blue-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link 
                        to="/settings" 
                        className="text-blue-200 hover:text-blue-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Configuración
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link 
                        to="/register" 
                        className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
      </div>
    </nav>
  )
}
