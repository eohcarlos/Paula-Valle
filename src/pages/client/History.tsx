import { useMemo, useState } from 'react'
import { Star, MessageSquare, CalendarDays, User, Clock, CheckCircle2, Sparkles } from 'lucide-react'
import { useStore } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Input'
import { StarRating } from '@/components/ui/StarRating'
import { formatCurrency, formatDate, formatDateShort } from '@/lib/utils'
import type { Appointment } from '@/types'

export default function History() {
  const { currentUser, appointments, services, rateAppointment } = useStore()
  const [rating, setRating] = useState<Appointment | null>(null)
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')

  const history = useMemo(
    () =>
      appointments
        .filter((a) => a.clientId === currentUser?.id && a.status === 'completed')
        .sort((a, b) => b.date.localeCompare(a.date)),
    [appointments, currentUser],
  )

  const svcNames = (ids: string[]) =>
    ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  const totalSpent = history.reduce((s, a) => s + a.total, 0)

  function openRating(a: Appointment) {
    setRating(a)
    setStars(a.rating ?? 5)
    setComment(a.reviewComment ?? '')
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
              <CheckCircle2 size={11} /> Histórico
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Seus atendimentos
            </h1>
            <p className="mt-1.5 text-stone-400">Reveja, avalie e acompanhe toda sua jornada no salão.</p>
          </div>
          {history.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-right backdrop-blur-sm">
              <p className="text-xs text-stone-400">Total investido</p>
              <p className="font-serif text-2xl font-semibold text-gold-400">{formatCurrency(totalSpent)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-cream-200 bg-white py-20 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cream-100">
            <CheckCircle2 size={28} className="text-stone-300" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-stone-500">Nenhum atendimento ainda</p>
            <p className="mt-1 text-sm text-stone-400">Seus atendimentos finalizados aparecerão aqui.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {history.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card transition-all hover:shadow-soft">
              <div className="h-1 w-full bg-emerald-400" />
              <div className="p-5">
                {/* Nome serviço + avaliação */}
                <div className="flex items-start justify-between gap-3">
                  <p className="font-serif text-xl font-semibold leading-snug text-stone-800">
                    {svcNames(a.serviceIds)}
                  </p>
                  {a.rating ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-xl border border-gold-200 bg-gold-300/15 px-2.5 py-1 text-sm font-bold text-gold-600">
                      <Star size={13} className="fill-gold-400 text-gold-400" /> {a.rating}.0
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-xl border border-cream-200 bg-cream-50 px-2.5 py-1 text-xs font-semibold text-stone-400">
                      Sem nota
                    </span>
                  )}
                </div>

                {/* Info chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-600">
                    <CalendarDays size={11} /> {formatDateShort(a.date)}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                    <User size={11} /> {a.professional}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-xl bg-cream-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
                    <Clock size={11} /> {a.duration} min
                  </span>
                </div>

                {/* Comentário */}
                {a.reviewComment && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-cream-50 px-3 py-2 text-xs text-stone-500">
                    <MessageSquare size={12} className="mt-0.5 shrink-0 text-stone-400" />
                    <span className="italic">"{a.reviewComment}"</span>
                  </div>
                )}

                {/* Rodapé */}
                <div className="mt-4 flex items-center justify-between border-t border-cream-100 pt-3">
                  <span className="gold-text font-serif text-2xl font-semibold leading-none">
                    {formatCurrency(a.total)}
                  </span>
                  <button
                    onClick={() => openRating(a)}
                    className="flex items-center gap-1.5 rounded-xl border border-cream-200 px-3 py-2 text-xs font-semibold text-stone-500 transition hover:border-gold-300 hover:text-gold-700"
                  >
                    <Star size={13} /> {a.rating ? 'Editar avaliação' : 'Avaliar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de avaliação */}
      <Modal open={!!rating} onClose={() => setRating(null)} title="Avaliar atendimento">
        {rating && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3">
              <p className="font-serif text-lg font-semibold text-stone-800">{svcNames(rating.serviceIds)}</p>
              <p className="mt-0.5 text-xs text-stone-400">{formatDate(rating.date)} · {rating.professional}</p>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">
                <Star size={10} className="mr-1 inline" /> Sua nota
              </p>
              <StarRating value={stars} onChange={setStars} size={36} />
            </div>

            <Textarea
              label="Comentário (opcional)"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
            />

            <div className="flex justify-end gap-2 border-t border-cream-100 pt-4">
              <Button variant="ghost" onClick={() => setRating(null)}>Cancelar</Button>
              <Button onClick={() => { rateAppointment(rating.id, stars, comment); setRating(null) }}>
                <Sparkles size={15} /> Salvar avaliação
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
