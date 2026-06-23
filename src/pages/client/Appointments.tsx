import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarPlus, Eye, CalendarClock, XCircle, Clock, User } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { cn, formatCurrency, formatDate, formatDateShort, todayISO } from '@/lib/utils'
import { daySlots } from '@/lib/availability'
import type { Appointment, AppointmentStatus } from '@/types'

const FILTERS: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'scheduled', label: 'Agendados' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'in_progress', label: 'Em atendimento' },
  { key: 'completed', label: 'Finalizados' },
  { key: 'canceled', label: 'Cancelados' },
]

export default function ClientAppointments() {
  const { currentUser, appointments, services, settings, setAppointmentStatus, updateAppointment } = useStore()
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all')
  const [detail, setDetail] = useState<Appointment | null>(null)
  const [reschedule, setReschedule] = useState<Appointment | null>(null)

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.clientId === currentUser?.id)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [appointments, currentUser],
  )

  const filtered = filter === 'all' ? mine : mine.filter((a) => a.status === filter)
  const svcNames = (ids: string[]) => ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Meus agendamentos"
        subtitle="Acompanhe, reagende ou cancele seus atendimentos."
        action={
          <Link to="/app/agendar">
            <Button><CalendarPlus size={16} /> Novo</Button>
          </Link>
        }
      />

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition',
              filter === f.key
                ? 'border-gold-400 bg-gold-400 text-white shadow-gold'
                : 'border-cream-200 bg-white text-stone-500 hover:border-beige-300',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-stone-400">Nenhum agendamento nesta categoria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => {
            const canModify = ['scheduled', 'confirmed'].includes(a.status) && a.date >= todayISO()
            return (
              <div key={a.id} className="card flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-serif text-lg font-semibold leading-snug text-stone-800">{svcNames(a.serviceIds)}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
                      <CalendarClock size={15} className="shrink-0" /> <span className="truncate">{formatDateShort(a.date)} às {a.time}</span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-stone-400">
                      <User size={15} className="shrink-0" /> <span className="truncate">{a.professional}</span>
                    </p>
                  </div>
                  <span className="shrink-0">
                    <StatusBadge status={a.status} />
                  </span>
                </div>
                <div className="flex flex-col gap-3 border-t border-cream-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-serif text-lg font-semibold text-gold-700">{formatCurrency(a.total)}</span>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setDetail(a)}>
                      <Eye size={15} /> Detalhes
                    </Button>
                    {canModify && (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => setReschedule(a)}>
                          <CalendarClock size={15} /> Reagendar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setAppointmentStatus(a.id, 'canceled')}>
                          <XCircle size={15} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detalhes */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detalhes do agendamento">
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Status"><StatusBadge status={detail.status} /></Row>
            <Row label="Data">{formatDate(detail.date)}</Row>
            <Row label="Horário">{detail.time}</Row>
            <Row label="Serviços">{svcNames(detail.serviceIds)}</Row>
            <Row label="Profissional">{detail.professional}</Row>
            <Row label="Duração">{detail.duration} min</Row>
            <Row label="Observações">{detail.notes || '—'}</Row>
            <Row label="Total"><b className="text-gold-700">{formatCurrency(detail.total)}</b></Row>
          </div>
        )}
      </Modal>

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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-cream-100 pb-2">
      <span className="text-stone-400">{label}</span>
      <span className="text-right font-medium text-stone-700">{children}</span>
    </div>
  )
}

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
  const slots = slotsFor(date)

  return (
    <Modal open onClose={onClose} title="Reagendar atendimento">
      <div className="space-y-4">
        <div>
          <label className="label">Nova data</label>
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => {
              setDate(e.target.value)
              setTime('')
            }}
            className="input-field"
          />
        </div>
        <div>
          <label className="label">Novo horário</label>
          {slots.length === 0 ? (
            <p className="text-sm text-stone-400">Sem horários disponíveis nesta data.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s.time}
                  disabled={!s.available}
                  onClick={() => setTime(s.time)}
                  className={cn(
                    'rounded-xl border py-2 text-sm transition',
                    time === s.time
                      ? 'border-gold-400 bg-gold-400 text-white'
                      : s.available
                        ? 'border-cream-200 hover:border-gold-300'
                        : 'cursor-not-allowed bg-cream-50 text-stone-300 line-through',
                  )}
                >
                  <Clock size={12} className="mx-auto mb-0.5" />
                  {s.time}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button disabled={!time} onClick={() => onConfirm(date, time)}>Confirmar</Button>
        </div>
      </div>
    </Modal>
  )
}
