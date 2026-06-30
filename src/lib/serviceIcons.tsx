import {
  Scissors, Wind, Palette, Sparkles, Leaf, Droplet,
  Hand, Footprints, Heart, Crown, Flower2, Brush,
  type LucideIcon,
} from 'lucide-react'

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  scissors: Scissors,
  wind: Wind,
  palette: Palette,
  sparkles: Sparkles,
  leaf: Leaf,
  droplet: Droplet,
  hand: Hand,
  footprints: Footprints,
  heart: Heart,
  crown: Crown,
  flower: Flower2,
  brush: Brush,
}

export const SERVICE_ICON_KEYS = Object.keys(SERVICE_ICONS)

/** Mapa de emojis legados (salvos antes da migração para ícones Lucide) para as novas chaves. */
const LEGACY_EMOJI_MAP: Record<string, string> = {
  '✂️': 'scissors',
  '💈': 'scissors',
  '💨': 'wind',
  '🎨': 'palette',
  '✨': 'sparkles',
  '🌿': 'leaf',
  '💧': 'droplet',
  '💅': 'hand',
  '🦶': 'footprints',
  '💆': 'heart',
  '👑': 'crown',
  '🌸': 'flower',
}

/** Normaliza o campo icon de um serviço vindo do banco: emoji legado → chave de ícone Lucide. */
export function normalizeServiceIcon(icon?: string): string {
  if (!icon) return 'scissors'
  return LEGACY_EMOJI_MAP[icon] ?? icon
}

/** Renderiza o ícone de um serviço. Compatível com dados antigos salvos como emoji. */
export function ServiceIcon({ icon, size = 20, className }: { icon?: string; size?: number; className?: string }) {
  const Icon = icon ? SERVICE_ICONS[icon] : undefined
  if (Icon) return <Icon size={size} className={className} />
  if (icon) return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{icon}</span>
  return <Scissors size={size} className={className} />
}
