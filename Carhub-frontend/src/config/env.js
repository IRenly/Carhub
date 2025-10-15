// Configuración de variables de entorno
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CarHub',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
};


