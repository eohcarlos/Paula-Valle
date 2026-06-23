import { LayoutDashboard, CalendarCheck, CalendarDays, Users, UserCog, Scissors, BarChart3, Settings } from 'lucide-react'
import { DashboardShell, type NavItem } from '@/components/DashboardShell'

const items: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/agendamentos', label: 'Agendamentos', icon: <CalendarCheck size={18} /> },
  { to: '/admin/agenda', label: 'Agenda', icon: <CalendarDays size={18} /> },
  { to: '/admin/clientes', label: 'Clientes', icon: <Users size={18} /> },
  { to: '/admin/profissionais', label: 'Profissionais', icon: <UserCog size={18} /> },
  { to: '/admin/servicos', label: 'Serviços', icon: <Scissors size={18} /> },
  { to: '/admin/relatorios', label: 'Relatórios', icon: <BarChart3 size={18} /> },
  { to: '/admin/configuracoes', label: 'Configurações', icon: <Settings size={18} /> },
]

export default function AdminLayout() {
  return <DashboardShell items={items} role="admin" />
}
