/** Monta link do WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '')
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`
}

export const DEFAULT_WHATS_MESSAGE = 'Olá! Gostaria de falar com o Studio Paula Valle.'
