import React from 'react'
import { cn } from '@/lib/utils'
import { CountUp } from './CountUp'

interface Props {
  label: string
  value: string | number
  icon: React.ReactNode
  hint?: string
  accent?: 'gold' | 'blush' | 'emerald' | 'sky' | 'rose' | 'violet' | 'amber'
  /** Formata o valor numérico animado. Só usado quando `value` é number. */
  formatter?: (n: number) => string
}

const accents = {
  gold:    'from-gold-300/30 to-gold-500/10 text-gold-700',
  blush:   'from-blush-200/40 to-blush-400/10 text-blush-500',
  emerald: 'from-emerald-200/40 to-emerald-400/10 text-emerald-600',
  sky:     'from-sky-200/40 to-sky-400/10 text-sky-600',
  rose:    'from-rose-200/40 to-rose-400/10 text-rose-600',
  violet:  'from-violet-200/40 to-violet-400/10 text-violet-600',
  amber:   'from-amber-200/40 to-amber-400/10 text-amber-600',
}

export function StatCard({ label, value, icon, hint, accent = 'gold', formatter }: Props) {
  return (
    <div className="card group p-4 transition-all hover:-translate-y-1 hover:shadow-soft sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium leading-snug text-stone-500 sm:text-sm">{label}</p>
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform group-hover:scale-110 sm:h-10 sm:w-10',
            accents[accent],
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-xl font-semibold leading-tight text-stone-800 tabular-nums [overflow-wrap:anywhere] sm:text-2xl xl:text-3xl">
        {typeof value === 'number' ? (
          <CountUp
            to={value}
            formatter={formatter ?? ((n) => Math.round(n).toLocaleString('pt-BR'))}
          />
        ) : (
          value
        )}
      </p>
      {hint && <p className="mt-1 text-xs leading-snug text-stone-400">{hint}</p>}
    </div>
  )
}
