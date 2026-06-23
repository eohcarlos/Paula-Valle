import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Save, CheckCircle2, User, Star, Shield, KeyRound, LogOut } from 'lucide-react'
import { useStore } from '@/store/store'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/Logo'

export default function Profile() {
  const { currentUser, updateUser, verifyPassword, logout } = useStore()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name:      currentUser?.name      ?? '',
    email:     currentUser?.email     ?? '',
    phone:     currentUser?.phone     ?? '',
    birthDate: currentUser?.birthDate ?? '',
    photo:     currentUser?.photo     ?? '',
  })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')

  if (!currentUser) return null

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result as string }))
    reader.readAsDataURL(file)
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    updateUser(currentUser!.id, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMsg('')
    if (pw.next.length < 6) return setPwMsg('A nova senha deve ter ao menos 6 caracteres.')
    if (pw.next !== pw.confirm) return setPwMsg('As senhas não coincidem.')
    const valid = await verifyPassword(currentUser!.id, pw.current)
    if (!valid) return setPwMsg('Senha atual incorreta.')
    updateUser(currentUser!.id, { password: pw.next })
    setPw({ current: '', next: '', confirm: '' })
    setPwMsg('ok')
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6">

      {/* Hero com avatar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-700 to-stone-900 px-7 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(201,163,94,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(228,152,162,0.18),transparent_50%)]" />
        <div className="relative flex flex-wrap items-center gap-6">
          {/* Avatar com botão de câmera */}
          <div className="relative shrink-0">
            <div className="ring-4 ring-white/20 ring-offset-2 ring-offset-stone-800 rounded-full">
              <Avatar name={form.name} src={form.photo} size={88} />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-white shadow-gold transition hover:scale-110 hover:bg-gold-400"
              title="Alterar foto"
            >
              <Camera size={15} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          </div>
          {/* Info */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Perfil</p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-white">{form.name || 'Meu perfil'}</h1>
            <p className="mt-1 text-stone-400">{form.email}</p>
          </div>
          {/* Resumo stats */}
          <div className="ml-auto flex gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-sm">
              <p className="font-serif text-2xl font-bold text-gold-400">{currentUser.points}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Pontos</p>
            </div>
            <div className="hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center backdrop-blur-sm sm:block">
              <p className="font-serif text-2xl font-bold text-white">{new Date(currentUser.createdAt).getFullYear()}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-400">Cliente desde</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Card de resumo lateral */}
        <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card lg:order-last">
          <div className="border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Resumo da conta</p>
          </div>
          <div className="p-5">
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="ring-4 ring-cream-200 rounded-full">
                <Avatar name={form.name} src={form.photo} size={72} />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-stone-800">{form.name}</p>
                <p className="text-xs text-stone-400">{form.email}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-cream-100 pt-4">
              {[
                { icon: <Star size={14} className="text-gold-500" />, label: 'Pontos fidelidade', value: `${currentUser.points} pts` },
                { icon: <CheckCircle2 size={14} className="text-emerald-500" />, label: 'Cliente desde', value: new Date(currentUser.createdAt).getFullYear().toString() },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-xl bg-cream-50 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    {row.icon} {row.label}
                  </div>
                  <span className="text-sm font-semibold text-stone-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulários */}
        <div className="space-y-5 lg:col-span-2">

          {/* Dados pessoais */}
          <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
              <User size={16} className="text-gold-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Dados pessoais</p>
            </div>
            <form onSubmit={saveProfile} className="space-y-4 p-5">
              <Input label="Nome completo" value={form.name} onChange={set('name')} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="E-mail" type="email" value={form.email} onChange={set('email')} />
                <Input label="Telefone" value={form.phone} onChange={set('phone')} />
              </div>
              <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={set('birthDate')} />
              <div className="flex items-center gap-3 pt-1">
                <Button type="submit">
                  <Save size={15} /> Salvar alterações
                </Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-fade-in">
                    <CheckCircle2 size={16} /> Salvo com sucesso!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Alterar senha */}
          <div className="overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-cream-100 bg-gradient-to-r from-cream-50 to-white px-5 py-4">
              <Shield size={16} className="text-gold-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Segurança</p>
            </div>
            <form onSubmit={changePassword} className="space-y-4 p-5">
              <p className="text-sm font-semibold text-stone-600">Alterar senha</p>

              {pwMsg && pwMsg !== 'ok' && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  <Shield size={15} className="shrink-0" /> {pwMsg}
                </div>
              )}
              {pwMsg === 'ok' && (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                  <CheckCircle2 size={15} className="shrink-0" /> Senha alterada com sucesso!
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Senha atual"
                  type="password"
                  value={pw.current}
                  onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))}
                />
                <Input
                  label="Nova senha"
                  type="password"
                  value={pw.next}
                  onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))}
                />
                <Input
                  label="Confirmar senha"
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                />
              </div>
              <Button type="submit" variant="secondary">
                <KeyRound size={15} /> Atualizar senha
              </Button>
            </form>
          </div>

        </div>
      </div>

      {/* Sair — visível apenas no mobile (no desktop o botão fica no sidebar) */}
      <div className="lg:hidden">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border border-red-100 bg-red-50 py-4 text-sm font-semibold text-red-500 transition hover:bg-red-100"
        >
          <LogOut size={17} /> Sair da conta
        </button>
      </div>

    </div>
  )
}
