// src/components/Input.tsx
import React from 'react'

type Props = {
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
  textarea?: boolean
  rows?: number
  disabled?: boolean
  name?: string
}

const Input: React.FC<Props> = ({
  label,
  value = '',
  onChange = () => {},
  placeholder,
  type = 'text',
  className = '',
  textarea = false,
  rows = 3,
  disabled = false,
  name
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label ? <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label> : null}
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      )}
    </div>
  )
}

export default Input
