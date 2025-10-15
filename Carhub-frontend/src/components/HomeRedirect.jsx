import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-800"></div>
      </div>
    )
  }

  // Si está autenticado, ir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Si no está autenticado, ir al login
  return <Navigate to="/login" replace />
}
