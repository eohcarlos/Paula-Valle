import { Link } from 'react-router-dom'
import {
  CalendarPlus, CalendarClock, CheckCircle2, Wallet,
  Heart, Sparkles, ArrowRight, Clock, User, TrendingUp,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDateShort, todayISO } from '@/lib/utils'

export default function ClientDashboard() {
  const { currentUser, appointments, services } = useStore()
  if (!currentUser) return null

  const mine = appointments.filter((a) => a.clientId === currentUser.id)
  const completed = mine.filter((a) => a.status === 'completed')
  const upcoming = mine
    .filter((a) => ['scheduled', 'confirmed', 'in_progress'].includes(a.status) && a.date >= todayISO())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const next = upcoming[0]
  const totalSpent = completed.reduce((s, a) => s + a.total, 0)

  const freq = new Map<string, number>()
  completed.forEach((a) => a.serviceIds.forEach((id) => freq.set(id, (freq.get(id) ?? 0) + 1)))
  const topServices = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => services.find((s) => s.id === id))
    .filter(Boolean)

  const lastThree = [...completed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const firstName = currentUser.name.split(' ')[0]

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(201,163,94,0.30),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_90%,rgba(228,152,162,0.20),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
              <Sparkles size={11} /> Bem-vinda de volta
            </span>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-white">
              Olá, {firstName}! 👋
            </h1>
            <p className="mt-1.5 text-stone-400">
              {upcoming.length > 0
                ? `Você tem ${upcoming.length} agendamento${upcoming.length > 1 ? 's' : ''} próximo${upcoming.length > 1 ? 's' : ''}.`
                : 'Que tal agendar um horário hoje?'}
            </p>
          </div>
          <Link to="/app/agendar">
            <Button size="lg" className="gap-2 whitespace-nowrap shadow-gold">
              <CalendarPlus size={17} /> Novo agendamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Atendimentos', value: completed.length, icon: <CheckCircle2 size={20} />, accent: 'emerald', sub: 'finalizados' },
          { label: 'Total investido', value: formatCurrency(totalSpent), icon: <Wallet size={20} />, accent: 'gold', sub: 'em serviços' },
          { label: 'Pontos fidelidade', value: currentUser.points, icon: <Heart size={20} />, accent: 'blush', sub: '10 pts por visita' },
          { label: 'Próximos', value: upcoming.length, icon: <CalendarClock size={20} />, accent: 'sky', sub: 'agendamentos' },
        ].map((s) => (
          <div key={s.label} className="overflow-hidden rounded-3xl border border-cream-200 bg-white p-4 shadow-card">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${
              s.accent === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
              s.accent === 'gold'    ? 'bg-gold-300/30 text-gold-600' :
              s.accent === 'blush'   ? 'bg-blush-100 text-blush-500' :
                                       'bg-sky-100 text-sky-600'
            }`}>{s.icon}</div>
            <p className="font-serif text-2xl font-semibold text-stone-800">{s.value}</p>
            <p className="text-xs font-semibold text-stone-500">{s.label}</p>
            <p className="text-[10px] text-stone-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Próximo + Últimos */}
        <div className="space-y-5 lg:col-span-2">

          {/* Próximo agendamento */}
          <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
              <CalendarClock size={16} className="text-gold-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Próximo atendimento</p>
            </div>
            <div className="p-5">
              {next ? (
                <div className="relative overflow-hidden rounded-2xl border border-gold-300/40 bg-gradient-to-br from-cream-50 to-white p-5">
                  <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-10">
                    <Sparkles size={96} className="text-gold-400" />
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-2xl font-semibold text-stone-800">
                        {formatDateShort(next.date)}
                      </p>
                      <p className="mt-0.5 font-serif text-lg text-gold-600">{next.time}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-600">
                          <Sparkles size={11} />
                          {next.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', ')}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                          <User size={11} /> {next.professional}
                        </span>
                        <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                          <Clock size={11} /> {next.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={next.status} />
                      <span className="gold-text font-serif text-2xl font-semibold">{formatCurrency(next.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-cream-300 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cream-100">
                    <CalendarClock size={26} className="text-stone-300" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-stone-500">Nenhum agendamento futuro</p>
                    <p className="mt-1 text-sm text-stone-400">Que tal marcar um horário?</p>
                  </div>
                  <Link to="/app/agendar"><Button size="sm"><CalendarPlus size={15} /> Agendar agora</Button></Link>
                </div>
              )}
            </div>
          </div>

          {/* Últimos atendimentos */}
          <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-gold-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Últimos atendimentos</p>
              </div>
              {lastThree.length > 0 && (
                <Link to="/app/historico" className="flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-gold-700">
                  Ver tudo <ArrowRight size={12} />
                </Link>
              )}
            </div>
            <div className="p-5">
              {lastThree.length === 0 ? (
                <p className="py-6 text-center text-sm text-stone-400">Nenhum atendimento finalizado ainda.</p>
              ) : (
                <div className="space-y-2">
                  {lastThree.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 rounded-2xl border border-cream-100 px-4 py-3 transition hover:bg-cream-50">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-700">
                          {a.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', ')}
                        </p>
                        <p className="text-xs text-stone-400">{formatDateShort(a.date)} · {a.professional}</p>
                      </div>
                      <span className="shrink-0 font-serif text-base font-semibold text-gold-600">{formatCurrency(a.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Serviços mais realizados */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Heart size={16} className="text-blush-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Seus favoritos</p>
          </div>
          <div className="p-5">
            {topServices.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-stone-400">Faça atendimentos para ver seus serviços favoritos aqui.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topServices.map((s, i) => (
                  <div key={s!.id} className="flex items-center gap-3 rounded-2xl bg-cream-50 p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      {s!.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-700">{s!.name}</p>
                      <p className="text-xs text-stone-400">{freq.get(s!.id)}× realizado</p>
                    </div>
                    <span className="text-xs font-bold text-stone-300">#{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/app/agendar">
              <Button variant="secondary" className="mt-5 w-full">
                <CalendarPlus size={15} /> Agendar serviço
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
