import { useState } from 'react'
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { cn, formatCurrency, uid } from '@/lib/utils'
import type { Service } from '@/types'

export default function Services() {
  const { services, saveService, deleteService } = useStore()
  const [editing, setEditing] = useState<Service | 'new' | null>(null)

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Gestão de serviços"
        subtitle="Configure os serviços oferecidos pelo salão."
        action={<Button onClick={() => setEditing('new')}><Plus size={16} /> Novo serviço</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className={cn('card p-5', !s.active && 'opacity-60')}>
            <div className="flex items-start justify-between">
              <span className="text-4xl">{s.icon}</span>
              <span className={cn('rounded-full px-3 py-1 text-xs font-medium', s.active ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400')}>
                {s.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <p className="mt-3 font-serif text-lg font-semibold text-stone-800">{s.name}</p>
            <p className="text-sm text-stone-400 line-clamp-2">{s.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm text-stone-500"><Clock size={14} /> {s.duration} min</span>
              <span className="font-serif text-lg font-semibold text-gold-700">{formatCurrency(s.price)}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => setEditing(s)}><Pencil size={14} /> Editar</Button>
              <button onClick={() => { if (confirm(`Excluir ${s.name}?`)) deleteService(s.id) }} className="btn-ghost rounded-2xl px-3 text-red-500"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ServiceForm
          service={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(svc) => { saveService(svc); setEditing(null) }}
        />
      )}
    </div>
  )
}

const ICONS = ['✂️', '💈', '💨', '🎨', '✨', '🌿', '💧', '💅', '🦶', '💆', '👑', '🌸']

function ServiceForm({ service, onClose, onSave }: { service: Service | null; onClose: () => void; onSave: (s: Service) => void }) {
  const [form, setForm] = useState<Service>(
    service ?? { id: uid('srv'), name: '', description: '', duration: 30, price: 0, active: true, icon: '✂️' },
  )

  return (
    <Modal open onClose={onClose} title={service ? 'Editar serviço' : 'Novo serviço'}>
      <div className="space-y-4">
        <div>
          <label className="label">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                className={cn('flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition', form.icon === ic ? 'border-gold-400 bg-gold-300/10' : 'border-cream-200')}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
        <Input label="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Textarea label="Descrição" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Duração (min)" type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) }))} />
          <Input label="Preço (R$)" type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
        </div>
        <label className="flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-5 w-5 accent-gold-500" />
          <span className="text-sm font-medium text-stone-600">Serviço ativo (disponível para agendamento)</span>
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name.trim()}>Salvar</Button>
        </div>
      </div>
    </Modal>
  )
}
