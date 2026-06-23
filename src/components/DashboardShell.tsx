import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, Outlet } from 'react-router-dom'
import { Bell, LogOut, Menu, X, Check, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { Logo, Avatar } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useStore } from '@/store/store'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  end?: boolean
}

export function DashboardShell({ items, role }: { items: NavItem[]; role: Role }) {
  const { currentUser, logout, updateUser, notifications, markAllRead, markNotificationRead } = useStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('salao_sidebar_collapsed') === '1')
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('salao_sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return
    const reader = new FileReader()
    reader.onload = () => updateUser(currentUser.id, { photo: reader.result as string })
    reader.readAsDataURL(file)
  }

  const myNotifs = notifications.filter(
    (n) => n.audience === role && (role === 'admin' || n.userId === currentUser?.id),
  )
  const unread = myNotifs.filter((n) => !n.read).length

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const renderSidebar = (isCollapsed: boolean) => (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-cream-200 bg-white/80 backdrop-blur transition-[width] duration-300',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className={cn('flex py-5', isCollapsed ? 'flex-col items-center gap-3 px-2' : 'items-center justify-between px-5')}>
        <Logo compact={isCollapsed} />
        {/* Fechar (mobile) */}
        <button className="lg:hidden" onClick={() => setMobileOpen(false)}>
          <X size={22} className="text-stone-400" />
        </button>
        {/* Recolher / expandir (desktop) */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          className="hidden h-8 w-8 items-center justify-center rounded-xl text-stone-400 transition hover:bg-cream-100 hover:text-gold-700 lg:flex"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn('nav-link', isActive && 'nav-link-active', isCollapsed && 'justify-center px-0')
            }
          >
            {item.icon}
            {!isCollapsed && item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-cream-200 p-3">
        <div className={cn('mb-2 flex items-center gap-3 rounded-2xl py-2', isCollapsed ? 'justify-center px-0' : 'px-3')}>
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            className="group/avatar relative shrink-0"
            title="Alterar foto de perfil"
          >
            <Avatar name={currentUser?.name ?? ''} src={currentUser?.photo} size={40} />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-white shadow ring-2 ring-white transition group-hover/avatar:scale-110">
              <Camera size={11} />
            </span>
          </button>
          <input ref={photoRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-700">{currentUser?.name}</p>
              <p className="truncate text-xs text-stone-400">{currentUser?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Sair' : undefined}
          className={cn('nav-link w-full text-stone-500 hover:text-red-500', isCollapsed && 'justify-center px-0')}
        >
          <LogOut size={18} /> {!isCollapsed && 'Sair'}
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{renderSidebar(collapsed)}</div>

      {/* Mobile sidebar (sempre expandido no drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full animate-fade-in">{renderSidebar(false)}</div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex items-center justify-between border-b border-cream-200 bg-white/70 px-4 py-3 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={24} className="text-stone-600" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-stone-400">
              {role === 'admin' ? 'Painel Administrativo' : 'Painel do Cliente'}
            </p>
          </div>

          <div className="relative flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative rounded-full p-2.5 text-stone-500 transition hover:bg-cream-100"
            >
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blush-500 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-12 z-20 w-80 animate-scale-in rounded-3xl border border-cream-200 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
                    <p className="font-semibold text-stone-700">Notificações</p>
                    {unread > 0 && (
                      <button
                        onClick={() => markAllRead(role, currentUser?.id)}
                        className="flex items-center gap-1 text-xs text-gold-700 hover:underline"
                      >
                        <Check size={14} /> Marcar lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {myNotifs.length === 0 && (
                      <p className="px-4 py-8 text-center text-sm text-stone-400">Nenhuma notificação.</p>
                    )}
                    {myNotifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id)
                          setNotifOpen(false)
                          if (n.appointmentId) {
                            const base = role === 'admin' ? '/admin/agendamentos' : '/app/agendamentos'
                            navigate(`${base}?apt=${n.appointmentId}`)
                          }
                        }}
                        className={cn(
                          'flex w-full gap-3 border-b border-cream-100 px-4 py-3 text-left transition hover:bg-cream-50',
                          !n.read && 'bg-blush-50/50',
                        )}
                      >
                        <span
                          className={cn(
                            'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                            n.type === 'success' && 'bg-emerald-500',
                            n.type === 'info' && 'bg-sky-500',
                            n.type === 'warning' && 'bg-blush-500',
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium text-stone-700">{n.title}</p>
                          <p className="text-xs text-stone-500">{n.message}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Avatar name={currentUser?.name ?? ''} src={currentUser?.photo} size={36} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
