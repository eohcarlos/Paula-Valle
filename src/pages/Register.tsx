import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, Phone, AlertCircle } from 'lucide-react'
import { AuthShell } from './AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/store'

export default function Register() {
  const { register } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('A senha deve ter ao menos 6 caracteres.')
    if (form.password !== form.confirm) return setError('As senhas não coincidem.')
    const res = await register(form)
    if (!res.ok) return setError(res.error ?? 'Erro ao cadastrar.')
    navigate('/app')
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Leva menos de um minuto."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-gold-700 hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <Input label="Nome completo" name="name" placeholder="Seu nome" icon={<UserIcon size={18} />} value={form.name} onChange={set('name')} required />
        <Input label="Telefone" name="phone" placeholder="(11) 99999-9999" icon={<Phone size={18} />} value={form.phone} onChange={set('phone')} required />
        <Input label="E-mail" name="email" type="email" placeholder="seu@email.com" icon={<Mail size={18} />} value={form.email} onChange={set('email')} required />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Senha" name="password" type="password" placeholder="••••••••" icon={<Lock size={18} />} value={form.password} onChange={set('password')} required />
          <Input label="Confirmar senha" name="confirm" type="password" placeholder="••••••••" icon={<Lock size={18} />} value={form.confirm} onChange={set('confirm')} required />
        </div>
        <Button type="submit" className="w-full" size="lg">
          Criar minha conta
        </Button>
      </form>
    </AuthShell>
  )
}
