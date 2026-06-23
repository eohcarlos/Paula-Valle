import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  CalendarCheck,
  CalendarRange,
  Users,
  Scissors,
  Wallet,
  TrendingUp,
  CalendarClock,
  BadgeCheck,
  Activity,
  XCircle,
  Receipt,
  Star,
  Percent,
  LayoutDashboard,
  ListOrdered,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { cn, formatCurrency, isAppointmentLate, nowBR, todayISO } from '@/lib/utils'
import { format, subDays, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const PIE_COLORS = ['#C9A35E', '#E498A2', '#D9B978', '#B79468', '#EFBAC0', '#8F6F35', '#DEC9AE']

export default function AdminDashboard() {
  const { appointments, users, services } = useStore()
  const today = todayISO()
  const clients = users.filter((u) => u.role === 'client')

  const stats = useMemo(() => {
    const active = appointments.filter((a) => a.status !== 'canceled')
    const todays = active.filter((a) => a.date === today)
    const weekStart = startOfWeek(nowBR(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(nowBR(), { weekStartsOn: 1 })
    const week = active.filter((a) => isWithinInterval(parseISO(a.date), { start: weekStart, end: weekEnd }))
    const completed = appointments.filter((a) => a.status === 'completed')
    const todayRevenue = completed.filter((a) => a.date === today).reduce((s, a) => s + a.total, 0)
    const monthKey = today.slice(0, 7)
    const monthRevenue = completed.filter((a) => a.date.startsWith(monthKey)).reduce((s, a) => s + a.total, 0)
    const totalRevenue = completed.reduce((s, a) => s + a.total, 0)

    // Contagem por status
    const scheduled = appointments.filter((a) => a.status === 'scheduled').length
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length
    const inProgress = appointments.filter((a) => a.status === 'in_progress').length
    const canceled = appointments.filter((a) => a.status === 'canceled').length
    const pending = scheduled + confirmed // aguardando atendimento

    // Indicadores
    const avgTicket = completed.length ? totalRevenue / completed.length : 0
    const rated = completed.filter((a) => typeof a.rating === 'number')
    const avgRating = rated.length ? rated.reduce((s, a) => s + (a.rating ?? 0), 0) / rated.length : 0
    const cancelRate = appointments.length ? (canceled / appointments.length) * 100 : 0
    const newClients = users.filter((u) => u.role === 'client' && u.createdAt.startsWith(monthKey)).length

    return {
      todays,
      week,
      completed,
      todayRevenue,
      monthRevenue,
      totalRevenue,
      scheduled,
      confirmed,
      inProgress,
      canceled,
      pending,
      avgTicket,
      avgRating,
      cancelRate,
      newClients,
    }
  }, [appointments, today, users])

  // Faturamento últimos 7 dias
  const revenueData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = format(subDays(nowBR(), 6 - i), 'yyyy-MM-dd')
      const total = appointments
        .filter((a) => a.date === d && a.status === 'completed')
        .reduce((s, a) => s + a.total, 0)
      return { dia: format(parseISO(d), 'dd/MM'), valor: total }
    })
  }, [appointments])

  // Serviços mais realizados
  const serviceData = useMemo(() => {
    const map = new Map<string, number>()
    appointments
      .filter((a) => a.status === 'completed')
      .forEach((a) => a.serviceIds.forEach((id) => map.set(id, (map.get(id) ?? 0) + 1)))
    return [...map.entries()]
      .map(([id, qtd]) => ({ name: services.find((s) => s.id === id)?.name ?? id, value: qtd }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [appointments, services])

  // Atualiza a cada minuto para que atendimentos saiam de "próximos" e entrem em "atrasados" sem precisar recarregar a página
  const [now, setNow] = useState(nowBR)
  useEffect(() => {
    const id = setInterval(() => setNow(nowBR()), 30_000)
    return () => clearInterval(id)
  }, [])
  const upcomingToday = stats.todays
    .filter((a) => ['scheduled', 'confirmed', 'in_progress'].includes(a.status))
    .map((a) => ({ ...a, isLate: isAppointmentLate(a.date, a.time, a.status) }))
    .sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-7">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-9 sm:px-10">
        {/* Radial gradient overlays */}
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at 20% 50%, #C9A35E33 0%, transparent 60%)' }} />
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 80% 20%, #E498A222 0%, transparent 55%)' }} />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
              Painel Admin
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">Dashboard</h1>
            <p className="mt-1 capitalize text-stone-300">{format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
          </div>

          {/* Stat summary strip */}
          <div className="flex gap-4 sm:gap-6">
            <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Hoje</span>
              <span className="font-serif text-2xl font-semibold text-white">{stats.todays.length}</span>
              <span className="text-xs text-stone-400">agendamentos</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">Receita</span>
              <span className="font-serif text-2xl font-semibold text-gold-300">{formatCurrency(stats.todayRevenue)}</span>
              <span className="text-xs text-stone-400">hoje</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operacional */}
      <div>
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <CalendarCheck size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Visão geral</span>
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Agendamentos hoje" value={stats.todays.length} icon={<CalendarCheck />} accent="gold" />
              <StatCard label="Esta semana" value={stats.week.length} icon={<CalendarRange />} accent="sky" hint="agendamentos" />
              <StatCard label="Clientes" value={clients.length} icon={<Users />} accent="blush" hint={`+${stats.newClients} este mês`} />
              <StatCard label="Atendimentos" value={stats.completed.length} icon={<Scissors />} accent="emerald" hint="finalizados" />
            </div>
          </div>
        </div>
      </div>

      {/* Status dos agendamentos */}
      <div>
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Activity size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Status dos agendamentos</span>
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Agendados" value={stats.scheduled} icon={<CalendarClock />} accent="amber" hint="aguardando confirmação" />
              <StatCard label="Confirmados" value={stats.confirmed} icon={<BadgeCheck />} accent="gold" hint="prontos para atender" />
              <StatCard label="Em atendimento" value={stats.inProgress} icon={<Activity />} accent="sky" hint="acontecendo agora" />
              <StatCard label="Cancelados" value={stats.canceled} icon={<XCircle />} accent="rose" hint="total cancelado" />
            </div>
          </div>
        </div>
      </div>

      {/* Faturamento */}
      <div>
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Wallet size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Faturamento</span>
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Hoje" value={formatCurrency(stats.todayRevenue)} icon={<Wallet />} accent="gold" hint="atendimentos de hoje" />
              <StatCard label="Este mês" value={formatCurrency(stats.monthRevenue)} icon={<TrendingUp />} accent="sky" hint="mês atual" />
              <StatCard label="Total acumulado" value={formatCurrency(stats.totalRevenue)} icon={<Wallet />} accent="emerald" hint={`${stats.completed.length} atendimentos finalizados`} />
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <div>
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Receipt size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Indicadores</span>
          </div>
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Ticket médio" value={formatCurrency(stats.avgTicket)} icon={<Receipt />} accent="gold" hint="por atendimento" />
              <StatCard label="Avaliação média" value={stats.avgRating ? `${stats.avgRating.toFixed(1)} ★` : '—'} icon={<Star />} accent="amber" hint="satisfação dos clientes" />
              <StatCard label="Taxa de cancelamento" value={`${stats.cancelRate.toFixed(0)}%`} icon={<Percent />} accent="rose" hint="do total de agendamentos" />
              <StatCard label="Pendentes" value={stats.pending} icon={<CalendarClock />} accent="violet" hint="a realizar" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Faturamento */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <TrendingUp size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Faturamento (últimos 7 dias)</span>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A35E" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#C9A35E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EADDCB" vertical={false} />
                <XAxis dataKey="dia" stroke="#A8A29E" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#A8A29E" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="valor" stroke="#C9A35E" strokeWidth={3} fill="url(#gold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Serviços populares (pizza) */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Scissors size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Serviços mais realizados</span>
          </div>
          <div className="p-5">
            {serviceData.length === 0 ? (
              <p className="py-12 text-center text-sm text-stone-400">Sem dados ainda.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={serviceData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={80} innerRadius={45}>
                    {serviceData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Agenda de hoje */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <CalendarCheck size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Próximos atendimentos de hoje</span>
          </div>
          <div className="p-5">
            {upcomingToday.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-400">Nenhum atendimento pendente hoje.</p>
            ) : (
              <div className="space-y-2">
                {upcomingToday.map((a) => (
                  <div
                    key={a.id}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl border px-4 py-3',
                      a.isLate ? 'border-red-200 bg-red-50/50' : 'border-cream-200',
                    )}
                  >
                    <span className={cn('font-serif text-lg font-semibold', a.isLate ? 'text-red-600' : 'text-gold-700')}>{a.time}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-700">{a.clientName}</p>
                      <p className="text-xs text-stone-400">
                        {a.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', ')}
                      </p>
                    </div>
                    {a.isLate && <span className="text-xs font-semibold uppercase tracking-wide text-red-500">Atrasado</span>}
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top serviços (barras) */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <ListOrdered size={17} className="text-gold-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Ranking de serviços</span>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={serviceData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={90} fontSize={11} stroke="#A8A29E" tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#E498A2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
