import { useMemo, useState } from 'react'
import { Plus, Search, Phone, Mail, Eye, Pencil, Trash2, MessageCircle, Cake, Users } from 'lucide-react'
import { useStore } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Avatar } from '@/components/Logo'
import { StatusBadge } from '@/components/ui/Badge'
import { whatsappLink, DEFAULT_WHATS_MESSAGE } from '@/lib/whatsapp'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { User } from '@/types'

export default function Clients() {
  const { users, appointments, services, addClient, updateUser, deleteUser } = useStore()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<User | 'new' | null>(null)
  const [viewing, setViewing] = useState<User | null>(null)

  const clients = useMemo(() => {
    const list = users.filter((u) => u.role === 'client')
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter((c) => {
      const matchesService = appointments.some(
        (a) => a.clientId === c.id && a.serviceIds.some((id) => services.find((s) => s.id === id)?.name.toLowerCase().includes(q)),
      )
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || matchesService
    })
  }, [users, search, appointments, services])

  const clientStats = (id: string) => {
    const apts = appointments.filter((a) => a.clientId === id && a.status === 'completed')
    return { visits: apts.length, spent: apts.reduce((s, a) => s + a.total, 0) }
  }

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-9 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(201,163,94,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(228,152,162,0.18),transparent_50%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
              <Users size={12} /> CLIENTES
            </span>
            <h1 className="font-serif text-3xl font-semibold text-white">Gestão de clientes</h1>
            <p className="text-sm text-stone-300">Cadastre, edite e acompanhe o histórico completo de cada cliente.</p>
          </div>
          <Button onClick={() => setEditing('new')} className="shrink-0">
            <Plus size={16} /> Novo cliente
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input placeholder="Buscar por nome, telefone ou serviço" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((c) => {
          const st = clientStats(c.id)
          return (
            <div key={c.id} className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card transition hover:shadow-soft">
              <div className="h-1 w-full bg-gold-400" />
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} src={c.photo} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-800">{c.name}</p>
                    <p className="truncate text-xs text-stone-400">{c.email}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm text-stone-500">
                  <p className="flex items-center gap-2"><Phone size={14} /> {c.phone}</p>
                  {c.birthDate && <p className="flex items-center gap-2"><Cake size={14} /> {formatDateShort(c.birthDate)}</p>}
                </div>
                <div className="mt-3 flex justify-between rounded-2xl bg-cream-50 px-4 py-2.5 text-sm">
                  <span className="text-stone-400">{st.visits} visitas</span>
                  <span className="font-semibold text-gold-700">{formatCurrency(st.spent)}</span>
                </div>
                <div className="mt-3 flex gap-1 border-t border-cream-100 pt-3">
                  <Button size="sm" variant="ghost" className="flex-1" onClick={() => setViewing(c)}><Eye size={15} /> Histórico</Button>
                  <a href={whatsappLink(c.phone, DEFAULT_WHATS_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn-ghost rounded-2xl px-3 text-[#25D366]"><MessageCircle size={15} /></a>
                  <button onClick={() => setEditing(c)} className="btn-ghost rounded-2xl px-3"><Pencil size={15} /></button>
                  <button onClick={() => { if (confirm(`Excluir ${c.name}?`)) deleteUser(c.id) }} className="btn-ghost rounded-2xl px-3 text-red-500"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          )
        })}
        {clients.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cream-100">
              <Users size={28} className="text-stone-400" />
            </div>
            <p className="mt-4 font-serif text-lg font-semibold text-stone-700">Nenhum cliente encontrado</p>
            <p className="mt-1 text-sm text-stone-400">Tente ajustar a busca ou adicione um novo cliente.</p>
            <Button className="mt-4" onClick={() => setEditing('new')}><Plus size={16} /> Novo cliente</Button>
          </div>
        )}
      </div>

      {editing && (
        <ClientForm
          client={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === 'new') addClient(data)
            else updateUser(editing.id, data)
            setEditing(null)
          }}
        />
      )}

      {viewing && <ClientHistory client={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

function ClientForm({ client, onClose, onSave }: { client: User | null; onClose: () => void; onSave: (d: Partial<User>) => void }) {
  const [form, setForm] = useState({
    name: client?.name ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    birthDate: client?.birthDate ?? '',
    notes: client?.notes ?? '',
  })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <Modal open onClose={onClose} title={client ? 'Editar cliente' : 'Novo cliente'}>
      <div className="space-y-4">
        <Input label="Nome completo" value={form.name} onChange={set('name')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Telefone / WhatsApp" value={form.phone} onChange={set('phone')} />
          <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={set('birthDate')} />
        </div>
        <Input label="E-mail" type="email" value={form.email} onChange={set('email')} />
        <Textarea label="Observações" rows={3} value={form.notes} onChange={set('notes')} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name.trim()}>Salvar</Button>
        </div>
      </div>
    </Modal>
  )
}

function ClientHistory({ client, onClose }: { client: User; onClose: () => void }) {
  const { appointments, services } = useStore()
  const apts = appointments.filter((a) => a.clientId === client.id).sort((a, b) => b.date.localeCompare(a.date))
  const svcNames = (ids: string[]) => ids.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(', ')

  return (
    <Modal open onClose={onClose} title={`Histórico — ${client.name}`} size="lg">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-2 rounded-full bg-cream-50 px-3 py-1.5"><Mail size={14} /> {client.email}</span>
          <span className="flex items-center gap-2 rounded-full bg-cream-50 px-3 py-1.5"><Phone size={14} /> {client.phone}</span>
          <span className="rounded-full bg-gold-300/20 px-3 py-1.5 font-medium text-gold-700">{client.points} pontos</span>
        </div>
        {client.notes && <p className="rounded-2xl bg-blush-50 p-3 text-sm text-stone-600">📝 {client.notes}</p>}

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {apts.length === 0 && <p className="py-8 text-center text-stone-400">Sem agendamentos.</p>}
          {apts.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-2xl border border-cream-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-stone-700">{svcNames(a.serviceIds)}</p>
                <p className="text-xs text-stone-400">{formatDateShort(a.date)} • {a.time} • {a.professional}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gold-700">{formatCurrency(a.total)}</span>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
