import { Fragment, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Check, Play, CheckCircle2, XCircle, Pencil, Eye } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal'
import { cn, formatCurrency, formatDateShort, todayISO, STATUS_META } from '@/lib/utils'
import { daySlots } from '@/lib/availability'
import type { Appointment, AppointmentStatus } from '@/types'

const FILTERS: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'scheduled', label: 'Agendado' },
  { key: 'confirmed', label: 'Confirmado' },
  { key: 'in_progress', label: 'Em atendimento' },
  { key: 'completed', label: 'Finalizado' },
  { key: 'canceled', label: 'Cancelado' },
]

export default function AdminAppointments() {
  const { appointments, services, users, setAppointmentStatus, loading } = useStore()
  const [filter, setFilter] = useState<AppointmentStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Appointment | 'new' | null>(null)
  const [details, setDetails] = useState<Appointment | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Abre o popup de detalhes ao chegar via notificação (/admin/agendamentos?apt=ID)
  // Só limpa o parâmetro depois que os agendamentos terminarem de carregar, senão o popup
  // pode nunca abrir se o clique acontecer antes dos dados chegarem do Supabase.
  const aptParam = searchParams.get('apt')
  useEffect(() => {
    if (!aptParam || loading) return
    const apt = appointments.find((a) => a.id === aptParam)
    if (apt) setDetails(apt)
    else alert('Este agendamento não existe mais.')
    setSearchParams({}, { replace: true })
  }, [aptParam, appointments, loading, setSearchParams])

  const rows = useMemo(() => {
    const todayKey = todayISO()
    // compara por data e, em empate, por horário (ordem cronológica)
    const byDateTime = (a: Appointment, b: Appointment) =>
      a.date.localeCompare(b.date) || a.time.localeCompare(b.time)

    let list = [...appointments].sort((a, b) => {
      const aUpcoming = a.date >= todayKey
      const bUpcoming = b.date >= todayKey
      // próximos atendimentos primeiro; histórico depois
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1
      // próximos: do mais cedo para o mais tarde | passados: do mais recente para o mais antigo
      return aUpcoming ? byDateTime(a, b) : byDateTime(b, a)
    })

    if (filter !== 'all') list = list.filter((a) => a.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.clientName.toLowerCase().includes(q) ||
          a.serviceIds.some((id) => services.find((s) => s.id === id)?.name.toLowerCase().includes(q)),
      )
    }
    return list
  }, [appointments, filter, search, services])

  const svcNames = (ids: string[]) => ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Gestão de agendamentos"
        subtitle="Crie, edite e gerencie o status de todos os atendimentos."
        action={<Button onClick={() => setEditing('new')}><Plus size={16} /> Novo agendamento</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1 sm:overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition',
                filter === f.key ? 'border-gold-400 bg-gold-400 text-white' : 'border-cream-200 bg-white text-stone-500 hover:border-beige-300',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            placeholder="Buscar cliente ou serviço"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full pl-9 py-2 sm:w-64"
          />
        </div>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {rows.length === 0 && (
          <div className="card py-12 text-center text-stone-400">Nenhum agendamento encontrado.</div>
        )}
        {rows.map((a, i) => {
          const todayKey = todayISO()
          const aPast = a.date < todayKey
          const prevPast = i > 0 ? rows[i - 1].date < todayKey : null
          const showUpcomingLabel = i === 0 && !aPast
          const showHistoryLabel = aPast && (i === 0 || prevPast === false)
          return (
            <Fragment key={a.id}>
              {showUpcomingLabel && (
                <p className="px-1 pt-2 text-xs font-semibold uppercase tracking-wider text-gold-700">Próximos atendimentos</p>
              )}
              {showHistoryLabel && (
                <p className="px-1 pt-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Histórico</p>
              )}
              <div className="card space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-stone-700">{a.clientName}</p>
                    <p className="text-xs text-stone-400">{formatDateShort(a.date)} · {a.time}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-sm text-stone-500">{svcNames(a.serviceIds)}</p>
                <div className="flex items-center justify-between border-t border-cream-100 pt-3">
                  <span className="font-semibold text-gold-700">{formatCurrency(a.total)}</span>
                  <div className="flex items-center gap-1">
                    <IconBtn title="Ver detalhes" onClick={() => setDetails(a)} className="text-stone-500"><Eye size={16} /></IconBtn>
                    {a.status === 'scheduled' && (
                      <IconBtn title="Confirmar" onClick={() => setAppointmentStatus(a.id, 'confirmed')} className="text-gold-600"><Check size={16} /></IconBtn>
                    )}
                    {a.status === 'confirmed' && (
                      <IconBtn title="Iniciar atendimento" onClick={() => setAppointmentStatus(a.id, 'in_progress')} className="text-sky-600"><Play size={16} /></IconBtn>
                    )}
                    {a.status === 'in_progress' && (
                      <IconBtn title="Finalizar" onClick={() => setAppointmentStatus(a.id, 'completed')} className="text-emerald-600"><CheckCircle2 size={16} /></IconBtn>
                    )}
                    <IconBtn title="Editar" onClick={() => setEditing(a)} className="text-stone-500"><Pencil size={16} /></IconBtn>
                    {a.status !== 'canceled' && a.status !== 'completed' && (
                      <IconBtn title="Cancelar" onClick={() => setAppointmentStatus(a.id, 'canceled')} className="text-red-500"><XCircle size={16} /></IconBtn>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>

      {/* Desktop: table */}
      <div className="card hidden overflow-x-auto p-0 md:block">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-cream-200 bg-cream-50 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="px-5 py-3">Data / Hora</th>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Serviços</th>
              <th className="px-5 py-3">Valor</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="py-12 text-center text-stone-400">Nenhum agendamento encontrado.</td></tr>
            )}
            {rows.map((a, i) => {
              const todayKey = todayISO()
              const aPast = a.date < todayKey
              const prevPast = i > 0 ? rows[i - 1].date < todayKey : null
              const showUpcomingLabel = i === 0 && !aPast
              const showHistoryLabel = aPast && (i === 0 || prevPast === false)
              return (
                <Fragment key={a.id}>
                  {showUpcomingLabel && (
                    <tr>
                      <td colSpan={6} className="bg-cream-50/70 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-gold-700">
                        Próximos atendimentos
                      </td>
                    </tr>
                  )}
                  {showHistoryLabel && (
                    <tr>
                      <td colSpan={6} className="bg-cream-50/70 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Histórico
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-cream-100 transition hover:bg-cream-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-stone-700">{formatDateShort(a.date)}</p>
                  <p className="text-xs text-stone-400">{a.time}</p>
                </td>
                <td className="px-5 py-3 font-medium text-stone-700">{a.clientName}</td>
                <td className="px-5 py-3 text-stone-500">{svcNames(a.serviceIds)}</td>
                <td className="px-5 py-3 font-medium text-gold-700">{formatCurrency(a.total)}</td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <IconBtn title="Ver detalhes" onClick={() => setDetails(a)} className="text-stone-500"><Eye size={16} /></IconBtn>
                    {a.status === 'scheduled' && (
                      <IconBtn title="Confirmar" onClick={() => setAppointmentStatus(a.id, 'confirmed')} className="text-gold-600"><Check size={16} /></IconBtn>
                    )}
                    {a.status === 'confirmed' && (
                      <IconBtn title="Iniciar atendimento" onClick={() => setAppointmentStatus(a.id, 'in_progress')} className="text-sky-600"><Play size={16} /></IconBtn>
                    )}
                    {a.status === 'in_progress' && (
                      <IconBtn title="Finalizar" onClick={() => setAppointmentStatus(a.id, 'completed')} className="text-emerald-600"><CheckCircle2 size={16} /></IconBtn>
                    )}
                    <IconBtn title="Editar" onClick={() => setEditing(a)} className="text-stone-500"><Pencil size={16} /></IconBtn>
                    {a.status !== 'canceled' && a.status !== 'completed' && (
                      <IconBtn title="Cancelar" onClick={() => setAppointmentStatus(a.id, 'canceled')} className="text-red-500"><XCircle size={16} /></IconBtn>
                    )}
                  </div>
                </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <AppointmentForm
          appointment={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <AppointmentDetailsModal appointment={details} onClose={() => setDetails(null)} />
    </div>
  )
}

function IconBtn({ children, title, onClick, className }: { children: React.ReactNode; title: string; onClick: () => void; className?: string }) {
  return (
    <button title={title} onClick={onClick} className={cn('rounded-lg p-2 transition hover:bg-cream-100', className)}>
      {children}
    </button>
  )
}

function AppointmentForm({ appointment, onClose }: { appointment: Appointment | null; onClose: () => void }) {
  const { users, services, professionals, settings, appointments, createAppointment, updateAppointment } = useStore()
  const clients = users.filter((u) => u.role === 'client')
  const activeServices = services.filter((s) => s.active)
  const activePros = professionals.filter((p) => p.active)

  const [clientId, setClientId] = useState(appointment?.clientId ?? clients[0]?.id ?? '')
  const [date, setDate] = useState(appointment?.date ?? todayISO())
  const [time, setTime] = useState(appointment?.time ?? '')
  const [selected, setSelected] = useState<string[]>(appointment?.serviceIds ?? [])
  const [professional, setProfessional] = useState(appointment?.professional ?? activePros[0]?.name ?? '')
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status ?? 'scheduled')
  const [notes, setNotes] = useState(appointment?.notes ?? '')

  const total = selected.reduce((s, id) => s + (services.find((x) => x.id === id)?.price ?? 0), 0)
  const duration = selected.reduce((s, id) => s + (services.find((x) => x.id === id)?.duration ?? 0), 0)
  const slots = daySlots(date, settings, appointments, appointment?.id, duration)

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function save() {
    if (!clientId || selected.length === 0 || !time) return
    if (appointment) {
      updateAppointment(appointment.id, { clientId, date, time, serviceIds: selected, professional, status, notes, clientName: clients.find((c) => c.id === clientId)?.name })
    } else {
      createAppointment({ clientId, date, time, serviceIds: selected, professional, status, notes })
    }
    onClose()
  }

  return (
    <Modal open onClose={onClose} title={appointment ? 'Editar agendamento' : 'Novo agendamento'} size="lg">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Cliente" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Profissional" value={professional} onChange={(e) => setProfessional(e.target.value)}>
            {activePros.length === 0 && <option value="">Cadastre um profissional</option>}
            {/* mantém o valor antigo caso o profissional tenha sido desativado/removido */}
            {professional && !activePros.some((p) => p.name === professional) && (
              <option value={professional}>{professional}</option>
            )}
            {activePros.map((p) => (
              <option key={p.id} value={p.name}>{p.name} — {p.role}</option>
            ))}
          </Select>
        </div>

        <div>
          <label className="label">Serviços</label>
          <div className="grid max-h-40 gap-2 overflow-y-auto sm:grid-cols-2">
            {activeServices.map((s) => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition',
                  selected.includes(s.id) ? 'border-gold-400 bg-gold-300/10' : 'border-cream-200',
                )}
              >
                <span>{s.icon} {s.name}</span>
                <span className="text-xs text-stone-400">{formatCurrency(s.price)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Data" type="date" value={date} onChange={(e) => { setDate(e.target.value); setTime('') }} />
          <Select label="Horário" value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="">Selecione</option>
            {slots.map((s) => (
              <option key={s.time} value={s.time} disabled={!s.available && s.time !== appointment?.time}>
                {s.time} {!s.available && s.time !== appointment?.time ? '(ocupado)' : ''}
              </option>
            ))}
          </Select>
        </div>

        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus)}>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </Select>

        <Textarea label="Observações" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="flex items-center justify-between border-t border-cream-200 pt-4">
          <span className="font-serif text-xl font-semibold text-gold-700">Total: {formatCurrency(total)}</span>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button disabled={selected.length === 0 || !time} onClick={save}>Salvar</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
