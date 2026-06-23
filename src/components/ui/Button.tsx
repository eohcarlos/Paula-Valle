import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'blush' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  blush: 'btn-blush',
  ghost: 'btn-ghost',
  danger: 'btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-200',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  return <button className={cn(variants[variant], sizes[size], className)} {...props} />
}
