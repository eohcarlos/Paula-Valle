import { MessageCircle } from 'lucide-react'
import { useStore } from '@/store/store'
import { whatsappLink, DEFAULT_WHATS_MESSAGE } from '@/lib/whatsapp'

export function WhatsAppButton() {
  const { settings } = useStore()
  return (
    <a
      href={whatsappLink(settings.whatsapp, DEFAULT_WHATS_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl animate-float"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={22} className="fill-white/20" />
      <span className="hidden text-sm font-medium sm:inline">WhatsApp</span>
    </a>
  )
}
