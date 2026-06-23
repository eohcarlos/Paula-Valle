import { useState, useRef } from 'react'
import {
  Save, CheckCircle2, Instagram, MessageCircle, MapPin, Mail,
  Camera, RotateCcw, Bell, CalendarRange, Plus, X, Settings as SettingsIcon,
} from 'lucide-react'
import { useStore } from '@/store/store'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn, WEEKDAYS_FULL } from '@/lib/utils'
import type { SalonSettings, DaySchedule } from '@/types'

export default function Settings() {
  const { settings, updateSettings, resetDemo } = useStore()
  const [form, setForm] = useState<SalonSettings>(settings)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const set =
    (k: keyof SalonSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  function updateDay(day: number, patch: Partial<DaySchedule>) {
    setForm((f) => ({
      ...f,
      daySchedule: f.daySchedule.map((d) => (d.day === day ? { ...d, ...patch } : d)),
    }))
  }

  function syncLegacy(ranges: DaySchedule['ranges']): Partial<DaySchedule> {
    return { open: ranges[0]?.open ?? '09:00', close: ranges[ranges.length - 1]?.close ?? '19:00' }
  }

  function updateRange(day: number, idx: number, patch: Partial<DaySchedule['ranges'][number]>) {
    setForm((f) => ({
      ...f,
      daySchedule: f.daySchedule.map((d) => {
        if (d.day !== day) return d
        const ranges = d.ranges.map((r, i) => (i === idx ? { ...r, ...patch } : r))
        return { ...d, ranges, ...syncLegacy(ranges) }
      }),
    }))
  }

  function addRange(day: number) {
    setForm((f) => ({
      ...f,
      daySchedule: f.daySchedule.map((d) => {
        if (d.day !== day) return d
        const last = d.ranges[d.ranges.length - 1]
        const open = last?.close ?? '09:00'
        const [h, m] = open.split(':').map(Number)
        const close = `${String(Math.min(h + 1, 23)).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        const ranges = [...d.ranges, { open, close }]
        return { ...d, ranges, ...syncLegacy(ranges) }
      }),
    }))
  }

  function removeRange(day: number, idx: number) {
    setForm((f) => ({
      ...f,
      daySchedule: f.daySchedule.map((d) => {
        if (d.day !== day || d.ranges.length <= 1) return d
        const ranges = d.ranges.filter((_, i) => i !== idx)
        return { ...d, ranges, ...syncLegacy(ranges) }
      }),
    }))
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, logo: reader.result as string }))
    reader.readAsDataURL(file)
  }

  function save() {
    const enabled = form.daySchedule.filter((d) => d.enabled)
    const synced: SalonSettings = {
      ...form,
      workDays: enabled.map((d) => d.day).sort(),
      openTime: enabled[0]?.open ?? form.openTime,
      closeTime: enabled[0]?.close ?? form.closeTime,
    }
    updateSettings(synced)
    setForm(synced)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
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
              <SettingsIcon size={11} /> Configurações
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
              Configurações do salão
            </h1>
            <p className="mt-1.5 text-stone-400">Personalize as informações e o funcionamento do studio.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={save} className="shadow-gold">
              <Save size={16} /> Salvar
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-emerald-400">
                <CheckCircle2 size={16} /> Salvo!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">

        {/* Identidade */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Camera size={16} className="text-gold-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Identidade</p>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-gold-300 to-gold-600">
                  {form.logo
                    ? <img src={form.logo} alt="logo" className="h-full w-full object-cover" />
                    : <span className="font-serif text-2xl font-bold text-white">PV</span>
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-white shadow-gold"
                >
                  <Camera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleLogo} />
              </div>
              <p className="text-sm text-stone-400">Logo do studio<br />Clique no ícone para alterar.</p>
            </div>
            <Input label="Nome do studio" value={form.name} onChange={set('name')} />
            <Textarea
              label="Descrição / Sobre"
              rows={3}
              placeholder="Conte um pouco sobre o studio..."
              value={form.description ?? ''}
              onChange={set('description')}
            />
          </div>
        </div>

        {/* Contato */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <Mail size={16} className="text-gold-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Contato</p>
          </div>
          <div className="space-y-4 p-5">
            <Input label="Instagram" icon={<Instagram size={18} />} value={form.instagram} onChange={set('instagram')} />
            <Input label="WhatsApp" icon={<MessageCircle size={18} />} value={form.whatsapp} onChange={set('whatsapp')} />
            <Input label="E-mail" type="email" icon={<Mail size={18} />} value={form.email ?? ''} onChange={set('email')} />
            <Input label="Endereço" icon={<MapPin size={18} />} value={form.address} onChange={set('address')} />
          </div>
        </div>

      </div>

      {/* Funcionamento */}
      <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
          <CalendarRange size={16} className="text-gold-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Funcionamento</p>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Tempo entre atendimentos (min)"
              type="number"
              min={5}
              value={form.slotInterval}
              onChange={(e) => setForm((f) => ({ ...f, slotInterval: Number(e.target.value) }))}
            />
            <Input
              label="Janela de agendamento (dias)"
              type="number"
              min={1}
              icon={<CalendarRange size={18} />}
              value={form.bookingWindowDays}
              onChange={(e) => setForm((f) => ({ ...f, bookingWindowDays: Number(e.target.value) }))}
            />
          </div>
          <Input
            label="Política de cancelamento"
            placeholder="Ex.: cancelamentos com 24h de antecedência."
            value={form.cancelPolicy ?? ''}
            onChange={set('cancelPolicy')}
          />

          <div>
            <p className="label">Dias e horários de atendimento</p>
            <p className="mb-3 text-xs text-stone-400">Ative cada dia e defina o horário disponível para agendamento.</p>
            <div className="space-y-2">
              {[...form.daySchedule]
                .sort((a, b) => a.day - b.day)
                .map((d) => (
                  <div
                    key={d.day}
                    className={cn(
                      'flex flex-col gap-3 rounded-2xl border p-3 transition sm:flex-row sm:items-start',
                      d.enabled ? 'border-gold-300/50 bg-gold-300/5' : 'border-cream-200',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => updateDay(d.day, { enabled: !d.enabled })}
                      className="flex items-center gap-3 sm:w-44 sm:shrink-0 sm:pt-2"
                    >
                      <Switch checked={d.enabled} />
                      <span className={cn('text-sm font-medium', d.enabled ? 'text-stone-700' : 'text-stone-400')}>
                        {WEEKDAYS_FULL[d.day]}
                      </span>
                    </button>

                    {d.enabled ? (
                      <div className="flex flex-1 flex-col gap-2">
                        {d.ranges.map((r, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={r.open}
                              onChange={(e) => updateRange(d.day, idx, { open: e.target.value })}
                              className="input-field min-w-0 flex-1 py-2"
                              aria-label={`Abertura ${WEEKDAYS_FULL[d.day]} bloco ${idx + 1}`}
                            />
                            <span className="shrink-0 text-sm text-stone-400">às</span>
                            <input
                              type="time"
                              value={r.close}
                              onChange={(e) => updateRange(d.day, idx, { close: e.target.value })}
                              className="input-field min-w-0 flex-1 py-2"
                              aria-label={`Fechamento ${WEEKDAYS_FULL[d.day]} bloco ${idx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeRange(d.day, idx)}
                              disabled={d.ranges.length <= 1}
                              className="shrink-0 rounded-xl p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addRange(d.day)}
                          className="flex items-center gap-1.5 self-start rounded-xl px-2 py-1 text-xs font-medium text-gold-700 transition hover:bg-gold-300/10"
                        >
                          <Plus size={14} /> Adicionar intervalo
                        </button>
                      </div>
                    ) : (
                      <span className="flex flex-1 items-center text-sm text-stone-400 sm:pl-1">Fechado</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notificações */}
      <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
          <Bell size={16} className="text-gold-600" />
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Notificações</p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <ToggleCard
            label="Novos agendamentos"
            desc="Avisar a administração quando um cliente agendar."
            checked={form.notifyNewBooking}
            onChange={(v) => setForm((f) => ({ ...f, notifyNewBooking: v }))}
          />
          <ToggleCard
            label="Mudanças de status"
            desc="Avisar o cliente ao confirmar, alterar ou cancelar."
            checked={form.notifyStatusChange}
            onChange={(v) => setForm((f) => ({ ...f, notifyStatusChange: v }))}
          />
          <ToggleCard
            label="Lembrete 24h"
            desc="Lembrar o cliente um dia antes do atendimento."
            checked={form.notifyReminder}
            onChange={(v) => setForm((f) => ({ ...f, notifyReminder: v }))}
          />
        </div>
      </div>

      {/* Ações do rodapé */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save}><Save size={16} /> Salvar configurações</Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-fade-in">
            <CheckCircle2 size={16} /> Configurações salvas!
          </span>
        )}
        <button
          onClick={() => {
            if (confirm('Restaurar dados de demonstração? Isso apagará as alterações locais.')) resetDemo()
          }}
          className="btn-ghost ml-auto text-sm text-stone-400"
        >
          <RotateCcw size={15} /> Restaurar demo
        </button>
      </div>

    </div>
  )
}

function Switch({ checked }: { checked: boolean }) {
  return (
    <span className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-gold-500' : 'bg-stone-300')}>
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
    </span>
  )
}

function ToggleCard({ label, desc, checked, onChange }: {
  label: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition',
        checked ? 'border-gold-300/60 bg-gold-300/5' : 'border-cream-200 hover:border-beige-300',
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-stone-700">{label}</span>
        <span className="mt-0.5 block text-xs leading-snug text-stone-400">{desc}</span>
      </span>
      <Switch checked={checked} />
    </button>
  )
}
