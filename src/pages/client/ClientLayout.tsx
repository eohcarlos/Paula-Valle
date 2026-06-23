import { LayoutDashboard, CalendarPlus, CalendarCheck, History, Gift, Heart, UserCircle } from 'lucide-react'
import { DashboardShell, type NavItem } from '@/components/DashboardShell'

const items: NavItem[] = [
  { to: '/app', label: 'Início', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/app/agendar', label: 'Agendar', icon: <CalendarPlus size={18} /> },
  { to: '/app/agendamentos', label: 'Meus Agendamentos', icon: <CalendarCheck size={18} /> },
  { to: '/app/historico', label: 'Histórico', icon: <History size={18} /> },
  { to: '/app/fidelidade', label: 'Fidelidade', icon: <Gift size={18} /> },
  { to: '/app/favoritos', label: 'Favoritos', icon: <Heart size={18} /> },
  { to: '/app/perfil', label: 'Meu Perfil', icon: <UserCircle size={18} /> },
]

export default function ClientLayout() {
  return <DashboardShell items={items} role="client" />
}
