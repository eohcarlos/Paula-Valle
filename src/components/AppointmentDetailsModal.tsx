import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Scissors,
  User as UserIcon,
  Cake,
  CalendarDays,
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/Logo'
import { StatusBadge } from '@/components/ui/Badge'
import { useStore } from '@/store/store'
import { whatsappLink, DEFAULT_WHATS_MESSAGE } from '@/lib/whatsapp'
import { formatCurrency, formatDate, formatDateShort } from '@/lib/utils'
import type { Appointment } from '@/types'

/** Popup com todas as informações de um agendamento + dados do cliente. */
export function AppointmentDetailsModal({
  appointment,
  onClose,
}: {
  appointment: Appointment | null
  onClose: () => void
}) {
  const { users, services } = useStore()
  if (!appointment) return null

  const client = users.find((u) => u.id === appointment.clientId) ?? null
  const svcList = appointment.serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as { id: string; name: string; price: number; duration: number; icon?: string }[]

  return (
    <Modal open onClose={onClose} title="Detalhes do agendamento">
      <div className="space-y-5">
        {/* Cabeçalho cliente */}
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-cream-50 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={appointment.clientName} src={client?.photo} size={52} />
            <div>
              <p className="font-serif text-lg font-semibold text-stone-800">{appointment.clientName}</p>
              {client && <p className="text-xs text-stone-400">{client.points} pontos de fidelidade</p>}
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        {/* Contato do cliente */}
        {client && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Contato</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <a
                href={whatsappLink(client.phone, DEFAULT_WHATS_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm text-stone-600 transition hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle size={15} /> {client.phone}
              </a>
              <span className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm text-stone-600">
                <Phone size={15} /> {client.phone}
              </span>
              <span className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm text-stone-600">
                <Mail size={15} /> {client.email || '—'}
              </span>
              {client.birthDate && (
                <span className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm text-stone-600">
                  <Cake size={15} /> {formatDateShort(client.birthDate)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dados do atendimento */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Atendimento</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Row icon={<CalendarDays size={15} />} label="Data">{formatDate(appointment.date)}</Row>
            <Row icon={<Clock size={15} />} label="Horário">{appointment.time} • {appointment.duration} min</Row>
            <Row icon={<UserIcon size={15} />} label="Profissional">{appointment.professional}</Row>
            <Row icon={<Scissors size={15} />} label="Serviços">{svcList.map((s) => s.name).join(', ')}</Row>
          </div>
        </div>

        {/* Lista de serviços com valores */}
        <div className="rounded-2xl border border-cream-200 p-4">
          {svcList.map((s) => (
            <div key={s.id} className="flex justify-between py-1 text-sm">
              <span className="text-stone-600">{s.icon} {s.name}</span>
              <span className="font-medium text-stone-700">{formatCurrency(s.price)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-cream-200 pt-2">
            <span className="font-medium text-stone-700">Total</span>
            <span className="font-serif text-lg font-semibold text-gold-700">{formatCurrency(appointment.total)}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="rounded-2xl bg-blush-50 p-3 text-sm text-stone-600">📝 {appointment.notes}</div>
        )}

        {appointment.status === 'canceled' && (
          <div className="rounded-2xl bg-stone-100 p-3 text-center text-sm font-medium text-stone-500">
            Este agendamento foi cancelado.
          </div>
        )}
      </div>
    </Modal>
  )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm">
      <span className="mt-0.5 text-gold-600">{icon}</span>
      <span>
        <span className="block text-xs text-stone-400">{label}</span>
        <span className="font-medium text-stone-700">{children}</span>
      </span>
    </div>
  )
}
