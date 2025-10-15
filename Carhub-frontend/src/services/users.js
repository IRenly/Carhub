import api from './api'

export const usersService = {
  // Obtener todos los usuarios (solo admins)
  async getAllUsers() {
    try {
      const response = await api.get('/users')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener usuarios' 
      }
    }
  },

  // Obtener estadísticas de usuarios (solo admins)
  async getUserStatistics() {
    try {
      const response = await api.get('/users/statistics')
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener estadísticas' 
      }
    }
  },

  // Obtener un usuario específico (solo admins)
  async getUser(userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al obtener usuario' 
      }
    }
  },

  // Actualizar un usuario (solo admins)
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData)
      return { success: true, data: response.data.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar usuario',
        errors: error.response?.data?.errors || {}
      }
    }
  },

  // Eliminar un usuario (solo admins)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`)
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al eliminar usuario' 
      }
    }
  }
}
