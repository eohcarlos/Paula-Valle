import { Link } from 'react-router-dom'
import { Heart, CalendarPlus, Sparkles, Clock } from 'lucide-react'
import { useStore } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { cn, formatCurrency } from '@/lib/utils'

export default function Favorites() {
  const { currentUser, services, toggleFavorite } = useStore()
  if (!currentUser) return null

  const activeServices = services.filter((s) => s.active)
  const favorites = activeServices.filter((s) => currentUser.favorites.includes(s.id))

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-9 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(228,152,162,0.30),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(201,163,94,0.18),transparent_50%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blush-400/30 bg-blush-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blush-300">
            <Heart size={11} /> Favoritos
          </span>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            Serviços favoritos
          </h1>
          <p className="mt-1.5 text-stone-400">
            {favorites.length > 0
              ? `${favorites.length} serviço${favorites.length !== 1 ? 's' : ''} salvo${favorites.length !== 1 ? 's' : ''}. Agende com um toque.`
              : 'Salve seus serviços preferidos para agendar rapidinho.'}
          </p>
        </div>
      </div>

      {/* Favoritos em destaque */}
      {favorites.length > 0 && (
        <div>
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-stone-400">
            ❤️ Seus favoritos
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-3xl border border-blush-200/60 bg-white shadow-card transition hover:shadow-soft">
                <div className="h-1 w-full bg-blush-300" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blush-50 text-3xl">
                      {s.icon}
                    </div>
                    <button
                      onClick={() => toggleFavorite(currentUser.id, s.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-blush-200 bg-blush-50 text-blush-500 transition hover:bg-blush-100"
                      title="Remover dos favoritos"
                    >
                      <Heart size={16} className="fill-blush-500" />
                    </button>
                  </div>
                  <p className="mt-3 font-serif text-lg font-semibold text-stone-800">{s.name}</p>
                  {s.description && <p className="mt-0.5 text-sm text-stone-400">{s.description}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-stone-400">
                      <Clock size={11} /> {s.duration} min
                    </span>
                    <span className="font-serif text-lg font-semibold text-gold-600">{formatCurrency(s.price)}</span>
                  </div>
                  <Link to="/app/agendar" className="mt-4 block">
                    <Button variant="secondary" className="w-full">
                      <CalendarPlus size={15} /> Agendar
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todos os serviços */}
      <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
          <Sparkles size={16} className="text-gold-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Todos os serviços
          </p>
          <span className="ml-auto rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-stone-400">
            {activeServices.length}
          </span>
        </div>
        <div className="grid gap-2 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((s) => {
            const fav = currentUser.favorites.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggleFavorite(currentUser.id, s.id)}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200',
                  fav
                    ? 'border-blush-200 bg-blush-50/60 shadow-sm'
                    : 'border-cream-200 bg-white hover:border-blush-200 hover:shadow-sm',
                )}
              >
                <div className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl transition',
                  fav ? 'bg-blush-100' : 'bg-cream-100 group-hover:bg-blush-50',
                )}>
                  {s.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-700">{s.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Clock size={10} /> {s.duration} min
                    <span className="text-stone-300">·</span>
                    <span className="font-semibold text-stone-500">{formatCurrency(s.price)}</span>
                  </div>
                </div>
                <Heart size={18} className={cn(
                  'shrink-0 transition-all',
                  fav ? 'fill-blush-500 text-blush-500 scale-110' : 'text-stone-300 group-hover:text-blush-300',
                )} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
