import React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full rounded-3xl bg-white shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto',
          sizes[size],
        )}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-cream-200 bg-white/95 backdrop-blur px-6 py-4 rounded-t-3xl">
          <h3 className="text-xl font-semibold text-stone-800">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 transition hover:bg-cream-100 hover:text-stone-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
