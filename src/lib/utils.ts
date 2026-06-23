import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AppointmentStatus } from '@/types'

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return iso
  }
}

export function formatDateShort(iso: string): string {
  try {
    return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return iso
  }
}

export function formatWeekday(iso: string): string {
  try {
    return format(parseISO(iso), 'EEEE', { locale: ptBR })
  } catch {
    return ''
  }
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function nowISO(): string {
  return new Date().toISOString()
}

export const STATUS_META: Record<
  AppointmentStatus,
  { label: string; classes: string; dot: string }
> = {
  scheduled: {
    label: 'Agendado',
    classes: 'bg-blush-100 text-blush-500 border-blush-200',
    dot: 'bg-blush-400',
  },
  confirmed: {
    label: 'Confirmado',
    classes: 'bg-gold-300/20 text-gold-700 border-gold-300/50',
    dot: 'bg-gold-500',
  },
  in_progress: {
    label: 'Em atendimento',
    classes: 'bg-sky-100 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
  },
  completed: {
    label: 'Finalizado',
    classes: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  canceled: {
    label: 'Cancelado',
    classes: 'bg-stone-100 text-stone-500 border-stone-200',
    dot: 'bg-stone-400',
  },
}

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const WEEKDAYS_FULL = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

/** Gera lista de horários (HH:mm) entre open e close com intervalo definido. */
export function generateTimeSlots(open: string, close: string, interval: number): string[] {
  const slots: string[] = []
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  let cur = oh * 60 + om
  const end = ch * 60 + cm
  while (cur < end) {
    const h = Math.floor(cur / 60)
    const m = cur % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    cur += interval
  }
  return slots
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}
