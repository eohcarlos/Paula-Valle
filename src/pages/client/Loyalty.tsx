import { Gift, Star, Crown, Sparkles, Check, Lock } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { cn, formatDateShort } from '@/lib/utils'

const REWARDS = [
  { points: 50, title: 'Hidratação grátis', icon: '💧' },
  { points: 100, title: '20% off em qualquer serviço', icon: '🎁' },
  { points: 200, title: 'Escova cortesia', icon: '💨' },
  { points: 300, title: 'Dia VIP completo', icon: '👑' },
]

const TIERS = [
  { name: 'Bronze', min: 0, icon: <Star className="text-amber-700" /> },
  { name: 'Prata', min: 100, icon: <Star className="text-stone-400" /> },
  { name: 'Ouro', min: 200, icon: <Crown className="text-gold-500" /> },
  { name: 'Diamante', min: 400, icon: <Sparkles className="text-sky-400" /> },
]

export default function Loyalty() {
  const { currentUser, appointments } = useStore()
  if (!currentUser) return null

  const points = currentUser.points
  const visits = appointments.filter((a) => a.clientId === currentUser.id && a.status === 'completed')
  const tier = [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0]
  const nextTier = TIERS.find((t) => t.min > points)
  const progress = nextTier ? Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100) : 100

  return (
    <div className="space-y-6">
      <SectionTitle title="Programa de fidelidade" subtitle="Ganhe pontos a cada atendimento e troque por recompensas." />

      {/* Card de pontos */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-beige-500 p-7 text-white shadow-gold">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-white/80"><Gift size={18} /> Seus pontos</p>
            <p className="mt-1 font-serif text-5xl font-bold text-white">{points}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/20 px-5 py-3 backdrop-blur">
            <span className="text-2xl">{tier.icon}</span>
            <div>
              <p className="text-xs text-white/80">Nível atual</p>
              <p className="text-xl font-semibold text-white">{tier.name}</p>
            </div>
          </div>
        </div>
        {nextTier && (
          <div className="mt-6">
            <div className="mb-1.5 flex justify-between text-xs text-white/80">
              <span>Faltam {nextTier.min - points} pts para {nextTier.name}</span>
              <span>{nextTier.min} pts</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recompensas */}
        <div className="card lg:col-span-2">
          <h3 className="mb-4 font-semibold">Recompensas disponíveis</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {REWARDS.map((r) => {
              const unlocked = points >= r.points
              return (
                <div
                  key={r.title}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-4 transition',
                    unlocked ? 'border-gold-300 bg-gold-300/10' : 'border-cream-200 opacity-70',
                  )}
                >
                  <span className="text-3xl">{r.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-stone-800">{r.title}</p>
                    <p className="text-xs text-stone-400">{r.points} pontos</p>
                  </div>
                  {unlocked ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600">
                      <Check size={13} /> Liberada
                    </span>
                  ) : (
                    <Lock size={18} className="text-stone-300" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Histórico de visitas */}
        <div className="card">
          <h3 className="mb-4 font-semibold">Histórico de visitas ({visits.length})</h3>
          <div className="space-y-2">
            {visits.length === 0 && <p className="text-sm text-stone-400">Nenhuma visita ainda.</p>}
            {visits.slice(0, 8).map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl bg-cream-50 px-3 py-2 text-sm">
                <span className="text-stone-600">{formatDateShort(v.date)}</span>
                <span className="font-medium text-emerald-600">+10 pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
