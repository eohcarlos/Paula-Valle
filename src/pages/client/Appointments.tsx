import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CalendarPlus,
  Eye,
  CalendarClock,
  XCircle,
  Clock,
  User,
  Scissors,
  ArrowRight,
  CalendarDays,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  cn,
  formatCurrency,
  formatDate,
  formatDateShort,
  isAppointmentLate,
  nowTimeBR,
  STATUS_META,
  todayISO,
} from '@/lib/utils'
import { daySlots } from '@/lib/availability'
import type { Appointment, AppointmentStatus } from '@/types'

const FILTERS: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all',         label: 'Todos' },
  { key: 'scheduled',   label: 'Agendados' },
  { key: 'confirmed',   label: 'Confirmados' },
  { key: 'in_progress', label: 'Em atendimento' },
  { key: 'completed',   label: 'Finalizados' },
  { key: 'canceled',    label: 'Cancelados' },
]

const STATUS_BAR: Record<AppointmentStatus, string> = {
  scheduled:   'bg-blush-300',
  confirmed:   'bg-gold-400',
  in_progress: 'bg-sky-400',
  completed:   'bg-emerald-400',
  canceled:    'bg-stone-300',
}

export default function ClientAppointments() {
  const { currentUser, appointments, services, settings, setAppointmentStatus, updateAppointment, loading } = useStore()
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all')
  const [detail, setDetail] = useState<Appointment | null>(null)
  const [reschedule, setReschedule] = useState<Appointment | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const aptParam = searchParams.get('apt')
  useEffect(() => {
    if (!aptParam || loading) return
    const apt = appointments.find((a) => a.id === aptParam)
    if (apt) setDetail(apt)
    else alert('Este agendamento não existe mais.')
    setSearchParams({}, { replace: true })
  }, [aptParam, appointments, loading, setSearchParams])

  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.clientId === currentUser?.id)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [appointments, currentUser],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: mine.length }
    mine.forEach((a) => { c[a.status] = (c[a.status] ?? 0) + 1 })
    return c
  }, [mine])

  const filtered = filter === 'all' ? mine : mine.filter((a) => a.status === filter)
  const svcNames = (ids: string[]) =>
    ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  return (
    <div className="space-y-6">

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-9 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(201,163,94,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(228,152,162,0.18),transparent_50%)]" />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
              <CalendarClock size={11} /> Meus agendamentos
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Seus atendimentos
            </h1>
            <p className="mt-1.5 text-sm text-stone-400">
              Acompanhe, reagende ou cancele seus agendamentos.
            </p>
          </div>
          <Link to="/app/agendar" className="shrink-0">
            <Button size="lg" className="gap-2 whitespace-nowrap">
              <CalendarPlus size={17} /> Novo
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros — grade 3 cols mobile, linha desktop */}
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
        {FILTERS.map((f) => {
          const count = counts[f.key] ?? 0
          const active = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 text-center transition-all duration-200 sm:flex-row sm:gap-2 sm:py-2',
                active
                  ? 'border-gold-400 bg-gradient-to-br from-gold-400 to-gold-500 text-white shadow-gold'
                  : 'border-cream-200 bg-white text-stone-500 hover:border-gold-300 hover:shadow-sm',
              )}
            >
              <span className="text-xs font-semibold sm:text-sm sm:font-medium">{f.label}</span>
              {count > 0 && (
                <span className={cn(
                  'ml-auto hidden rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:inline-block',
                  active ? 'bg-white/20 text-white' : 'bg-cream-100 text-stone-400',
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-cream-200 bg-white py-20 shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cream-100">
            <CalendarDays size={28} className="text-stone-300" />
          </div>
          <div className="text-center">
            <p className="font-serif text-lg font-semibold text-stone-500">Nenhum agendamento aqui</p>
            <p className="mt-1 text-sm text-stone-400">
              {filter === 'all' ? 'Você ainda não tem agendamentos.' : `Nenhum agendamento com status "${FILTERS.find(f => f.key === filter)?.label}".`}
            </p>
          </div>
          <Link to="/app/agendar">
            <Button>
              <CalendarPlus size={16} /> Agendar agora
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => {
            const canModify = ['scheduled', 'confirmed'].includes(a.status) && a.date >= todayISO()
            const late = isAppointmentLate(a.date, a.time, a.status)
            return (
              <div
                key={a.id}
                className="group overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card transition-all duration-200 hover:shadow-soft"
              >
                {/* Barra de cor por status */}
                <div className={cn('h-1 w-full transition-all', STATUS_BAR[a.status])} />

                <div className="p-5">
                  {/* Cabeçalho: serviço + badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-serif text-xl font-semibold leading-snug text-stone-800">
                        {svcNames(a.serviceIds)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={a.status} />
                      {late && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-500">
                          Atrasado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info chips */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={cn(
                      'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold',
                      late ? 'bg-red-50 text-red-500' : 'bg-cream-100 text-stone-600',
                    )}>
                      <CalendarClock size={12} />
                      {formatDateShort(a.date)} · {a.time}
                    </span>
                    {a.professional && a.professional !== 'A definir' && (
                      <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                        <User size={12} /> {a.professional}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                      <Clock size={12} /> {a.duration} min
                    </span>
                  </div>

                  {/* Rodapé: preço + ações */}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-cream-100 pt-4">
                    <span className="gold-text font-serif text-2xl font-semibold leading-none">
                      {formatCurrency(a.total)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDetail(a)}
                        className="flex items-center gap-1.5 rounded-xl border border-cream-200 px-3 py-2 text-xs font-semibold text-stone-500 transition hover:border-gold-300 hover:text-gold-700"
                      >
                        <Eye size={13} /> Detalhes
                      </button>
                      {canModify && (
                        <>
                          <button
                            onClick={() => setReschedule(a)}
                            className="flex items-center gap-1.5 rounded-xl border border-cream-200 px-3 py-2 text-xs font-semibold text-stone-500 transition hover:border-sky-300 hover:text-sky-600"
                          >
                            <CalendarClock size={13} /> Reagendar
                          </button>
                          <button
                            onClick={() => setAppointmentStatus(a.id, 'canceled')}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-cream-200 text-stone-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            title="Cancelar agendamento"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de detalhes */}
      {detail && (
        <DetailModal appointment={detail} onClose={() => setDetail(null)} svcNames={svcNames} services={services} />
      )}

      {/* Reagendar */}
      {reschedule && (
        <RescheduleModal
          appointment={reschedule}
          onClose={() => setReschedule(null)}
          onConfirm={(date, time) => {
            updateAppointment(reschedule.id, { date, time, status: 'scheduled' })
            setReschedule(null)
          }}
          slotsFor={(d) => daySlots(d, settings, appointments, reschedule.id, reschedule.duration)}
        />
      )}
    </div>
  )
}

/* ── Modal de detalhes premium ───────────────────────────────── */

function DetailModal({
  appointment: a,
  onClose,
  svcNames,
  services,
}: {
  appointment: Appointment
  onClose: () => void
  svcNames: (ids: string[]) => string
  services: { id: string; name: string; price: number; icon?: string }[]
}) {
  const late = isAppointmentLate(a.date, a.time, a.status)
  const svcList = a.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as { id: string; name: string; price: number; icon?: string }[]

  return (
    <Modal open onClose={onClose} title="Detalhes do agendamento">
      <div className="space-y-5">

        {/* Status + nome */}
        <div className="overflow-hidden rounded-2xl border border-cream-200">
          <div className={cn('h-1', STATUS_BAR[a.status])} />
          <div className="flex items-center justify-between gap-3 p-4">
            <p className="font-serif text-xl font-semibold text-stone-800">{svcNames(a.serviceIds)}</p>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={a.status} />
              {late && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-red-500">Atrasado</span>
              )}
            </div>
          </div>
        </div>

        {/* Infos */}
        <div className="grid grid-cols-2 gap-2">
          <InfoCard icon={<CalendarDays size={15} />} label="Data">
            {formatDate(a.date)}
          </InfoCard>
          <InfoCard icon={<Clock size={15} />} label="Horário">
            {a.time} · {a.duration} min
          </InfoCard>
          <InfoCard icon={<User size={15} />} label="Profissional">
            {a.professional}
          </InfoCard>
          <InfoCard icon={<Scissors size={15} />} label="Serviços">
            {svcList.length} serviço{svcList.length !== 1 ? 's' : ''}
          </InfoCard>
        </div>

        {/* Serviços + valores */}
        <div className="rounded-2xl border border-cream-200 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">Serviços</p>
          <div className="space-y-2">
            {svcList.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-600">{s.icon} {s.name}</span>
                <span className="font-semibold text-stone-700">{formatCurrency(s.price)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-end justify-between border-t border-cream-200 pt-3">
            <span className="text-sm font-medium text-stone-500">Total</span>
            <span className="gold-text font-serif text-2xl font-semibold">{formatCurrency(a.total)}</span>
          </div>
        </div>

        {a.notes && (
          <div className="flex items-start gap-2 rounded-2xl bg-cream-50 p-3 text-sm text-stone-600">
            <FileText size={14} className="mt-0.5 shrink-0 text-stone-400" />
            <p>{a.notes}</p>
          </div>
        )}

        {a.status === 'completed' && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 size={16} className="shrink-0" /> Atendimento finalizado com sucesso.
          </div>
        )}
        {a.status === 'canceled' && (
          <div className="flex items-center gap-2 rounded-2xl bg-stone-100 p-3 text-sm text-stone-500">
            <AlertTriangle size={16} className="shrink-0" /> Este agendamento foi cancelado.
          </div>
        )}
      </div>
    </Modal>
  )
}

function InfoCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-cream-200 bg-cream-50 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span className="text-gold-500">{icon}</span>
        {label}
      </div>
      <p className="text-sm font-medium text-stone-700">{children}</p>
    </div>
  )
}

/* ── Modal de reagendamento ──────────────────────────────────── */

function RescheduleModal({
  appointment,
  onClose,
  onConfirm,
  slotsFor,
}: {
  appointment: Appointment
  onClose: () => void
  onConfirm: (date: string, time: string) => void
  slotsFor: (date: string) => { time: string; available: boolean }[]
}) {
  const [date, setDate] = useState(appointment.date)
  const [time, setTime] = useState('')
  const rawSlots = slotsFor(date)
  const slots = date === todayISO()
    ? rawSlots.filter((s) => s.time >= nowTimeBR())
    : rawSlots

  return (
    <Modal open onClose={onClose} title="Reagendar atendimento">
      <div className="space-y-5">

        {/* Serviço atual */}
        <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Reagendando</p>
          <p className="mt-1 font-serif text-lg font-semibold text-stone-800">
            {appointment.serviceIds
              .map((id) => appointment.professional)
              .filter(Boolean)[0] || appointment.duration + ' min'}
          </p>
        </div>

        {/* Nova data */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
            <CalendarDays size={11} className="mr-1 inline" /> Nova data
          </label>
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => {
              const picked = e.target.value
              if (!picked || picked < todayISO()) return
              setDate(picked)
              setTime('')
            }}
            className="input-field"
          />
        </div>

        {/* Horários */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
            <Clock size={11} className="mr-1 inline" /> Novo horário
          </label>
          {slots.length === 0 ? (
            <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-600">
              <AlertTriangle size={15} /> Sem horários disponíveis nesta data.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  disabled={!s.available}
                  onClick={() => setTime(s.time)}
                  className={cn(
                    'rounded-xl border py-2.5 text-sm font-medium transition-all duration-150',
                    time === s.time
                      ? 'scale-105 border-gold-400 bg-gradient-to-b from-gold-400 to-gold-500 text-white shadow-gold'
                      : s.available
                        ? 'border-cream-200 bg-white text-stone-600 hover:border-gold-300 hover:shadow-sm'
                        : 'cursor-not-allowed border-cream-100 bg-cream-50 text-stone-300 line-through',
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-cream-100 pt-4">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button disabled={!time} onClick={() => onConfirm(date, time)}>
            Confirmar <ArrowRight size={15} />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
