import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const COLORS = [
  { name: 'Blanco', value: 'Blanco', hex: '#FFFFFF' },
  { name: 'Negro', value: 'Negro', hex: '#000000' },
  { name: 'Gris', value: 'Gris', hex: '#6B7280' },
  { name: 'Gris Oscuro', value: 'Gris Oscuro', hex: '#374151' },
  { name: 'Gris Claro', value: 'Gris Claro', hex: '#D1D5DB' },
  { name: 'Rojo', value: 'Rojo', hex: '#DC2626' },
  { name: 'Rojo Oscuro', value: 'Rojo Oscuro', hex: '#991B1B' },
  { name: 'Azul', value: 'Azul', hex: '#2563EB' },
  { name: 'Azul Oscuro', value: 'Azul Oscuro', hex: '#1D4ED8' },
  { name: 'Azul Claro', value: 'Azul Claro', hex: '#3B82F6' },
  { name: 'Verde', value: 'Verde', hex: '#16A34A' },
  { name: 'Verde Oscuro', value: 'Verde Oscuro', hex: '#15803D' },
  { name: 'Verde Claro', value: 'Verde Claro', hex: '#22C55E' },
  { name: 'Amarillo', value: 'Amarillo', hex: '#EAB308' },
  { name: 'Naranja', value: 'Naranja', hex: '#EA580C' },
  { name: 'Morado', value: 'Morado', hex: '#9333EA' },
  { name: 'Rosa', value: 'Rosa', hex: '#EC4899' },
  { name: 'Marrón', value: 'Marrón', hex: '#A16207' },
  { name: 'Beige', value: 'Beige', hex: '#D4AF8C' },
  { name: 'Dorado', value: 'Dorado', hex: '#F59E0B' },
  { name: 'Plateado', value: 'Plateado', hex: '#9CA3AF' },
  { name: 'Cobre', value: 'Cobre', hex: '#B45309' }
]

export default function ColorSelector({ value, onChange, error, required = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedColor = COLORS.find(color => color.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleColorSelect = (color) => {
    onChange({ target: { name: 'color', value: color.value } })
    setIsOpen(false)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Color <span className="text-red-500">{required && '*'}</span>
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {selectedColor && (
              <div 
                className="w-5 h-5 rounded border border-gray-300"
                style={{ backgroundColor: selectedColor.hex }}
              ></div>
            )}
            <span className={selectedColor ? 'text-gray-900' : 'text-gray-500'}>
              {selectedColor ? selectedColor.name : 'Selecciona un color'}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorSelect(color)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <span className="text-gray-900">{color.name}</span>
                </div>
                {value === color.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Función helper para obtener el hex de un color por nombre
export function getColorHex(colorName) {
  const color = COLORS.find(c => c.value === colorName)
  return color ? color.hex : '#6B7280' // Gris por defecto
}
