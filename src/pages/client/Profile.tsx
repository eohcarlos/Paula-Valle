import { useState, useRef } from 'react'
import { Camera, Save, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/store/store'
import { SectionTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/Logo'

export default function Profile() {
  const { currentUser, updateUser, verifyPassword } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    birthDate: currentUser?.birthDate ?? '',
    photo: currentUser?.photo ?? '',
  })
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')

  if (!currentUser) return null
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

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

  return (
    <div className="space-y-6">
      <SectionTitle title="Meu perfil" subtitle="Mantenha seus dados sempre atualizados." />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Foto */}
        <div className="card flex flex-col items-center text-center">
          <div className="relative">
            <Avatar name={form.name} src={form.photo} size={120} />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gold-500 text-white shadow-gold transition hover:scale-110"
            >
              <Camera size={16} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          </div>
          <p className="mt-4 font-serif text-xl font-semibold">{form.name}</p>
          <p className="text-sm text-stone-400">{form.email}</p>
          <div className="mt-4 w-full rounded-2xl bg-cream-50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-stone-400">Pontos</span><span className="font-semibold text-gold-700">{currentUser.points}</span></div>
            <div className="mt-1 flex justify-between"><span className="text-stone-400">Cliente desde</span><span className="font-medium">{new Date(currentUser.createdAt).getFullYear()}</span></div>
          </div>
        </div>

        {/* Dados */}
        <div className="card lg:col-span-2">
          <form onSubmit={saveProfile} className="space-y-4">
            <h3 className="font-semibold">Dados pessoais</h3>
            <Input label="Nome completo" value={form.name} onChange={set('name')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="E-mail" type="email" value={form.email} onChange={set('email')} />
              <Input label="Telefone" value={form.phone} onChange={set('phone')} />
            </div>
            <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={set('birthDate')} />
            <div className="flex items-center gap-3">
              <Button type="submit"><Save size={16} /> Salvar alterações</Button>
              {saved && <span className="flex items-center gap-1 text-sm text-emerald-600 animate-fade-in"><CheckCircle2 size={16} /> Salvo!</span>}
            </div>
          </form>

          <div className="my-6 border-t border-cream-200" />

          <form onSubmit={changePassword} className="space-y-4">
            <h3 className="font-semibold">Alterar senha</h3>
            {pwMsg && pwMsg !== 'ok' && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{pwMsg}</p>}
            {pwMsg === 'ok' && <p className="flex items-center gap-1 rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-600"><CheckCircle2 size={15} /> Senha alterada com sucesso!</p>}
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Senha atual" type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} />
              <Input label="Nova senha" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} />
              <Input label="Confirmar" type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} />
            </div>
            <Button type="submit" variant="secondary">Atualizar senha</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
