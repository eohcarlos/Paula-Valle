import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { AuthShell } from './AuthShell'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/store'

export default function ForgotPassword() {
  const { resetPassword } = useStore()
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function checkEmail(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    // Em produção, aqui enviaríamos um e-mail de recuperação.
    setStep('reset')
  }

  async function doReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('A senha deve ter ao menos 6 caracteres.')
    const res = await resetPassword(email, password)
    if (!res.ok) {
      setError(res.error ?? 'Erro.')
      setStep('email')
      return
    }
    setStep('done')
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Redefina sua senha em poucos passos."
      footer={
        <Link to="/login" className="font-semibold text-gold-700 hover:underline">
          Voltar ao login
        </Link>
      }
    >
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={checkEmail} className="space-y-4">
          <Input label="E-mail da conta" name="email" type="email" placeholder="seu@email.com" icon={<Mail size={18} />} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full" size="lg">
            Continuar
          </Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={doReset} className="space-y-4">
          <Input label="Nova senha" name="newpass" type="password" placeholder="••••••••" icon={<Lock size={18} />} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" size="lg">
            Redefinir senha
          </Button>
        </form>
      )}

      {step === 'done' && (
        <div className="rounded-2xl bg-emerald-50 p-6 text-center">
          <CheckCircle className="mx-auto text-emerald-500" size={40} />
          <p className="mt-3 font-semibold text-emerald-700">Senha redefinida com sucesso!</p>
          <Link to="/login" className="mt-4 inline-block">
            <Button>Ir para o login</Button>
          </Link>
        </div>
      )}
    </AuthShell>
  )
}
