import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { AuthShell } from './AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/store'

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await login(email, password)
    if (!res.ok) {
      setError(res.error ?? 'Erro ao entrar.')
      return
    }
    navigate(res.user?.role === 'admin' ? '/admin' : '/app')
  }

  return (
    <AuthShell
      title="Bem-vinda de volta"
      subtitle="Entre para gerenciar seus agendamentos."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-semibold text-gold-700 hover:underline">
            Cadastre-se
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
        <Input
          label="E-mail"
          name="email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <Link to="/recuperar-senha" className="text-sm text-gold-700 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg">
          Entrar
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-cream-200 bg-cream-50 p-4 text-xs text-stone-500">
        <p className="font-semibold text-stone-600">Contas de demonstração:</p>
        <p className="mt-1">👩‍💼 Admin: <b>admin@paulavalle.com</b> / admin123</p>
        <p>👩 Cliente: <b>cliente@teste.com</b> / 123456</p>
      </div>
    </AuthShell>
  )
}
