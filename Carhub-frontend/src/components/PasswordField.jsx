import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  error, 
  autoComplete, 
  required = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          className={`form-input pr-12 ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
        {error && (
          <p className="mt-1 text-sm text-red-200">{error}</p>
        )}
    </div>
  );
};

export default PasswordField;
