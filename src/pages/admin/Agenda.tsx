import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal'
import { cn, generateTimeSlots, nowBR, WEEKDAYS } from '@/lib/utils'
import { dayRanges, scheduleRange } from '@/lib/availability'
import { format, addDays, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Appointment } from '@/types'

/** Escolhe o agendamento a exibir num horário: prioriza o ativo; senão mostra o cancelado. */
function pickApt(list: Appointment[]): Appointment | undefined {
  return list.find((a) => a.status !== 'canceled') ?? list[0]
}

export default function Agenda() {
  const { appointments, services, settings } = useStore()
  const [view, setView] = useState<'day' | 'week'>('day')
  const [cursor, setCursor] = useState(nowBR)
  const [selected, setSelected] = useState<Appointment | null>(null)

  const range = scheduleRange(settings)
  const slots = generateTimeSlots(range.open, range.close, settings.slotInterval)
  const svcNames = (ids: string[]) => ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  const move = (dir: number) => setCursor((c) => addDays(c, view === 'day' ? dir : dir * 7))

  const dayKey = format(cursor, 'yyyy-MM-dd')
  const dayApts = useMemo(() => appointments.filter((a) => a.date === dayKey), [appointments, dayKey])
  const dayRangeList = dayRanges(dayKey, settings)
  const daySlotList = dayRangeList.flatMap((r) => generateTimeSlots(r.open, r.close, settings.slotInterval))

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [cursor])

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Agenda inteligente"
        subtitle="Clique em um atendimento para ver os detalhes completos."
        action={
          <div className="flex gap-1 rounded-2xl bg-cream-100 p-1">
            <button onClick={() => setView('day')} className={cn('flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition', view === 'day' ? 'bg-white text-gold-700 shadow-sm' : 'text-stone-500')}>
              <CalendarDays size={15} /> Diária
            </button>
            <button onClick={() => setView('week')} className={cn('flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition', view === 'week' ? 'bg-white text-gold-700 shadow-sm' : 'text-stone-500')}>
              <LayoutGrid size={15} /> Semanal
            </button>
          </div>
        }
      />

      {/* Navegação */}
      <div className="flex items-center justify-between">
        <button onClick={() => move(-1)} className="rounded-full p-2 text-stone-500 transition hover:bg-cream-100"><ChevronLeft size={20} /></button>
        <p className="font-serif text-lg font-semibold capitalize">
          {view === 'day'
            ? format(cursor, "EEEE, dd 'de' MMMM", { locale: ptBR })
            : `${format(weekDays[0], 'dd/MM')} – ${format(weekDays[6], 'dd/MM')}`}
        </p>
        <button onClick={() => move(1)} className="rounded-full p-2 text-stone-500 transition hover:bg-cream-100"><ChevronRight size={20} /></button>
      </div>

      {/* Diária */}
      {view === 'day' && (
        <div className="card p-0">
          {dayRangeList.length === 0 ? (
            <p className="py-16 text-center text-stone-400">O salão não atende neste dia.</p>
          ) : (
            <div className="divide-y divide-cream-100">
              {daySlotList.map((time) => {
                const apt = pickApt(dayApts.filter((a) => a.time === time))
                const canceled = apt?.status === 'canceled'
                return (
                  <div key={time} className={cn('flex items-stretch gap-4 px-5 py-3 transition', apt && !canceled ? 'bg-gold-300/5' : 'hover:bg-cream-50')}>
                    <span className="w-14 shrink-0 font-medium text-stone-500">{time}</span>
                    {apt ? (
                      <button
                        onClick={() => setSelected(apt)}
                        className={cn(
                          'flex flex-1 flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-left shadow-sm transition hover:shadow-md',
                          canceled ? 'border-stone-200 bg-stone-50' : 'border-gold-300/40 bg-white hover:border-gold-400',
                        )}
                      >
                        <div>
                          <p className={cn('font-medium text-stone-700', canceled && 'text-stone-400 line-through')}>{apt.clientName}</p>
                          <p className="text-xs text-stone-400">{svcNames(apt.serviceIds)} • {apt.professional}</p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </button>
                    ) : (
                      <div className="flex flex-1 items-center rounded-2xl border border-dashed border-cream-200 px-4 text-sm text-stone-300">
                        Livre
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Semanal */}
      {view === 'week' && (
        <div className="card overflow-x-auto p-0">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-8 border-b border-cream-200 bg-cream-50 text-center text-xs font-semibold text-stone-500">
              <div className="py-3" />
              {weekDays.map((d) => (
                <div key={d.toISOString()} className={cn('py-3', format(d, 'yyyy-MM-dd') === format(nowBR(), 'yyyy-MM-dd') && 'text-gold-700')}>
                  <p>{WEEKDAYS[d.getDay()]}</p>
                  <p className="text-base font-bold">{format(d, 'dd')}</p>
                </div>
              ))}
            </div>
            {slots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b border-cream-100">
                <div className="border-r border-cream-100 px-2 py-2 text-center text-xs font-medium text-stone-400">{time}</div>
                {weekDays.map((d) => {
                  const dk = format(d, 'yyyy-MM-dd')
                  const apt = pickApt(appointments.filter((a) => a.date === dk && a.time === time))
                  const canceled = apt?.status === 'canceled'
                  const withinHours = dayRanges(dk, settings).some((r) => time >= r.open && time < r.close)
                  return (
                    <div key={dk} className={cn('min-h-[44px] border-r border-cream-100 p-1', !withinHours && 'bg-cream-50/50')}>
                      {apt && (
                        <button
                          onClick={() => setSelected(apt)}
                          className={cn(
                            'h-full w-full rounded-lg px-2 py-1 text-left text-[10px] leading-tight transition hover:brightness-95',
                            canceled
                              ? 'bg-gradient-to-br from-stone-200/50 to-stone-300/40'
                              : 'bg-gradient-to-br from-gold-300/30 to-blush-200/40',
                          )}
                        >
                          <p className={cn('font-semibold text-stone-700', canceled && 'text-stone-400 line-through')}>
                            {apt.clientName.split(' ')[0]}
                          </p>
                          <p className="truncate text-stone-500">{svcNames(apt.serviceIds)}</p>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gradient-to-br from-gold-300/40 to-blush-200/50" /> Atendimento</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-gradient-to-br from-stone-200/60 to-stone-300/50" /> Cancelado</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-dashed border-cream-300" /> Horário livre</span>
      </div>

      {/* Popup de detalhes */}
      <AppointmentDetailsModal appointment={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
