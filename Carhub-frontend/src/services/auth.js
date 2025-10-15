import api from './api'

const TOKEN_KEY = 'carhub_token'
const USER_KEY = 'carhub_user'

// Función para emitir evento de cambio de estado de autenticación
const emitAuthStateChange = () => {
  window.dispatchEvent(new CustomEvent('authStateChanged'))
}

// Funciones de token
export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
  emitAuthStateChange()
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
  emitAuthStateChange()
}

// Funciones de usuario
export function saveUser(user) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  emitAuthStateChange()
}

export function getUser() {
  const user = sessionStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function removeUser() {
  sessionStorage.removeItem(USER_KEY)
  emitAuthStateChange()
}

// Funciones de autenticación
export function isAuthenticated() {
  return !!getToken()
}

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password })
    const { access_token } = response.data
    
    saveToken(access_token)
    
    // Siempre obtener la información completa del usuario después del login
    const userResponse = await api.post('/auth/me')
    saveUser(userResponse.data)
    
    return { success: true, data: response.data }
  } catch (error) {
    // Manejar diferentes tipos de errores
    let errorMessage = 'Error de conexión'
    
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || ''
      
      switch (status) {
        case 401:
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.'
          break
        case 422:
          errorMessage = 'Datos inválidos. Verifica que el email y contraseña sean correctos.'
          break
        case 429:
          errorMessage = 'Demasiados intentos. Espera unos minutos antes de intentar nuevamente.'
          break
        case 500:
          errorMessage = 'Error del servidor. Intenta más tarde.'
          break
        default:
          errorMessage = message || 'Error de autenticación. Intenta nuevamente.'
      }
    } else if (error.request) {
      errorMessage = 'Sin conexión a internet. Verifica tu conexión e intenta nuevamente.'
    }
    
    return { 
      success: false, 
      error: errorMessage 
    }
  }
}

export async function register(userData) {
  try {
    const response = await api.post('/auth/register', userData)
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error de conexión',
      errors: error.response?.data?.errors || {}
    }
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.error('Error al hacer logout:', error)
  } finally {
    removeToken()
    removeUser()
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.post('/auth/me')
    saveUser(response.data)
    return { success: true, data: response.data }
  } catch (error) {
    removeToken()
    removeUser()
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error de conexión' 
    }
  }
}
