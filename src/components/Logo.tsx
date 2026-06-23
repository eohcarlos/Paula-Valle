import { cn } from '@/lib/utils'

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600 shadow-gold">
        <span className="font-serif text-xl font-bold text-white">PV</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-serif text-lg font-semibold text-stone-800">Paula Valle</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold-600">Cachos &amp; Tranças</p>
        </div>
      )}
    </div>
  )
}

export function Avatar({
  name,
  src,
  size = 40,
}: {
  name: string
  src?: string
  size?: number
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover ring-2 ring-gold-300/40"
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-blush-300 to-gold-400 font-semibold text-white ring-2 ring-white"
    >
      {initials}
    </div>
  )
}
