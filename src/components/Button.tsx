// src/components/Button.tsx
import React from 'react'
type Props = {
  children?: React.ReactNode
  onClick?: (e?: any) => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<Props> = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition'
  const sizeCls = size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'
  const variantCls =
    variant === 'outline'
      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      : variant === 'ghost'
      ? 'bg-transparent text-gray-700 hover:bg-gray-100'
      : 'bg-orange-500 text-white hover:bg-orange-600'

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${sizeCls} ${variantCls} ${className}`}>
      {children}
    </button>
  )
}

export default Button
