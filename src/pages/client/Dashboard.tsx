import { Link } from 'react-router-dom'
import { CalendarPlus, CalendarClock, CheckCircle2, Wallet, Heart, Sparkles, ArrowRight } from 'lucide-react'
import { useStore } from '@/store/store'
import { StatCard } from '@/components/ui/StatCard'
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

  // serviços favoritos por frequência
  const freq = new Map<string, number>()
  completed.forEach((a) => a.serviceIds.forEach((id) => freq.set(id, (freq.get(id) ?? 0) + 1)))
  const topServices = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => services.find((s) => s.id === id))
    .filter(Boolean)

  const lastThree = [...completed].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

  return (
    <div className="space-y-7">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-7 text-white shadow-gold">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm text-white/80">
              <Sparkles size={16} /> Olá, que bom te ver!
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-white">{currentUser.name.split(' ')[0]}</h1>
            <p className="mt-1 text-white/85">Você tem {upcoming.length} agendamento(s) próximo(s).</p>
          </div>
          <Link to="/app/agendar">
            <button className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-gold-700 shadow-lg transition hover:scale-105">
              <CalendarPlus size={18} /> Novo agendamento
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Atendimentos" value={completed.length} icon={<CheckCircle2 />} accent="emerald" />
        <StatCard label="Total investido" value={formatCurrency(totalSpent)} icon={<Wallet />} accent="gold" />
        <StatCard label="Pontos fidelidade" value={currentUser.points} icon={<Heart />} accent="blush" hint="10 pts por atendimento" />
        <StatCard label="Próximos" value={upcoming.length} icon={<CalendarClock />} accent="sky" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Próximo agendamento */}
        <div className="card lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Próximo agendamento</h2>
          {next ? (
            <div className="rounded-2xl border border-gold-300/40 bg-gradient-to-br from-cream-50 to-blush-50/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl font-semibold text-stone-800">
                    {formatDateShort(next.date)} • {next.time}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {next.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', ')}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-400">com {next.professional}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={next.status} />
                  <p className="mt-2 font-serif text-xl font-semibold text-gold-700">{formatCurrency(next.total)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-beige-300 p-8 text-center">
              <p className="text-stone-400">Você não tem agendamentos futuros.</p>
              <Link to="/app/agendar">
                <Button className="mt-4">Agendar agora</Button>
              </Link>
            </div>
          )}

          {/* Últimos atendimentos */}
          <h2 className="mb-3 mt-7 text-lg font-semibold">Últimos atendimentos</h2>
          <div className="space-y-2">
            {lastThree.length === 0 && <p className="text-sm text-stone-400">Nenhum atendimento ainda.</p>}
            {lastThree.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-2xl border border-cream-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-stone-700">
                    {a.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', ')}
                  </p>
                  <p className="text-xs text-stone-400">{formatDateShort(a.date)} • {a.professional}</p>
                </div>
                <span className="font-medium text-gold-700">{formatCurrency(a.total)}</span>
              </div>
            ))}
          </div>
          {lastThree.length > 0 && (
            <Link to="/app/historico" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:underline">
              Ver histórico completo <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Serviços favoritos */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold">Seus favoritos</h2>
          {topServices.length === 0 ? (
            <p className="text-sm text-stone-400">Faça atendimentos para ver seus serviços mais realizados.</p>
          ) : (
            <div className="space-y-3">
              {topServices.map((s) => (
                <div key={s!.id} className="flex items-center gap-3 rounded-2xl bg-cream-50 p-3">
                  <span className="text-2xl">{s!.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700">{s!.name}</p>
                    <p className="text-xs text-stone-400">{freq.get(s!.id)}x realizado</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link to="/app/agendar">
            <Button variant="secondary" className="mt-5 w-full">
              <CalendarPlus size={16} /> Agendar serviço
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
