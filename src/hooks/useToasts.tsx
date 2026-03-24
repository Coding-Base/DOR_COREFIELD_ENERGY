// src/hooks/useToasts.tsx
import React, { useCallback, useState } from 'react'

type Toast = { id: number; message: string; timeout?: number }

export default function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, timeout = 4000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const t: Toast = { id, message, timeout }
    setToasts(prev => [...prev, t])
    if (timeout > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== id))
      }, timeout)
    }
  }, [])

  const container = (
    <div className="fixed right-4 top-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="bg-white border border-gray-200 px-4 py-2 shadow rounded">
          {t.message}
        </div>
      ))}
    </div>
  )

  return { push, container }
}
