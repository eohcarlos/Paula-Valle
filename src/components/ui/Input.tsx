import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
  error?: string
}

export function Input({ label, icon, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </span>
        )}
        <input id={inputId} className={cn('input-field', icon ? 'pl-11' : '', error ? 'border-red-300' : '', className)} {...props} />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const inputId = id || props.name
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <textarea id={inputId} className={cn('input-field resize-none', className)} {...props} />
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export function Select({ label, className, id, children, ...props }: SelectProps) {
  const inputId = id || props.name
  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
        </label>
      )}
      <select id={inputId} className={cn('input-field appearance-none cursor-pointer', className)} {...props}>
        {children}
      </select>
    </div>
  )
}
