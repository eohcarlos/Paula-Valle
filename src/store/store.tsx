import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import type {
  AppState,
  User,
  Service,
  Professional,
  Appointment,
  AppointmentStatus,
  Notification,
  SalonSettings,
} from '@/types'
import { buildSeedState } from '@/data/seed'
import { uid, nowISO } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import {
  fromUserRow,
  fromAppointmentRow,
  toAppointmentRow,
  fromNotificationRow,
  toNotificationRow,
  fromSettingsRow,
  toSettingsRow,
} from '@/lib/dbMappers'

const SESSION_KEY = 'salao_pv_session_user_id'

function logErr(label: string) {
  return ({ error }: { error: unknown }) => {
    if (error) console.error(`[supabase] ${label}:`, error)
  }
}

interface StoreContextType extends AppState {
  loading: boolean
  currentUser: User | null
  // auth
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: User }>
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{
    ok: boolean
    error?: string
    user?: User
  }>
  logout: () => void
  resetPassword: (email: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>
  verifyPassword: (id: string, password: string) => Promise<boolean>
  // users
  updateUser: (id: string, patch: Partial<User>) => void
  addClient: (data: Partial<User>) => User
  deleteUser: (id: string) => void
  toggleFavorite: (userId: string, serviceId: string) => void
  // services
  saveService: (svc: Service) => void
  deleteService: (id: string) => void
  // professionals
  saveProfessional: (pro: Professional) => void
  deleteProfessional: (id: string) => void
  // appointments
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'total' | 'duration' | 'clientName'>) => Appointment
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void
  rateAppointment: (id: string, rating: number, comment?: string) => void
  // notifications
  pushNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllRead: (audience: 'admin' | 'client', userId?: string) => void
  // settings
  updateSettings: (patch: Partial<SalonSettings>) => void
  // helpers
  resetDemo: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

