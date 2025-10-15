import React from 'react'

export default function Avatar({ name, email, size = 'md' }) {
  const getInitials = (name) => {
    if (!name) return 'U'
    
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  }

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-blue-600 text-white font-medium ${sizeClasses[size]}`}>
      <span className="font-semibold">
        {getInitials(name || email)}
      </span>
    </div>
  )
}
