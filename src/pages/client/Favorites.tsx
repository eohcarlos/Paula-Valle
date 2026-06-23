import { Link } from 'react-router-dom'
import { Heart, CalendarPlus } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn, formatCurrency } from '@/lib/utils'

export default function Favorites() {
  const { currentUser, services, toggleFavorite } = useStore()
  if (!currentUser) return null

  const activeServices = services.filter((s) => s.active)
  const favorites = activeServices.filter((s) => currentUser.favorites.includes(s.id))

  return (
    <div className="space-y-6">
      <SectionTitle title="Serviços favoritos" subtitle="Salve os serviços que você mais ama para agendar rapidinho." />

      {favorites.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((s) => (
            <div key={s.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{s.icon}</span>
                <button onClick={() => toggleFavorite(currentUser.id, s.id)} className="text-blush-500">
                  <Heart size={22} className="fill-blush-500" />
                </button>
              </div>
              <p className="mt-3 font-serif text-lg font-semibold text-stone-800">{s.name}</p>
              <p className="text-sm text-stone-400">{s.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-stone-400">{s.duration} min</span>
                <span className="font-semibold text-gold-700">{formatCurrency(s.price)}</span>
              </div>
              <Link to="/app/agendar" className="mt-4">
                <Button variant="secondary" className="w-full"><CalendarPlus size={15} /> Agendar</Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3 className="mb-4 font-semibold">Todos os serviços</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((s) => {
            const fav = currentUser.favorites.includes(s.id)
            return (
              <button
                key={s.id}
                onClick={() => toggleFavorite(currentUser.id, s.id)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-4 text-left transition',
                  fav ? 'border-blush-300 bg-blush-50' : 'border-cream-200 hover:border-beige-300',
                )}
              >
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-700">{s.name}</p>
                  <p className="text-xs text-stone-400">{formatCurrency(s.price)}</p>
                </div>
                <Heart size={20} className={cn(fav ? 'fill-blush-500 text-blush-500' : 'text-stone-300')} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
