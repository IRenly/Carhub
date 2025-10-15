import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Phone } from 'lucide-react'
import Flag from './Flag'

// Datos de países con códigos telefónicos y banderas (ordenados alfabéticamente)
const COUNTRIES = [
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' }
]

export default function PhoneInput({ 
  value = '', 
  onChange, 
  error, 
  required = false, 
  placeholder = 'Número de teléfono',
  className = ''
}) {
  // Asegurar que value nunca sea null
  const safeValue = value || ''
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === 'MX') || COUNTRIES[0]) // México por defecto
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Efecto para parsear el valor inicial si viene con código de país
  useEffect(() => {
    if (safeValue) {
      // Buscar si el valor contiene un código de país conocido
      // Ordenar por longitud de dialCode para que coincida primero con códigos más largos
      const sortedCountries = COUNTRIES.sort((a, b) => b.dialCode.length - a.dialCode.length)
      const country = sortedCountries.find(c => safeValue.startsWith(c.dialCode))
      
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(safeValue.replace(country.dialCode, ''))
      } else {
        // Si no tiene código de país, asumir que es solo el número
        setPhoneNumber(safeValue)
      }
    } else {
      // Si no hay valor, limpiar el número
      setPhoneNumber('')
    }
  }, [safeValue])

  // Filtrar países basado en búsqueda
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isOpen])

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchTerm('')
    // Enviar el número completo con el prefijo
    const fullNumber = country.dialCode + phoneNumber
    onChange({ target: { name: 'phone', value: fullNumber } })
  }

  const handlePhoneChange = (e) => {
    const number = e.target.value
    setPhoneNumber(number)
    // Enviar el número completo con el prefijo
    const fullNumber = selectedCountry.dialCode + number
    onChange({ target: { name: 'phone', value: fullNumber } })
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-900 mb-1">
        Teléfono <span className="text-red-500">{required && '*'}</span>
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <div className="flex w-full">
          {/* Selector de país */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 border-r-0 rounded-l-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-0 flex-shrink-0"
          >
            <Flag countryCode={selectedCountry.code} />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{selectedCountry.dialCode}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Input de número */}
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 min-w-0"
          />
        </div>

        {/* Dropdown de países */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-hidden">
            {/* Barra de búsqueda */}
            <div className="p-3 border-b border-gray-200">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar país..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Lista de países */}
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                  >
                    <Flag countryCode={country.code} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{country.name}</div>
                    </div>
                    <span className="text-sm text-gray-500">{country.dialCode}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  No se encontraron países
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
