import React from 'react'

// Función para generar banderas usando códigos Unicode
const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

export default function Flag({ countryCode, className = '', ...props }) {
  return (
    <span 
      className={`text-lg ${className}`} 
      role="img" 
      aria-label={`Bandera de ${countryCode}`}
      {...props}
    >
      {getFlagEmoji(countryCode)}
    </span>
  )
}
