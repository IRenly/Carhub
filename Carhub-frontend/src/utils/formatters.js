// Utilidades para formateo de datos

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} - Teléfono formateado
 */
export function formatPhone(phone) {
  if (!phone) return ''
  
  // Remover todos los caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Si tiene 10 dígitos, formatear como (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  // Si tiene 11 dígitos y empieza con 1, formatear como +1 (XXX) XXX-XXXX
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  // Si tiene 11 dígitos y no empieza con 1, formatear como +XX (XXX) XXX-XXXX
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  // Para otros casos, devolver tal como está
  return phone
}

/**
 * Limpia un número de teléfono para guardar en la base de datos
 * @param {string} phone - Número de teléfono formateado
 * @returns {string} - Teléfono limpio (solo números)
 */
export function cleanPhone(phone) {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

/**
 * Formatea una fecha para mostrar en el input date
 * @param {string|Date} date - Fecha
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
export function formatDateForInput(date) {
  if (!date) return ''
  
  // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }
  
  const dateObj = new Date(date)
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) {
    console.warn('Fecha inválida recibida:', date)
    return ''
  }
  
  // Formatear a YYYY-MM-DD
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

/**
 * Formatea una fecha para mostrar al usuario
 * @param {string|Date} date - Fecha
 * @returns {string} - Fecha formateada
 */
export function formatDateForDisplay(date) {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Valida un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {boolean} - True si es válido
 */
export function isValidPhone(phone) {
  if (!phone) return true // Opcional
  
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

/**
 * Valida una fecha de nacimiento
 * @param {string} date - Fecha de nacimiento
 * @returns {boolean} - True si es válida
 */
export function isValidBirthDate(date) {
  if (!date) return true // Opcional
  
  const dateObj = new Date(date)
  const today = new Date()
  const age = today.getFullYear() - dateObj.getFullYear()
  
  return !isNaN(dateObj.getTime()) && age >= 0 && age <= 120
}
