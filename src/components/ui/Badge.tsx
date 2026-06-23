import { cn } from '@/lib/utils'
import { STATUS_META } from '@/lib/utils'
import type { AppointmentStatus } from '@/types'

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        meta.classes,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', meta.dot)} />
      {meta.label}
    </span>
  )
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', className)}>
      {children}
    </span>
  )
}
