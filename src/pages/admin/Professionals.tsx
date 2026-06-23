import { useState } from 'react'
import { Plus, Pencil, Trash2, Phone, Scissors, CalendarCheck } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/Logo'
import { cn, uid } from '@/lib/utils'
import type { Professional } from '@/types'

const COLORS = ['#C9A35E', '#E498A2', '#B79468', '#8F6F35', '#D67A88', '#DEC9AE', '#7AA2C9', '#7AC9A2']

export default function Professionals() {
  const { professionals, appointments, saveProfessional, deleteProfessional } = useStore()
  const [editing, setEditing] = useState<Professional | 'new' | null>(null)

  const countFor = (name: string) =>
    appointments.filter((a) => a.professional === name && a.status !== 'canceled').length

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Profissionais"
        subtitle="Cadastre e gerencie a equipe do salão."
        action={<Button onClick={() => setEditing('new')}><Plus size={16} /> Novo profissional</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {professionals.map((p) => (
          <div key={p.id} className={cn('card p-5', !p.active && 'opacity-60')}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="relative">
                  <Avatar name={p.name} size={52} />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white"
                    style={{ background: p.color ?? '#C9A35E' }}
                  />
                </span>
                <div>
                  <p className="font-semibold text-stone-800">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.role}</p>
                </div>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-medium', p.active ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400')}>
                {p.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-stone-500">
              {p.phone && <p className="flex items-center gap-2"><Phone size={14} /> {p.phone}</p>}
              <p className="flex items-center gap-2"><CalendarCheck size={14} /> {countFor(p.name)} atendimentos</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => setEditing(p)}><Pencil size={14} /> Editar</Button>
              <button onClick={() => { if (confirm(`Excluir ${p.name}?`)) deleteProfessional(p.id) }} className="btn-ghost rounded-2xl px-3 text-red-500"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {professionals.length === 0 && (
          <div className="col-span-full card py-16 text-center text-stone-400">
            <Scissors className="mx-auto mb-2 text-stone-300" size={32} />
            Nenhum profissional cadastrado.
          </div>
        )}
      </div>

      {editing && (
        <ProfessionalForm
          professional={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(pro) => { saveProfessional(pro); setEditing(null) }}
        />
      )}
    </div>
  )
}

function ProfessionalForm({
  professional,
  onClose,
  onSave,
}: {
  professional: Professional | null
  onClose: () => void
  onSave: (p: Professional) => void
}) {
  const [form, setForm] = useState<Professional>(
    professional ?? { id: uid('pro'), name: '', role: '', phone: '', active: true, color: COLORS[0] },
  )

  return (
    <Modal open onClose={onClose} title={professional ? 'Editar profissional' : 'Novo profissional'}>
      <div className="space-y-4">
        <Input label="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Input label="Especialidade / Função" placeholder="Ex.: Cabeleireira, Manicure..." value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
        <Input label="Telefone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <div>
          <label className="label">Cor de identificação</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                style={{ background: c }}
                className={cn('h-9 w-9 rounded-full transition', form.color === c ? 'ring-2 ring-stone-700 ring-offset-2' : 'hover:scale-110')}
              />
            ))}
          </div>
        </div>
        <label className="flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-5 w-5 accent-gold-500" />
          <span className="text-sm font-medium text-stone-600">Profissional ativo (disponível para agendamentos)</span>
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name.trim()}>Salvar</Button>
        </div>
      </div>
    </Modal>
  )
}
