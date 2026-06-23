import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, CalendarDays, Clock, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { daySlots, isWorkingDay } from '@/lib/availability'
import { cn, formatCurrency, nowBR, nowTimeBR, todayISO, WEEKDAYS_FULL } from '@/lib/utils'
import { format, addDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Booking() {
  const { currentUser, services, appointments, settings, createAppointment } = useStore()
  const navigate = useNavigate()

  const [date, setDate] = useState(todayISO())
  const [time, setTime] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)

  const activeServices = services.filter((s) => s.active)
  const total = selected.reduce((s, id) => s + (services.find((x) => x.id === id)?.price ?? 0), 0)
  const duration = selected.reduce((s, id) => s + (services.find((x) => x.id === id)?.duration ?? 0), 0)
  const slots = useMemo(() => {
    const all = daySlots(date, settings, appointments, undefined, duration)
    if (date !== todayISO()) return all
    const now = nowTimeBR()
    return all.filter((s) => s.time >= now)
  }, [date, settings, appointments, duration])
  const working = isWorkingDay(date, settings)

  // Janela de agendamento configurável (até X dias à frente)
  const windowDays = settings.bookingWindowDays || 14
  const quickDays = Array.from({ length: windowDays }, (_, i) => format(addDays(nowBR(), i), 'yyyy-MM-dd'))
  const maxDate = format(addDays(nowBR(), windowDays - 1), 'yyyy-MM-dd')

  function toggleService(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function confirm() {
    if (!currentUser || !time || selected.length === 0) return
    createAppointment({
      clientId: currentUser.id,
      serviceIds: selected,
      date,
      time,
      status: 'scheduled',
      notes,
      professional: 'A definir',
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md py-12 text-center animate-scale-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </div>
        <h2 className="mt-6 font-serif text-3xl font-semibold">Agendamento confirmado!</h2>
        <p className="mt-2 text-stone-500">
          {format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })} às {time}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate('/app/agendamentos')}>Ver meus agendamentos</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setDone(false)
              setSelected([])
              setTime('')
              setNotes('')
            }}
          >
            Agendar outro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Novo agendamento" subtitle="Escolha os serviços, a data e o horário ideais para você." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* 1. Serviços */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Sparkles size={18} className="text-gold-600" /> 1. Selecione os serviços
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeServices.map((s) => {
                const isSel = selected.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={cn(
                      'flex items-center justify-between rounded-2xl border p-4 text-left transition',
                      isSel
                        ? 'border-gold-400 bg-gold-300/10 shadow-sm'
                        : 'border-cream-200 hover:border-beige-300',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p className="font-medium text-stone-800">{s.name}</p>
                        <p className="text-xs text-stone-400">{s.duration} min • {formatCurrency(s.price)}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full border-2 transition',
                        isSel ? 'border-gold-500 bg-gold-500 text-white' : 'border-beige-300',
                      )}
                    >
                      {isSel && <Check size={14} />}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Data */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <CalendarDays size={18} className="text-gold-600" /> 2. Escolha a data
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickDays.map((d) => {
                const dt = parseISO(d)
                const isSel = d === date
                const work = isWorkingDay(d, settings)
                return (
                  <button
                    key={d}
                    disabled={!work}
                    onClick={() => {
                      setDate(d)
                      setTime('')
                    }}
                    className={cn(
                      'flex min-w-[64px] flex-col items-center rounded-2xl border px-3 py-2.5 transition',
                      isSel ? 'border-gold-400 bg-gold-400 text-white shadow-gold' : 'border-cream-200 hover:border-beige-300',
                      !work && 'cursor-not-allowed opacity-30',
                    )}
                  >
                    <span className="text-[10px] uppercase">{format(dt, 'EEE', { locale: ptBR })}</span>
                    <span className="text-lg font-semibold">{format(dt, 'dd')}</span>
                    <span className="text-[10px]">{format(dt, 'MMM', { locale: ptBR })}</span>
                  </button>
                )
              })}
            </div>
            <input
              type="date"
              value={date}
              min={todayISO()}
              max={maxDate}
              onChange={(e) => {
                setDate(e.target.value)
                setTime('')
              }}
              className="input-field mt-3 max-w-xs"
            />
          </div>

          {/* 3. Horário */}
          <div className="card">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Clock size={18} className="text-gold-600" /> 3. Escolha o horário
            </h3>
            {!working ? (
              <div className="flex items-center gap-2 rounded-2xl bg-blush-50 p-4 text-sm text-blush-500">
                <AlertTriangle size={18} /> O salão não atende em {WEEKDAYS_FULL[parseISO(date).getDay()]}.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    className={cn(
                      'rounded-xl border py-2.5 text-sm font-medium transition',
                      time === slot.time
                        ? 'border-gold-400 bg-gold-400 text-white shadow-gold'
                        : slot.available
                          ? 'border-cream-200 text-stone-700 hover:border-gold-300'
                          : 'cursor-not-allowed border-cream-100 bg-cream-50 text-stone-300 line-through',
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Observações */}
          <div className="card">
            <h3 className="mb-3 font-semibold">4. Observações (opcional)</h3>
            <Textarea
              rows={3}
              placeholder="Alguma preferência ou informação importante?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Resumo */}
        <div className="min-w-0 lg:sticky lg:top-4 lg:h-fit">
          <div className="card border-gold-300/40 bg-gradient-to-br from-white to-cream-50 p-5 sm:p-6">
            <h3 className="mb-4 font-semibold">Resumo</h3>
            {selected.length === 0 ? (
              <p className="text-sm text-stone-400">Nenhum serviço selecionado.</p>
            ) : (
              <div className="space-y-2">
                {selected.map((id) => {
                  const s = services.find((x) => x.id === id)!
                  return (
                    <div key={id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 flex-1 truncate text-stone-600">{s.icon} {s.name}</span>
                      <span className="shrink-0 font-medium">{formatCurrency(s.price)}</span>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="my-4 border-t border-cream-200" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-3 text-stone-500">
                <span className="min-w-0 truncate">Duração estimada</span>
                <span className="shrink-0">{duration} min</span>
              </div>
              <div className="flex justify-between gap-3 text-stone-500">
                <span className="min-w-0 truncate">Data</span>
                <span className="shrink-0">{date.split('-').reverse().join('/')}</span>
              </div>
              <div className="flex justify-between gap-3 text-stone-500">
                <span className="min-w-0 truncate">Horário</span>
                <span className="shrink-0">{time || '—'}</span>
              </div>
            </div>
            <div className="my-4 border-t border-cream-200" />
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate font-medium text-stone-700">Total</span>
              <span className="shrink-0 font-serif text-2xl font-semibold text-gold-700">{formatCurrency(total)}</span>
            </div>

            <Button
              className="mt-5 w-full"
              size="lg"
              disabled={selected.length === 0 || !time}
              onClick={confirm}
            >
              Confirmar agendamento
            </Button>
            {(selected.length === 0 || !time) && (
              <p className="mt-2 text-center text-xs text-stone-400">
                Selecione ao menos um serviço e um horário.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
