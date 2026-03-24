// src/components/ColorPicker.tsx
import React, { useEffect, useState } from 'react'

type Props = {
  selectedColor?: string
  selectedHex?: string
  onColorChange?: (name: string, hex: string) => void
  className?: string
}

const PALETTE = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#fb923c' },
  { name: 'Yellow', hex: '#fbbf24' },
  { name: 'Green', hex: '#34d399' },
  { name: 'Blue', hex: '#60a5fa' },
  { name: 'Gray', hex: '#9ca3af' },
]

const ColorPicker: React.FC<Props> = ({ selectedColor = '', selectedHex = '', onColorChange = () => {}, className = '' }) => {
  const [name, setName] = useState(selectedColor || '')
  const [hex, setHex] = useState(selectedHex || '#ffffff')

  useEffect(() => {
    setName(selectedColor || '')
  }, [selectedColor])

  useEffect(() => {
    setHex(selectedHex || '#ffffff')
  }, [selectedHex])

  useEffect(() => {
    // notify parent on change
    onColorChange(name, hex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, hex])

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Color name (e.g. Red)"
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="w-12 h-10 p-0 border rounded"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PALETTE.map(c => (
          <button
            key={c.hex}
            onClick={() => { setName(c.name); setHex(c.hex) }}
            type="button"
            className="flex items-center gap-2 px-2 py-1 border rounded hover:shadow"
          >
            <span style={{ backgroundColor: c.hex }} className="w-4 h-4 rounded inline-block" />
            <span className="text-sm text-gray-700">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ColorPicker
