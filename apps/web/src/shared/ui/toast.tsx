'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

let _addToast: ((message: string, type?: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'success') {
  _addToast?.(message, type)
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    _addToast = (message, type = 'success') => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
    }
    return () => { _addToast = null }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium pointer-events-auto animate-in slide-in-from-bottom-2 duration-200 ${
            t.type === 'success'
              ? 'bg-white border-green-200 text-zinc-800'
              : 'bg-white border-red-200 text-zinc-800'
          }`}
        >
          {t.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
          {t.message}
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-1 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
