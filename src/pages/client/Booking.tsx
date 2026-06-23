import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  CalendarDays,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { daySlots, isWorkingDay } from '@/lib/availability'
import { cn, formatCurrency, nowBR, nowTimeBR, todayISO, WEEKDAYS_FULL } from '@/lib/utils'
import { format, addDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STEPS = [
  { n: 1, label: 'Serviços' },
  { n: 2, label: 'Data' },
  { n: 3, label: 'Horário' },
  { n: 4, label: 'Confirmar' },
]

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
  const windowDays = settings.bookingWindowDays || 14
  const quickDays = Array.from({ length: windowDays }, (_, i) =>
    format(addDays(nowBR(), i), 'yyyy-MM-dd'),
  )
  const maxDate = format(addDays(nowBR(), windowDays - 1), 'yyyy-MM-dd')

  // Progresso para o stepper
  const step1Done = selected.length > 0
  const step3Done = !!time
  const activeStep = !step1Done ? 1 : !step3Done ? 3 : 4

  function toggleService(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
    setTime('')
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

  /* ── Tela de sucesso ─────────────────────────────────────────── */
  if (done) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center animate-scale-in">
        <div className="relative mx-auto mb-8 h-32 w-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-200/60 to-gold-300/30 blur-xl" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 shadow-soft">
            <CheckCircle2 size={52} className="text-emerald-500" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="font-serif text-4xl font-semibold text-stone-800">Tudo confirmado!</h2>
        <p className="mt-2 text-stone-400">Seu agendamento foi realizado com sucesso.</p>

        <div className="mx-auto mt-8 max-w-xs overflow-hidden rounded-3xl border border-gold-300/50 shadow-soft">
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">Studio Paula Valle</p>
          </div>
          <div className="space-y-2 bg-gradient-to-br from-white to-cream-100 p-5">
            <p className="font-serif text-2xl font-semibold text-stone-800">
              {format(parseISO(date), "dd 'de' MMMM", { locale: ptBR })}
            </p>
            <p className="text-stone-400">
              {format(parseISO(date), 'EEEE', { locale: ptBR })} · {time}
            </p>
            <div className="border-t border-cream-200 pt-3 text-sm text-stone-500">
              {selected.map((id) => services.find((x) => x.id === id)?.name).join(', ')}
            </div>
            <p className="font-serif text-xl font-semibold text-gold-600">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" onClick={() => navigate('/app/agendamentos')}>
            Meus agendamentos
          </Button>
          <Button
            variant="secondary"
            size="lg"
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

  /* ── Página principal ────────────────────────────────────────── */
  return (
    <div className="space-y-6 pb-28 lg:pb-0">

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-9 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(201,163,94,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(228,152,162,0.18),transparent_50%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <Sparkles size={11} /> Studio Paula Valle
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Novo agendamento
          </h1>
          <p className="mt-1.5 text-sm text-stone-400">
            Selecione os serviços, data e horário ideais para você.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-2xl bg-cream-50/80 px-4 py-3 lg:px-8">
      <div className="flex items-center px-1">
        {STEPS.map((step, i) => {
          const isStepDone =
            step.n === 1 ? step1Done :
            step.n === 2 ? step1Done :
            step.n === 3 ? step3Done :
            false
          const isActive = step.n === activeStep

          return (
            <div key={step.n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                  isStepDone
                    ? 'bg-gold-500 text-white shadow-gold'
                    : isActive
                      ? 'bg-white text-gold-700 ring-2 ring-gold-400 ring-offset-2 ring-offset-cream-50'
                      : 'bg-cream-200 text-stone-400',
                )}>
                  {isStepDone ? <Check size={14} /> : step.n}
                </div>
                <span className={cn(
                  'hidden text-[10px] font-medium uppercase tracking-wide sm:block',
                  isActive ? 'text-gold-700' : isStepDone ? 'text-stone-500' : 'text-stone-300',
                )}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'mx-1 mb-5 h-0.5 flex-1 rounded-full transition-all duration-500 sm:mx-2',
                  isStepDone ? 'bg-gold-400' : 'bg-cream-200',
                )} />
              )}
            </div>
          )
        })}
      </div>
      </div>

      {/* Corpo */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="min-w-0 space-y-5 lg:col-span-2">

          {/* Passo 1 — Serviços */}
          <StepCard step={1} title="Serviços" icon={<Sparkles size={16} />}>
            {activeServices.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-400">Nenhum serviço disponível.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {activeServices.map((s) => {
                  const isSel = selected.includes(s.id)
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={cn(
                        'group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200',
                        isSel
                          ? 'border-gold-400 bg-gradient-to-br from-gold-300/10 to-cream-100 shadow-md shadow-gold-200/40'
                          : 'border-cream-200 bg-white hover:border-gold-300/70 hover:shadow-sm',
                      )}
                    >
                      <div className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all',
                        isSel ? 'bg-gold-400/15 scale-105' : 'bg-cream-100 group-hover:bg-cream-200',
                      )}>
                        {s.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-base font-semibold leading-snug text-stone-800">
                          {s.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-400">
                          <Clock size={10} />
                          <span>{s.duration} min</span>
                          <span className="text-stone-300">·</span>
                          <span className={cn('font-semibold', isSel ? 'text-gold-600' : 'text-stone-500')}>
                            {formatCurrency(s.price)}
                          </span>
                        </div>
                      </div>
                      <div className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
                        isSel
                          ? 'scale-110 border-gold-500 bg-gold-500 text-white'
                          : 'border-cream-300 group-hover:border-gold-300',
                      )}>
                        {isSel && <Check size={13} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </StepCard>

          {/* Passo 2 — Data */}
          <StepCard step={2} title="Data" icon={<CalendarDays size={16} />}>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickDays.map((d) => {
                const dt = parseISO(d)
                const isSel = d === date
                const isToday = d === todayISO()
                const work = isWorkingDay(d, settings)
                return (
                  <button
                    key={d}
                    disabled={!work}
                    onClick={() => { setDate(d); setTime('') }}
                    className={cn(
                      'relative flex min-w-[60px] flex-col items-center rounded-2xl border px-3 py-3 transition-all duration-200',
                      isSel
                        ? 'border-gold-400 bg-gradient-to-b from-gold-400 to-gold-500 text-white shadow-gold'
                        : work
                          ? 'border-cream-200 bg-white text-stone-600 hover:border-gold-300 hover:shadow-sm'
                          : 'cursor-not-allowed border-cream-100 bg-cream-50 opacity-30',
                    )}
                  >
                    {isToday && !isSel && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blush-400 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-white">
                        hoje
                      </span>
                    )}
                    <span className={cn(
                      'text-[10px] font-semibold uppercase tracking-wide',
                      isSel ? 'text-gold-100' : 'text-stone-400',
                    )}>
                      {format(dt, 'EEE', { locale: ptBR })}
                    </span>
                    <span className={cn('mt-0.5 text-xl font-bold leading-none', isSel ? 'text-white' : '')}>
                      {format(dt, 'dd')}
                    </span>
                    <span className={cn('mt-0.5 text-[10px]', isSel ? 'text-gold-100' : 'text-stone-400')}>
                      {format(dt, 'MMM', { locale: ptBR })}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-cream-200" />
              <span className="text-[11px] font-medium text-stone-400">ou insira outra data</span>
              <div className="h-px flex-1 bg-cream-200" />
            </div>
            <input
              type="date"
              value={date}
              min={todayISO()}
              max={maxDate}
              onChange={(e) => {
                const picked = e.target.value
                if (!picked || picked < todayISO()) return
                setDate(picked)
                setTime('')
              }}
              className="input-field mt-3 max-w-[200px] text-sm"
            />
          </StepCard>

          {/* Passo 3 — Horário */}
          <StepCard step={3} title="Horário" icon={<Clock size={16} />}>
            {!working ? (
              <div className="flex items-center gap-4 rounded-2xl border border-blush-200 bg-blush-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blush-100">
                  <AlertTriangle size={18} className="text-blush-500" />
                </div>
                <div>
                  <p className="font-medium text-blush-700">Salão fechado neste dia</p>
                  <p className="text-sm text-blush-500">
                    Não atendemos às {WEEKDAYS_FULL[parseISO(date).getDay()].toLowerCase()}s. Escolha outra data.
                  </p>
                </div>
              </div>
            ) : slots.length === 0 ? (
              <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <Clock size={18} className="text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-amber-700">Sem horários disponíveis</p>
                  <p className="text-sm text-amber-600">
                    Todos os horários desta data estão ocupados. Tente outro dia.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    className={cn(
                      'rounded-xl border py-3 text-sm font-medium transition-all duration-150',
                      time === slot.time
                        ? 'scale-105 border-gold-400 bg-gradient-to-b from-gold-400 to-gold-500 text-white shadow-gold'
                        : slot.available
                          ? 'border-cream-200 bg-white text-stone-600 hover:scale-[1.03] hover:border-gold-300 hover:shadow-sm'
                          : 'cursor-not-allowed border-cream-100 bg-cream-50 text-stone-300 line-through',
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </StepCard>

          {/* Passo 4 — Observações */}
          <StepCard step={4} title="Observações" icon={<FileText size={16} />} optional>
            <Textarea
              rows={3}
              placeholder="Alguma preferência, alergia ou informação importante para o profissional?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </StepCard>

        </div>

        {/* Sidebar — Resumo sticky (desktop only) */}
        <div className="hidden lg:block lg:sticky lg:top-[84px] lg:h-fit">
          <div className="overflow-hidden rounded-3xl border border-gold-300/40 shadow-soft">
            <div className="bg-gradient-to-br from-stone-800 to-stone-900 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold-500">Resumo do pedido</p>
            </div>

            <div className="bg-gradient-to-br from-white to-cream-50 p-5">
              {selected.length === 0 ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-100">
                    <Sparkles size={22} className="text-stone-300" />
                  </div>
                  <p className="text-sm text-stone-400">Selecione ao menos<br />um serviço para continuar.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selected.map((id) => {
                    const s = services.find((x) => x.id === id)!
                    return (
                      <div key={id} className="flex items-center gap-2.5">
                        <span className="text-lg leading-none">{s.icon}</span>
                        <span className="min-w-0 flex-1 truncate text-sm text-stone-600">{s.name}</span>
                        <span className="shrink-0 text-sm font-semibold text-stone-700">{formatCurrency(s.price)}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {selected.length > 0 && (
                <>
                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-cream-300 to-transparent" />
                  <div className="space-y-2.5">
                    <SummaryRow label="Duração">
                      {duration} min
                    </SummaryRow>
                    <SummaryRow label="Data">
                      {format(parseISO(date), "dd 'de' MMM", { locale: ptBR })}
                    </SummaryRow>
                    <SummaryRow label="Horário">
                      <span className={time ? 'text-stone-700' : 'text-stone-300'}>{time || '—'}</span>
                    </SummaryRow>
                  </div>

                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-cream-300 to-transparent" />
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-stone-400">Total</span>
                    <span className="gold-text font-serif text-3xl font-semibold leading-none">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </>
              )}

              <Button
                className="mt-5 w-full"
                size="lg"
                disabled={selected.length === 0 || !time}
                onClick={confirm}
              >
                Confirmar agendamento
                <ArrowRight size={17} />
              </Button>

              <p className={cn(
                'mt-3 text-center text-xs transition-all',
                selected.length === 0 || !time ? 'text-stone-400' : 'text-transparent',
              )}>
                {selected.length === 0
                  ? 'Escolha seus serviços acima'
                  : 'Selecione um horário para continuar'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra fixa inferior — mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <div className="border-t border-cream-200 bg-white/90 px-4 py-3 backdrop-blur-md">
          {selected.length === 0 ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-stone-400">Selecione um serviço para começar</p>
              <span className="font-serif text-2xl font-semibold text-stone-300">R$ —</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="truncate text-xs text-stone-400">
                  {selected.map((id) => services.find((x) => x.id === id)?.name).join(', ')}
                </p>
                <p className="font-serif text-xl font-semibold text-gold-700">{formatCurrency(total)}</p>
              </div>
              <Button
                size="lg"
                disabled={!time}
                onClick={confirm}
                className="shrink-0"
              >
                {time ? 'Confirmar' : 'Escolha o horário'}
                {time && <ArrowRight size={17} />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Componentes auxiliares ──────────────────────────────────── */

function StepCard({
  step, title, icon, optional, children,
}: {
  step: number
  title: string
  icon: React.ReactNode
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300/40 to-gold-400/20 text-gold-600">
          {icon}
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Passo {step}</p>
            <h3 className="font-serif text-xl font-semibold leading-tight text-stone-800">{title}</h3>
          </div>
          {optional && (
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
              Opcional
            </span>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-stone-400">{label}</span>
      <span className="font-medium text-stone-600">{children}</span>
    </div>
  )
}