const seedFallback = buildSeedState()

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ ...seedFallback, users: [], appointments: [], notifications: [] })
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    const [svcRes, proRes, aptRes, ntfRes, setRes, usrRes] = await Promise.all([
      supabase.from('services').select('*'),
      supabase.from('professionals').select('*'),
      supabase.from('appointments').select('*'),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      supabase.from('settings').select('*').eq('id', 'main').maybeSingle(),
      supabase.from('users_public').select('*'),
    ])

    const services: Service[] = (svcRes.data ?? []).map((s: any) => ({ ...s, price: Number(s.price) }))
    const professionals: Professional[] = proRes.data ?? []
    const appointments: Appointment[] = (aptRes.data ?? []).map(fromAppointmentRow)
    const notifications: Notification[] = (ntfRes.data ?? []).map(fromNotificationRow)
    const settings: SalonSettings = setRes.data ? fromSettingsRow(setRes.data) : seedFallback.settings
    const users: User[] = (usrRes.data ?? []).map((r: any) => ({ ...fromUserRow(r), password: '' }))

    const sessionId = localStorage.getItem(SESSION_KEY)
    const currentUserId = sessionId && users.some((u) => u.id === sessionId) ? sessionId : null
    if (sessionId && !currentUserId) localStorage.removeItem(SESSION_KEY)

    setState({ users, services, professionals, appointments, notifications, settings, currentUserId })
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  )

  const recalc = (serviceIds: string[]) => {
    const total = serviceIds.reduce((s, id) => s + (state.services.find((x) => x.id === id)?.price ?? 0), 0)
    const duration = serviceIds.reduce((s, id) => s + (state.services.find((x) => x.id === id)?.duration ?? 0), 0)
    return { total, duration }
  }

  const pushNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const row: Notification = { ...n, id: uid('ntf'), createdAt: nowISO(), read: false }
    setState((s) => ({ ...s, notifications: [row, ...s.notifications] }))
    supabase.from('notifications').insert(toNotificationRow(row)).then(logErr('pushNotification'))
  }, [])

  const login: StoreContextType['login'] = async (email, password) => {
    const { data, error } = await supabase.rpc('app_login', { p_email: email, p_password: password })
    if (error) return { ok: false, error: 'Erro ao entrar. Tente novamente.' }
    if (!data.ok) {
      return { ok: false, error: data.error === 'EMAIL_NOT_FOUND' ? 'E-mail não encontrado.' : 'Senha incorreta.' }
    }
    const user = fromUserRow(data.user)
    localStorage.setItem(SESSION_KEY, user.id)
    setState((s) => {
      const sanitized = { ...user, password: '' }
      const exists = s.users.some((u) => u.id === user.id)
      return {
        ...s,
        users: exists ? s.users.map((u) => (u.id === user.id ? sanitized : u)) : [...s.users, sanitized],
        currentUserId: user.id,
      }
    })
    return { ok: true, user }
  }

  const register: StoreContextType['register'] = async (data) => {
    const id = uid('user')
    const { data: res, error } = await supabase.rpc('app_register', {
      p_id: id,
      p_name: data.name,
      p_email: data.email,
      p_phone: data.phone,
      p_password: data.password,
      p_created_at: nowISO(),
    })
    if (error) return { ok: false, error: 'Erro ao cadastrar. Tente novamente.' }
    if (!res.ok) return { ok: false, error: 'Este e-mail já está cadastrado.' }
    const user = fromUserRow(res.user)
    localStorage.setItem(SESSION_KEY, user.id)
    setState((s) => ({ ...s, users: [...s.users, { ...user, password: '' }], currentUserId: user.id }))
    return { ok: true, user }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setState((s) => ({ ...s, currentUserId: null }))
  }

  const resetPassword: StoreContextType['resetPassword'] = async (email, newPassword) => {
    const { data, error } = await supabase.rpc('app_reset_password', { p_email: email, p_new_password: newPassword })
    if (error) return { ok: false, error: 'Erro ao redefinir senha.' }
    if (!data.ok) return { ok: false, error: 'E-mail não encontrado.' }
    return { ok: true }
  }

  const verifyPassword: StoreContextType['verifyPassword'] = async (id, password) => {
    const { data, error } = await supabase.rpc('app_verify_password', { p_id: id, p_password: password })
    if (error) return false
    return !!data
  }

  const updateUser: StoreContextType['updateUser'] = (id, patch) => {
    const { password, ...rest } = patch
    setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...rest } : u)) }))
    supabase.rpc('app_update_user', { p_id: id, p_patch: patch }).then(logErr('updateUser'))
  }

  const addClient: StoreContextType['addClient'] = (data) => {
    const id = uid('user')
    const createdAt = nowISO()
    const user: User = {
      id,
      role: 'client',
      name: data.name ?? 'Cliente',
      email: data.email ?? '',
      phone: data.phone ?? '',
      password: '',
      birthDate: data.birthDate,
      notes: data.notes,
      favorites: [],
      points: 0,
      createdAt,
    }
    setState((s) => ({ ...s, users: [...s.users, user] }))
    supabase
      .rpc('app_create_user', { p_id: id, p_data: { ...data, password: data.password ?? '123456', createdAt } })
      .then(logErr('addClient'))
    return user
  }

  const deleteUser: StoreContextType['deleteUser'] = (id) => {
    setState((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }))
    supabase.rpc('app_delete_user', { p_id: id }).then(logErr('deleteUser'))
  }

  const toggleFavorite: StoreContextType['toggleFavorite'] = (userId, serviceId) => {
    let nextFavorites: string[] = []
    setState((s) => ({
      ...s,
      users: s.users.map((u) => {
        if (u.id !== userId) return u
        nextFavorites = u.favorites.includes(serviceId)
          ? u.favorites.filter((f) => f !== serviceId)
          : [...u.favorites, serviceId]
        return { ...u, favorites: nextFavorites }
      }),
    }))
    supabase.rpc('app_update_user', { p_id: userId, p_patch: { favorites: nextFavorites } }).then(logErr('toggleFavorite'))
  }

  const saveService: StoreContextType['saveService'] = (svc) => {
    setState((s) => {
      const exists = s.services.some((x) => x.id === svc.id)
      return {
        ...s,
        services: exists ? s.services.map((x) => (x.id === svc.id ? svc : x)) : [...s.services, svc],
      }
    })
    supabase.from('services').upsert(svc).then(logErr('saveService'))
  }

  const deleteService: StoreContextType['deleteService'] = (id) => {
    setState((s) => ({ ...s, services: s.services.filter((x) => x.id !== id) }))
    supabase.from('services').delete().eq('id', id).then(logErr('deleteService'))
  }

  const saveProfessional: StoreContextType['saveProfessional'] = (pro) => {
    setState((s) => {
      const exists = s.professionals.some((x) => x.id === pro.id)
      return {
        ...s,
        professionals: exists ? s.professionals.map((x) => (x.id === pro.id ? pro : x)) : [...s.professionals, pro],
      }
    })
    supabase.from('professionals').upsert(pro).then(logErr('saveProfessional'))
  }

  const deleteProfessional: StoreContextType['deleteProfessional'] = (id) => {
    setState((s) => ({ ...s, professionals: s.professionals.filter((x) => x.id !== id) }))
    supabase.from('professionals').delete().eq('id', id).then(logErr('deleteProfessional'))
  }

  const createAppointment: StoreContextType['createAppointment'] = (data) => {
    const { total, duration } = recalc(data.serviceIds)
    const client = state.users.find((u) => u.id === data.clientId)
    const apt: Appointment = {
      ...data,
      id: uid('apt'),
      clientName: client?.name ?? 'Cliente',
      total,
      duration,
      createdAt: nowISO(),
    }
    setState((s) => ({ ...s, appointments: [...s.appointments, apt] }))
    supabase.from('appointments').insert(toAppointmentRow(apt)).then(logErr('createAppointment'))
    if (state.settings.notifyNewBooking) {
      pushNotification({
        audience: 'admin',
        appointmentId: apt.id,
        title: 'Novo agendamento',
        message: `${apt.clientName} agendou para ${apt.date} às ${apt.time}.`,
        type: 'info',
      })
    }
    return apt
  }

  const updateAppointment: StoreContextType['updateAppointment'] = (id, patch) => {
    let dbPatch: Partial<Appointment> = patch
    setState((s) => ({
      ...s,
      appointments: s.appointments.map((a) => {
        if (a.id !== id) return a
        const merged = { ...a, ...patch }
        if (patch.serviceIds) {
          merged.total = patch.serviceIds.reduce((sum, sid) => sum + (s.services.find((x) => x.id === sid)?.price ?? 0), 0)
          merged.duration = patch.serviceIds.reduce((sum, sid) => sum + (s.services.find((x) => x.id === sid)?.duration ?? 0), 0)
          dbPatch = { ...patch, total: merged.total, duration: merged.duration }
        }
        return merged
      }),
    }))
    supabase.from('appointments').update(toAppointmentRow(dbPatch)).eq('id', id).then(logErr('updateAppointment'))
  }

  const setAppointmentStatus: StoreContextType['setAppointmentStatus'] = (id, status) => {
    const apt = state.appointments.find((a) => a.id === id)
    setState((s) => {
      const cur = s.appointments.find((a) => a.id === id)
      let users = s.users
      if (cur && status === 'completed' && cur.status !== 'completed') {
        users = s.users.map((u) => (u.id === cur.clientId ? { ...u, points: u.points + 10 } : u))
      }
      return { ...s, users, appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)) }
    })
    supabase.from('appointments').update({ status }).eq('id', id).then(logErr('setAppointmentStatus'))
    if (apt && status === 'completed' && apt.status !== 'completed') {
      const client = state.users.find((u) => u.id === apt.clientId)
      supabase
        .rpc('app_update_user', { p_id: apt.clientId, p_patch: { points: (client?.points ?? 0) + 10 } })
        .then(logErr('addLoyaltyPoints'))
    }
    if (apt && state.settings.notifyStatusChange) {
      const labels: Record<AppointmentStatus, string> = {
        scheduled: 'agendado',
        confirmed: 'confirmado',
        in_progress: 'em atendimento',
        completed: 'finalizado',
        canceled: 'cancelado',
      }
      pushNotification({
        audience: 'client',
        userId: apt.clientId,
        appointmentId: apt.id,
        title: `Agendamento ${labels[status]}`,
        message: `Seu atendimento de ${apt.date} às ${apt.time} foi ${labels[status]}.`,
        type: status === 'canceled' ? 'warning' : 'success',
      })
    }
  }

  const rateAppointment: StoreContextType['rateAppointment'] = (id, rating, comment) => {
    setState((s) => ({
      ...s,
      appointments: s.appointments.map((a) => (a.id === id ? { ...a, rating, reviewComment: comment } : a)),
    }))
    supabase
      .from('appointments')
      .update({ rating, review_comment: comment })
      .eq('id', id)
      .then(logErr('rateAppointment'))
  }

  const markNotificationRead: StoreContextType['markNotificationRead'] = (id) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
    supabase.from('notifications').update({ read: true }).eq('id', id).then(logErr('markNotificationRead'))
  }

  const markAllRead: StoreContextType['markAllRead'] = (audience, userId) => {
    let ids: string[] = []
    setState((s) => {
      ids = s.notifications
        .filter((n) => n.audience === audience && (audience === 'admin' || n.userId === userId) && !n.read)
        .map((n) => n.id)
      return {
        ...s,
        notifications: s.notifications.map((n) =>
          n.audience === audience && (audience === 'admin' || n.userId === userId) ? { ...n, read: true } : n,
        ),
      }
    })
    if (ids.length) {
      supabase.from('notifications').update({ read: true }).in('id', ids).then(logErr('markAllRead'))
    }
  }

  const updateSettings: StoreContextType['updateSettings'] = (patch) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
    supabase.from('settings').update(toSettingsRow(patch)).eq('id', 'main').then(logErr('updateSettings'))
  }

  const resetDemo = () => {
    setLoading(true)
    loadAll()
  }

  const value: StoreContextType = {
    ...state,
    loading,
    currentUser,
    login,
    register,
    logout,
    resetPassword,
    verifyPassword,
    updateUser,
    addClient,
    deleteUser,
    toggleFavorite,
    saveService,
    deleteService,
    saveProfessional,
    deleteProfessional,
    createAppointment,
    updateAppointment,
    setAppointmentStatus,
    rateAppointment,
    pushNotification,
    markNotificationRead,
    markAllRead,
    updateSettings,
    resetDemo,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore deve ser usado dentro de StoreProvider')
  return ctx
}
