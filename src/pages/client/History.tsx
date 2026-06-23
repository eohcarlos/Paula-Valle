import { useMemo, useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Input'
import { StarRating } from '@/components/ui/StarRating'
import { formatCurrency, formatDate } from '@/lib/utils'
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

  const svcNames = (ids: string[]) => ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  function openRating(a: Appointment) {
    setRating(a)
    setStars(a.rating ?? 5)
    setComment(a.reviewComment ?? '')
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Histórico de atendimentos" subtitle="Reveja seus atendimentos e avalie os serviços." />

      {history.length === 0 ? (
        <div className="card py-16 text-center text-stone-400">Nenhum atendimento finalizado ainda.</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="hidden grid-cols-12 gap-4 border-b border-cream-200 bg-cream-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-stone-400 md:grid">
            <span className="col-span-2">Data</span>
            <span className="col-span-4">Serviço</span>
            <span className="col-span-2">Profissional</span>
            <span className="col-span-2">Valor</span>
            <span className="col-span-2 text-right">Avaliação</span>
          </div>
          {history.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-1 gap-2 border-b border-cream-100 px-6 py-4 transition hover:bg-cream-50 md:grid-cols-12 md:items-center md:gap-4"
            >
              <span className="col-span-2 text-sm text-stone-600">{formatDate(a.date)}</span>
              <div className="col-span-4">
                <p className="text-sm font-medium text-stone-700">{svcNames(a.serviceIds)}</p>
                {a.notes && <p className="text-xs text-stone-400">{a.notes}</p>}
                {a.reviewComment && (
                  <p className="mt-1 flex items-center gap-1 text-xs italic text-stone-400">
                    <MessageSquare size={12} /> "{a.reviewComment}"
                  </p>
                )}
              </div>
              <span className="col-span-2 text-sm text-stone-500">{a.professional}</span>
              <span className="col-span-2 font-medium text-gold-700">{formatCurrency(a.total)}</span>
              <div className="col-span-2 flex items-center justify-start gap-2 md:justify-end">
                {a.rating ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-gold-600">
                    <Star size={15} className="fill-gold-400 text-gold-400" /> {a.rating}.0
                  </span>
                ) : null}
                <Button size="sm" variant="ghost" onClick={() => openRating(a)}>
                  {a.rating ? 'Editar' : 'Avaliar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!rating} onClose={() => setRating(null)} title="Avaliar atendimento">
        {rating && (
          <div className="space-y-5">
            <p className="text-sm text-stone-500">{svcNames(rating.serviceIds)} • {formatDate(rating.date)}</p>
            <div>
              <label className="label">Sua nota</label>
              <StarRating value={stars} onChange={setStars} size={32} />
            </div>
            <Textarea label="Comentário (opcional)" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Conte como foi sua experiência..." />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRating(null)}>Cancelar</Button>
              <Button
                onClick={() => {
                  rateAppointment(rating.id, stars, comment)
                  setRating(null)
                }}
              >
                Salvar avaliação
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
