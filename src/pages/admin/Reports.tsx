import { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import {
  FileText, FileSpreadsheet, Scissors, Users, Wallet, CheckCircle2,
  TrendingUp, Star, BarChart3,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { cn, formatCurrency, formatDateShort, nowBR } from '@/lib/utils'
import { exportToPDF, exportToExcel } from '@/lib/export'
import { subDays, subMonths, parseISO, isAfter, format } from 'date-fns'

type Period = 'day' | 'week' | 'month'

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Último dia',
  week: 'Última semana',
  month: 'Último mês',
}

export default function Reports() {
  const { appointments, users, services } = useStore()
  const [period, setPeriod] = useState<Period>('month')

  const since = useMemo(() => {
    const now = nowBR()
    if (period === 'day') return subDays(now, 1)
    if (period === 'week') return subDays(now, 7)
    return subMonths(now, 1)
  }, [period])

  const completed = useMemo(
    () => appointments.filter((a) => a.status === 'completed' && isAfter(parseISO(a.date), since)),
    [appointments, since],
  )

  const revenue = completed.reduce((s, a) => s + a.total, 0)

  const topServices = useMemo(() => {
    const map = new Map<string, { qtd: number; total: number }>()
    completed.forEach((a) =>
      a.serviceIds.forEach((id) => {
        const cur = map.get(id) ?? { qtd: 0, total: 0 }
        cur.qtd += 1
        cur.total += services.find((s) => s.id === id)?.price ?? 0
        map.set(id, cur)
      }),
    )
    return [...map.entries()]
      .map(([id, v]) => ({ name: services.find((s) => s.id === id)?.name ?? id, ...v }))
      .sort((a, b) => b.qtd - a.qtd)
  }, [completed, services])

  const topClients = useMemo(() => {
    const map = new Map<string, { qtd: number; total: number }>()
    completed.forEach((a) => {
      const cur = map.get(a.clientId) ?? { qtd: 0, total: 0 }
      cur.qtd += 1
      cur.total += a.total
      map.set(a.clientId, cur)
    })
    return [...map.entries()]
      .map(([id, v]) => ({ name: users.find((u) => u.id === id)?.name ?? 'Cliente', ...v }))
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 5)
  }, [completed, users])

  function exportPDF() {
    exportToPDF(
      `Relatório ${PERIOD_LABELS[period]}`,
      `Salão Paula Valle • Gerado em ${format(nowBR(), 'dd/MM/yyyy')}`,
      ['Data', 'Cliente', 'Serviços', 'Profissional', 'Valor'],
      completed.map((a) => [
        formatDateShort(a.date),
        a.clientName,
        a.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', '),
        a.professional,
        formatCurrency(a.total),
      ]),
    )
  }

  function exportXLS() {
    exportToExcel(
      `Relatorio ${PERIOD_LABELS[period]}`,
      completed.map((a) => ({
        Data: formatDateShort(a.date),
        Hora: a.time,
        Cliente: a.clientName,
        Serviços: a.serviceIds.map((id) => services.find((s) => s.id === id)?.name).join(', '),
        Profissional: a.professional,
        Valor: a.total,
      })),
    )
  }

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-9 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(201,163,94,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(228,152,162,0.18),transparent_50%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
              <BarChart3 size={11} /> Relatórios
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Análise de desempenho
            </h1>
            <p className="mt-1.5 text-stone-400">Acompanhe o faturamento e os dados do salão por período.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportPDF} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <FileText size={16} /> PDF
            </Button>
            <Button variant="secondary" onClick={exportXLS} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <FileSpreadsheet size={16} /> Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Seletor de período */}
      <div className="flex gap-1 rounded-2xl bg-cream-100 p-1 w-fit">
        {(['day', 'week', 'month'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'rounded-xl px-5 py-2 text-sm font-medium transition',
              period === p ? 'bg-white text-gold-700 shadow-sm' : 'text-stone-500 hover:text-stone-700',
            )}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Atendimentos" value={completed.length} icon={<CheckCircle2 />} accent="emerald" />
        <StatCard label="Faturamento" value={formatCurrency(revenue)} icon={<Wallet />} accent="gold" />
        <StatCard label="Ticket médio" value={formatCurrency(completed.length ? revenue / completed.length : 0)} icon={<Scissors />} accent="blush" />
        <StatCard label="Clientes ativos" value={topClients.length} icon={<Users />} accent="sky" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Serviços mais realizados */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Scissors size={16} className="text-gold-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Serviços mais realizados</p>
          </div>
          <div className="p-5">
            {topServices.length === 0 ? (
              <p className="py-10 text-center text-sm text-stone-400">Sem dados no período.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topServices.slice(0, 7)} margin={{ left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EADDCB" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} stroke="#A8A29E" tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis fontSize={11} stroke="#A8A29E" tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="qtd" name="Qtd" radius={[8, 8, 0, 0]} fill="#C9A35E" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Clientes mais frequentes */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Star size={16} className="text-gold-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Clientes mais frequentes</p>
          </div>
          <div className="p-5">
            {topClients.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-100">
                  <Users size={22} className="text-stone-300" />
                </div>
                <p className="text-sm text-stone-400">Sem dados no período.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {topClients.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-2xl border border-cream-100 px-4 py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-300/20 text-sm font-bold text-gold-700">
                      #{i + 1}
                    </span>
                    <p className="flex-1 font-medium text-stone-700">{c.name}</p>
                    <span className="text-sm text-stone-400">{c.qtd}x</span>
                    <span className="font-serif text-base font-semibold text-gold-600">{formatCurrency(c.total)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
