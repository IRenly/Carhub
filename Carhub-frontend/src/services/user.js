import api from './api'
import { saveUser } from './auth'

export const userService = {
  // Obtener datos del usuario actual
  async getCurrentUser() {
    try {
      const response = await api.post('/auth/me')
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener datos del usuario' 
      }
    }
  },

  // Actualizar datos del usuario
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData)
      // Actualizar el usuario en sessionStorage
      saveUser(response.data.data)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar perfil',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/change-password', passwordData)
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al cambiar contraseña',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  // Subir foto de perfil
  async uploadProfilePhoto(photoFile) {
    try {
      const formData = new FormData()
      formData.append('profile_photo', photoFile)
      
      const response = await api.post('/auth/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al subir foto de perfil' 
      }
    }
  }
}
