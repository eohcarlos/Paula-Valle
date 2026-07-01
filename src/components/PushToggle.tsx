import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { getPushPermission, isSubscribed, subscribeToPush, unsubscribeFromPush } from '@/lib/push'
import { cn } from '@/lib/utils'

export function PushToggle({ userId }: { userId: string }) {
  const [supported, setSupported] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const permission = getPushPermission()
    if (permission === 'unsupported') {
      setSupported(false)
      return
    }
    isSubscribed().then(setSubscribed)
  }, [])

  async function toggle() {
    setError('')
    setBusy(true)
    try {
      if (subscribed) {
        await unsubscribeFromPush()
        setSubscribed(false)
      } else {
        await subscribeToPush(userId)
        setSubscribed(true)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível ativar as notificações.')
    } finally {
      setBusy(false)
    }
  }

  if (!supported) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-4">
        <BellOff size={18} className="mt-0.5 shrink-0 text-stone-400" />
        <div>
          <p className="text-sm font-medium text-stone-600">Notificações push indisponíveis</p>
          <p className="mt-0.5 text-xs text-stone-400">
            Seu navegador não suporta notificações push. No iPhone, instale o app na tela inicial primeiro.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {subscribed ? (
            <BellRing size={18} className="shrink-0 text-gold-600" />
          ) : (
            <Bell size={18} className="shrink-0 text-stone-400" />
          )}
          <div>
            <p className="text-sm font-medium text-stone-700">Notificações push</p>
            <p className="text-xs text-stone-400">
              {subscribed ? 'Ativadas neste dispositivo.' : 'Receba avisos de agendamentos neste dispositivo.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={busy}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50',
            subscribed ? 'bg-gold-500' : 'bg-stone-300',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
              subscribed ? 'left-[22px]' : 'left-0.5',
            )}
          />
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}
