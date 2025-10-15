import React from 'react'

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
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-white mb-2">
        Color <span className="text-red-400">{required && '*'}</span>
      </label>
      
      <div className="grid grid-cols-6 gap-2">
        {COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange({ target: { name: 'color', value: color.value } })}
            className={`
              relative w-full h-12 rounded-lg border-2 transition-all duration-200
              ${value === color.value 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {value === color.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {value && (
        <p className="text-sm text-gray-300 mt-2">
          Color seleccionado: <span className="font-medium">{value}</span>
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-200">{error}</p>
      )}
    </div>
  )
}

// Función helper para obtener el hex de un color por nombre
export function getColorHex(colorName) {
  const color = COLORS.find(c => c.value === colorName)
  return color ? color.hex : '#6B7280' // Gris por defecto
}
