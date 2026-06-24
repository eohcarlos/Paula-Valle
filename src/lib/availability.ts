import type { Appointment, SalonSettings, TimeRange } from '@/types'
import { generateTimeSlots } from '@/lib/utils'
import { getDay, parseISO } from 'date-fns'

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** Retorna os horários de início dos agendamentos ativos em uma data. */
export function occupiedSlots(appointments: Appointment[], date: string, ignoreId?: string): Set<string> {
  return new Set(
    appointments
      .filter((a) => a.date === date && a.status !== 'canceled' && a.id !== ignoreId)
      .map((a) => a.time),
  )
}

/** Blocos de horário (ranges) de um dia da semana, ou [] se o salão não atende. */
export function dayRanges(date: string, settings: SalonSettings): TimeRange[] {
  let dow: number
  try {
    dow = getDay(parseISO(date))
  } catch {
    return []
  }
  const cfg = settings.daySchedule?.find((d) => d.day === dow)
  if (cfg) {
    if (!cfg.enabled) return []
    if (cfg.ranges?.length) return cfg.ranges
    return [{ open: cfg.open, close: cfg.close }]
  }
  // fallback legado
  return settings.workDays.includes(dow) ? [{ open: settings.openTime, close: settings.closeTime }] : []
}

/** Configuração de horário do dia (abertura do 1º bloco / fechamento do último) ou null se o salão não atende. */
export function dayConfig(date: string, settings: SalonSettings): { open: string; close: string } | null {
  const ranges = dayRanges(date, settings)
  if (ranges.length === 0) return null
  return { open: ranges[0].open, close: ranges[ranges.length - 1].close }
}

/** Verifica se o salão atende no dia. */
export function isWorkingDay(date: string, settings: SalonSettings): boolean {
  return dayRanges(date, settings).length > 0
}

/** Faixa total (menor abertura / maior fechamento) entre os dias ativos — usado na agenda semanal. */
export function scheduleRange(settings: SalonSettings): { open: string; close: string } {
  const active = (settings.daySchedule ?? []).filter((d) => d.enabled)
  if (active.length === 0) return { open: settings.openTime, close: settings.closeTime }
  const allRanges = active.flatMap((d) => (d.ranges?.length ? d.ranges : [{ open: d.open, close: d.close }]))
  const open = allRanges.reduce((min, r) => (r.open < min ? r.open : min), allRanges[0].open)
  const close = allRanges.reduce((max, r) => (r.close > max ? r.close : max), allRanges[0].close)
  return { open, close }
}

export interface SlotInfo {
  time: string
  available: boolean
}

/**
 * Retorna os slots do dia com disponibilidade calculada considerando a duração de
 * cada agendamento existente. Um slot só está disponível se:
 *   1. O novo atendimento [t, t+duration) não sobrepõe nenhum agendamento existente [A.time, A.time+A.duration)
 *   2. O novo atendimento termina antes do fim do bloco de horário
 *
 * @param duration duração total dos serviços selecionados em minutos
 */
export function daySlots(
  date: string,
  settings: SalonSettings,
  appointments: Appointment[],
  ignoreId?: string,
  duration = 0,
): SlotInfo[] {
  const ranges = dayRanges(date, settings)
  if (ranges.length === 0) return []

  // Agendamentos ativos no dia (exceto cancelados e o ignorado para edição)
  const existing = appointments.filter(
    (a) => a.date === date && a.status !== 'canceled' && a.id !== ignoreId,
  )

  // Duração mínima de 1 para garantir que o próprio início seja bloqueado quando duration=0
  const newDuration = Math.max(duration, 1)

  const times = ranges.flatMap((r) =>
    generateTimeSlots(r.open, r.close, settings.slotInterval).filter(
      // O novo atendimento deve terminar antes do fim do bloco
      (t) => toMinutes(t) + newDuration <= toMinutes(r.close),
    ),
  )

  return times.map((t) => {
    const tStart = toMinutes(t)
    const tEnd = tStart + newDuration

    // Verifica sobreposição com cada agendamento existente
    const overlaps = existing.some((a) => {
      const aStart = toMinutes(a.time)
      // Usa ao menos 1 min para garantir que slots no mesmo horário sejam bloqueados
      const aEnd = aStart + Math.max(a.duration ?? 0, 1)
      // Sobreposição: [tStart, tEnd) ∩ [aStart, aEnd) ≠ ∅
      return tStart < aEnd && tEnd > aStart
    })

    return { time: t, available: !overlaps }
  })
}
