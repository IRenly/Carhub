import api from './api'

// Obtener todos los carros del usuario
async function getAllCars() {
  try {
    const response = await api.get('/cars')
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al obtener los carros' 
    }
  }
}

// Obtener un carro por ID
async function getCarById(id) {
  try {
    const response = await api.get(`/cars/${id}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al obtener el carro' 
    }
  }
}

// Crear un nuevo carro
async function createCar(carData) {
  try {
    const response = await api.post('/cars', carData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al crear el carro',
      errors: error.response?.data?.errors || {}
    }
  }
}

// Actualizar un carro
async function updateCar(id, carData) {
  try {
    const response = await api.put(`/cars/${id}`, carData)
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al actualizar el carro',
      errors: error.response?.data?.errors || {}
    }
  }
}

// Eliminar un carro
async function deleteCar(id) {
  try {
    const response = await api.delete(`/cars/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al eliminar el carro' 
    }
  }
}

// Buscar carros
async function searchCars(searchParams) {
  try {
    const params = new URLSearchParams(searchParams)
    const response = await api.get(`/cars/search?${params}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al buscar carros' 
    }
  }
}

// Obtener carros por estado
async function getCarsByStatus(status) {
  try {
    const response = await api.get(`/cars/status/${status}`)
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al obtener carros por estado' 
    }
  }
}

// Obtener estadísticas de carros
async function getCarStatistics() {
  try {
    const response = await api.get('/cars/statistics')
    return { success: true, data: response.data.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al obtener estadísticas' 
    }
  }
}

// Actualizar estado de múltiples carros
async function bulkUpdateStatus(carIds, status) {
  try {
    const response = await api.patch('/cars/bulk-status', {
      car_ids: carIds,
      status: status
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Error al actualizar estados' 
    }
  }
}

// Exportar el objeto carsService
export const carsService = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
  getCarsByStatus,
  getCarStatistics,
  bulkUpdateStatus
}

// También exportar funciones individuales para compatibilidad
export {
  getAllCars as getCars,
  getCarById as getCar,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
  getCarsByStatus,
  getCarStatistics,
  bulkUpdateStatus
}
