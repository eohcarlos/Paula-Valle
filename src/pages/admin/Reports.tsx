import { useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { FileText, FileSpreadsheet, Scissors, Users, Wallet, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { cn, formatCurrency, formatDateShort } from '@/lib/utils'
import { exportToPDF, exportToExcel } from '@/lib/export'
import { subDays, subMonths, parseISO, isAfter } from 'date-fns'

type Period = 'day' | 'week' | 'month'

export default function Reports() {
  const { appointments, users, services } = useStore()
  const [period, setPeriod] = useState<Period>('month')

  const since = useMemo(() => {
    const now = new Date()
    if (period === 'day') return subDays(now, 1)
    if (period === 'week') return subDays(now, 7)
    return subMonths(now, 1)
  }, [period])

  const completed = useMemo(
    () => appointments.filter((a) => a.status === 'completed' && isAfter(parseISO(a.date), since)),
    [appointments, since],
  )

  const revenue = completed.reduce((s, a) => s + a.total, 0)

  // Serviços mais realizados
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

  // Clientes mais frequentes
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

  const labels: Record<Period, string> = { day: 'Último dia', week: 'Última semana', month: 'Último mês' }

  function exportPDF() {
    exportToPDF(
      `Relatório ${labels[period]}`,
      `Salão Paula Valle • Gerado em ${formatDateShort(new Date().toISOString())}`,
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
      `Relatorio ${labels[period]}`,
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
      <SectionTitle
        title="Relatórios"
        subtitle="Analise o desempenho do salão e exporte os dados."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportPDF}><FileText size={16} /> PDF</Button>
            <Button variant="secondary" onClick={exportXLS}><FileSpreadsheet size={16} /> Excel</Button>
          </div>
        }
      />

      {/* Período */}
      <div className="flex gap-1 rounded-2xl bg-cream-100 p-1 w-fit">
        {(['day', 'week', 'month'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn('rounded-xl px-5 py-2 text-sm font-medium transition', period === p ? 'bg-white text-gold-700 shadow-sm' : 'text-stone-500')}
          >
            {labels[p]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Atendimentos" value={completed.length} icon={<CheckCircle2 />} accent="emerald" />
        <StatCard label="Faturamento" value={formatCurrency(revenue)} icon={<Wallet />} accent="gold" />
        <StatCard label="Ticket médio" value={formatCurrency(completed.length ? revenue / completed.length : 0)} icon={<Scissors />} accent="blush" />
        <StatCard label="Clientes ativos" value={topClients.length} icon={<Users />} accent="sky" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Serviços mais realizados */}
        <div className="card">
          <h3 className="mb-4 font-semibold">Serviços mais realizados</h3>
          {topServices.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-400">Sem dados no período.</p>
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

        {/* Clientes mais frequentes */}
        <div className="card">
          <h3 className="mb-4 font-semibold">Clientes mais frequentes</h3>
          {topClients.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-400">Sem dados no período.</p>
          ) : (
            <div className="space-y-2">
              {topClients.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 rounded-2xl border border-cream-200 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-300/20 text-sm font-bold text-gold-700">{i + 1}</span>
                  <p className="flex-1 font-medium text-stone-700">{c.name}</p>
                  <span className="text-sm text-stone-400">{c.qtd}x</span>
                  <span className="font-medium text-gold-700">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
