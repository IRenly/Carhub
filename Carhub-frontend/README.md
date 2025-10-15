# 🚗 CarHub Frontend

Frontend moderno para la aplicación CarHub construido con React, Vite y Tailwind CSS.

## ✨ Características

- 🔐 **Autenticación JWT** con login y registro
- 🚗 **CRUD completo de carros** (crear, leer, actualizar, eliminar)
- 📱 **Diseño responsive** optimizado para móvil y desktop
- 🎨 **UI moderna** con Tailwind CSS y Lucide React icons
- 🔔 **Notificaciones toast** para feedback del usuario
- 👤 **Sistema de usuarios** con avatar y dropdown
- 🛡️ **Rutas protegidas** con verificación de token

## 🚀 Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000/api

# App Configuration
VITE_APP_NAME=CarHub
VITE_APP_VERSION=1.0.0
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

### 4. Construir para producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Avatar.jsx      # Avatar con iniciales
│   ├── Button.jsx      # Botón personalizado
│   ├── FormField.jsx   # Campo de formulario
│   ├── NavBar.jsx      # Barra de navegación
│   ├── ProtectedRoute.jsx # Ruta protegida
│   └── UserDropdown.jsx # Dropdown de usuario
├── config/
│   └── env.js          # Configuración de variables
├── pages/              # Páginas de la aplicación
│   ├── CarsPage.jsx    # Lista de carros
│   ├── CarFormPage.jsx # Formulario de carros
│   ├── LoginPage.jsx   # Página de login
│   └── RegisterPage.jsx # Página de registro
├── services/           # Servicios de API
│   ├── api.js          # Configuración de axios
│   ├── auth.js         # Servicios de autenticación
│   └── cars.js         # Servicios de carros
├── App.jsx             # Componente principal
├── main.jsx           # Punto de entrada
└── styles.css         # Estilos globales
```

## 🔧 Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **Axios** - Cliente HTTP
- **React Router DOM** - Enrutamiento
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

## 🎨 Componentes Principales

### FormField
Componente reutilizable para campos de formulario con validación visual.

### Button
Botón personalizado con diferentes variantes y estados de carga.

### Avatar
Avatar circular que muestra las iniciales del usuario.

### UserDropdown
Dropdown con menú de usuario que incluye opciones de perfil y logout.

## 🔐 Autenticación

El sistema de autenticación incluye:

- **Login** con email y contraseña
- **Registro** con validación completa
- **Token JWT** almacenado en localStorage
- **Rutas protegidas** que verifican autenticación
- **Logout automático** cuando el token expira

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🚗 Gestión de Carros

Funcionalidades implementadas:

- ✅ Listar carros del usuario
- ✅ Crear nuevo carro
- ✅ Editar carro existente
- ✅ Eliminar carro
- ✅ Búsqueda y filtros (próximamente)

## 🔄 Estado de la Aplicación

- **Token JWT** se almacena en localStorage
- **Datos del usuario** se mantienen en memoria
- **Interceptores de axios** manejan tokens automáticamente
- **Redirección automática** en caso de token expirado

## 🎯 Próximas Funcionalidades

- [ ] Página de perfil de usuario
- [ ] Configuración de cuenta
- [ ] Búsqueda avanzada de carros
- [ ] Filtros por marca, año, precio
- [ ] Subida de fotos (simulada)
- [ ] Estadísticas de carros
- [ ] Exportar datos

## 🐛 Solución de Problemas

### Error de conexión a la API
Verifica que la variable `VITE_API_BASE_URL` esté configurada correctamente y que el backend esté ejecutándose.

### Token expirado
El sistema detecta automáticamente tokens expirados y redirige al login.

### Estilos no se cargan
Asegúrate de que Tailwind CSS esté configurado correctamente y ejecuta `npm run dev`.

## 📄 Licencia

Este proyecto es parte de CarHub y está bajo la misma licencia del proyecto principal.