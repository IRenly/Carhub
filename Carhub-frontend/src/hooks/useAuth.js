import { useState, useEffect } from 'react'
import { getToken, getUser } from '../services/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const updateAuthState = () => {
    const token = getToken()
    const userData = getUser()
    setIsAuthenticated(!!token)
    setUser(userData)
    setIsLoading(false)
  }

  useEffect(() => {
    updateAuthState()
  }, [])

  // Escuchar cambios en sessionStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'carhub_token' || e.key === 'carhub_user') {
        updateAuthState()
      }
    }

    // También escuchar cambios en la misma pestaña
    const handleCustomStorageChange = () => {
      updateAuthState()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStateChanged', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleCustomStorageChange)
    }
  }, [])

  return { isAuthenticated, user, isLoading, updateAuthState }
}
