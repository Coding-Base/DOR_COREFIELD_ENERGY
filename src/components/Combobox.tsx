// src/components/Combobox.tsx
import React, { useEffect, useRef, useState } from 'react'

export type ComboOption = {
  id: string | number
  label: string
  meta?: any
}

type Props = {
  value?: ComboOption | null
  options?: ComboOption[]         // local options
  onChange?: (option: ComboOption | null) => void
  placeholder?: string
  className?: string
  // optional async search function (term) => Promise<ComboOption[]>
  onSearch?: (term: string) => Promise<ComboOption[]>
  disabled?: boolean
  allowClear?: boolean
}

const Combobox: React.FC<Props> = ({
  value = null,
  options = [],
  onChange = () => {},
  placeholder = 'Search...',
  className = '',
  onSearch,
  disabled = false,
  allowClear = true
}) => {
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState(value?.label || '')
  const [results, setResults] = useState<ComboOption[]>(options || [])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const timer = useRef<any>(null)

  useEffect(() => {
    // sync local options when prop changes
    setResults(options || [])
  }, [options])

  useEffect(() => {
    // sync displayed term when value changes externally
    setTerm(value?.label || '')
  }, [value])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!(e.target instanceof Node)) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const triggerSearch = (q: string) => {
    // local options filter if no onSearch provided
    if (!onSearch) {
      const lowered = q.trim().toLowerCase()
      setResults(
        (options || []).filter(o => o.label.toLowerCase().includes(lowered))
      )
      return
    }
    // debounce remote search
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await onSearch(q)
        setResults(res || [])
      } catch (e) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 250)
  }

  const handleInputChange = (v: string) => {
    setTerm(v)
    setOpen(true)
    triggerSearch(v)
  }

  const handleSelect = (opt: ComboOption) => {
    setTerm(opt.label)
    onChange(opt)
    setOpen(false)
  }

  const handleClear = () => {
    setTerm('')
    onChange(null)
    setResults(options || [])
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <input
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={term}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { setOpen(true); triggerSearch(term) }}
          placeholder={placeholder}
          disabled={disabled}
        />
        {allowClear && term && (
          <button
            onClick={handleClear}
            className="ml-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto">
          {loading ? (
            <div className="p-3 text-sm text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No results</div>
          ) : (
            results.map(opt => (
              <button
                key={String(opt.id)}
                onClick={() => handleSelect(opt)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                type="button"
              >
                <div className="font-medium">{opt.label}</div>
                {opt.meta ? <div className="text-xs text-gray-500">{String(opt.meta)}</div> : null}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Combobox
