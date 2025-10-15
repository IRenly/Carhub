import axios from 'axios'
import { getToken, removeToken } from './auth'
import { config } from '../config/env'

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
