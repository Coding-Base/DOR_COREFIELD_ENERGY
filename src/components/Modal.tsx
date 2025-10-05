// src/components/Modal.tsx
import React, { useEffect, useRef } from 'react'

type Props = {
  title?: string
  open: boolean
  onClose: () => void
  children?: React.ReactNode
  className?: string
}

export default function Modal({ title, open, onClose, children, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // prevent body scroll while modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = originalOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const onBackdropClick = (e: React.MouseEvent) => {
    // close only if click happened on the backdrop (not inside the modal content)
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={containerRef}
        className={`bg-white rounded shadow-lg w-full max-w-2xl p-4 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <div />}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
