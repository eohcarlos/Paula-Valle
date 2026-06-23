import { Gift, Star, Crown, Sparkles, Check, Lock, TrendingUp, CalendarDays } from 'lucide-react'
import { useStore } from '@/store/store'
import { cn, formatDateShort } from '@/lib/utils'

const REWARDS = [
  { points: 50,  title: 'Hidratação grátis',           icon: '💧', desc: 'Uma sessão de hidratação por nossa conta' },
  { points: 100, title: '20% off em qualquer serviço',  icon: '🎁', desc: 'Desconto aplicado no próximo agendamento' },
  { points: 200, title: 'Escova cortesia',              icon: '💨', desc: 'Escova completa sem custo adicional' },
  { points: 300, title: 'Dia VIP completo',             icon: '👑', desc: 'Experiência exclusiva com múltiplos serviços' },
]

const TIERS = [
  { name: 'Bronze',   min: 0,   color: 'from-amber-700 to-amber-600',    ring: 'ring-amber-300',  text: 'text-amber-700',  bg: 'bg-amber-50' },
  { name: 'Prata',    min: 100, color: 'from-stone-400 to-stone-500',     ring: 'ring-stone-300',  text: 'text-stone-600',  bg: 'bg-stone-50' },
  { name: 'Ouro',     min: 200, color: 'from-gold-500 to-gold-600',       ring: 'ring-gold-300',   text: 'text-gold-700',   bg: 'bg-gold-300/10' },
  { name: 'Diamante', min: 400, color: 'from-sky-400 to-sky-600',         ring: 'ring-sky-200',    text: 'text-sky-600',    bg: 'bg-sky-50' },
]

const TIER_ICONS: Record<string, React.ReactNode> = {
  Bronze:   <Star size={18} />,
  Prata:    <Star size={18} />,
  Ouro:     <Crown size={18} />,
  Diamante: <Sparkles size={18} />,
}

export default function Loyalty() {
  const { currentUser, appointments } = useStore()
  if (!currentUser) return null

  const points = currentUser.points
  const visits = appointments
    .filter((a) => a.clientId === currentUser.id && a.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date))

  const tier = [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0]
  const nextTier = TIERS.find((t) => t.min > points)
  const progress = nextTier
    ? Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100

  return (
    <div className="space-y-6">

      {/* Hero — pontos + nível */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(201,163,94,0.32),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_90%,rgba(228,152,162,0.18),transparent_50%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <Gift size={11} /> Programa de fidelidade
          </span>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-stone-400">Seus pontos acumulados</p>
              <p className="font-serif text-6xl font-bold text-white">{points}</p>
              <p className="mt-1 text-stone-400">pontos de fidelidade</p>
            </div>
            {/* Tier badge */}
            <div className={cn(
              'flex items-center gap-3 rounded-2xl bg-gradient-to-br px-5 py-4',
              `bg-gradient-to-br ${tier.color}`,
            )}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                {TIER_ICONS[tier.name]}
              </div>
              <div>
                <p className="text-xs text-white/70">Nível atual</p>
                <p className="text-xl font-bold text-white">{tier.name}</p>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          {nextTier && (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-stone-400">
                <span>Faltam <span className="font-semibold text-gold-400">{nextTier.min - points} pts</span> para {nextTier.name}</span>
                <span>{points} / {nextTier.min}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-300 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {!nextTier && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm text-gold-300">
              <Sparkles size={15} /> Você atingiu o nível máximo — Diamante!
            </div>
          )}
        </div>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIERS.map((t) => {
          const active = t.name === tier.name
          const reached = points >= t.min
          return (
            <div key={t.name} className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition',
              active ? `${t.bg} border-opacity-50 ring-2 ${t.ring}` : reached ? 'border-cream-200 bg-white' : 'border-cream-100 bg-cream-50 opacity-50',
            )}>
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white',
                reached ? t.color : 'from-stone-200 to-stone-300',
              )}>
                {TIER_ICONS[t.name]}
              </div>
              <div>
                <p className={cn('text-sm font-bold', active ? t.text : reached ? 'text-stone-600' : 'text-stone-400')}>{t.name}</p>
                <p className="text-[10px] text-stone-400">{t.min} pts</p>
              </div>
              {active && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-gold-600 shadow-sm">Atual</span>}
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Recompensas */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Gift size={16} className="text-gold-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Recompensas disponíveis</p>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {REWARDS.map((r) => {
              const unlocked = points >= r.points
              return (
                <div key={r.title} className={cn(
                  'relative overflow-hidden rounded-2xl border p-4 transition',
                  unlocked
                    ? 'border-gold-300/60 bg-gradient-to-br from-gold-300/10 to-cream-50'
                    : 'border-cream-200 bg-cream-50 opacity-60',
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl leading-none">{r.icon}</span>
                    {unlocked ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                        <Check size={10} /> Liberada
                      </span>
                    ) : (
                      <Lock size={14} className="mt-0.5 shrink-0 text-stone-300" />
                    )}
                  </div>
                  <p className={cn('mt-2.5 font-semibold', unlocked ? 'text-stone-800' : 'text-stone-500')}>{r.title}</p>
                  <p className="mt-0.5 text-xs text-stone-400">{r.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={cn(
                      'rounded-xl px-2.5 py-1 text-xs font-bold',
                      unlocked ? 'bg-gold-400/20 text-gold-700' : 'bg-cream-200 text-stone-400',
                    )}>
                      {r.points} pontos
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Histórico de visitas */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <TrendingUp size={16} className="text-gold-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Visitas ({visits.length})</p>
          </div>
          <div className="p-5">
            {visits.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400">Nenhuma visita ainda.</p>
            ) : (
              <div className="space-y-2">
                {visits.slice(0, 8).map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded-xl bg-cream-50 px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                        <CalendarDays size={12} className="text-emerald-600" />
                      </div>
                      <span className="text-sm text-stone-600">{formatDateShort(v.date)}</span>
                    </div>
                    <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-600">+10 pts</span>
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
