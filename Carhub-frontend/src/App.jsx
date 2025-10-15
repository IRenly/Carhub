import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CarsPage from './pages/CarsPage'
import CarFormPage from './pages/CarFormPage'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Background from './components/Background'
import HomeRedirect from './components/HomeRedirect'

export default function App() {
  return (
    <div className="h-screen overflow-hidden relative">
      <Background />
      <div className="relative z-10 h-full flex flex-col">
        <NavBar />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/cars" element={<ProtectedRoute><CarsPage /></ProtectedRoute>} />
            <Route path="/cars/new" element={<ProtectedRoute><CarFormPage /></ProtectedRoute>} />
            <Route path="/cars/:id/edit" element={<ProtectedRoute><CarFormPage edit /></ProtectedRoute>} />
            
            {/* Rutas adicionales para perfil y configuración */}
            <Route path="/profile" element={<ProtectedRoute><div>Perfil (próximamente)</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div>Configuración (próximamente)</div></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}
