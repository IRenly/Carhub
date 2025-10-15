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
    const { access_token, user } = response.data
    
    saveToken(access_token)
    
    // Si no tenemos el usuario en la respuesta, lo obtenemos
    if (!user) {
      const userResponse = await api.post('/auth/me')
      saveUser(userResponse.data)
    } else {
      saveUser(user)
    }
    
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error de conexión' 
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
