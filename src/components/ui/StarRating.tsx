import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  onChange?: (v: number) => void
  size?: number
  readOnly?: boolean
}

export function StarRating({ value, onChange, size = 20, readOnly = false }: Props) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={cn('transition-transform', !readOnly && 'hover:scale-125 cursor-pointer')}
          >
            <Star
              size={size}
              className={cn(active ? 'fill-gold-400 text-gold-400' : 'text-stone-300')}
            />
          </button>
        )
      })}
    </div>
  )
}
