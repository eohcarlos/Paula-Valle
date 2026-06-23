// ===== Domínio do Salão Paula Valle =====

export type Role = 'client' | 'admin'

export interface User {
  id: string
  role: Role
  name: string
  email: string
  phone: string
  password: string // demo apenas — em produção use hash no backend
  photo?: string
  birthDate?: string
  notes?: string
  favorites: string[] // ids de serviços favoritos
  points: number // fidelidade
  createdAt: string
}

export interface Service {
  id: string
  name: string
  description: string
  duration: number // minutos
  price: number
  active: boolean
  icon?: string
}

export interface Professional {
  id: string
  name: string
  role: string // especialidade / função
  phone?: string
  active: boolean
  color?: string // cor de identificação na agenda
}

export type AppointmentStatus =
  | 'scheduled' // Agendado
  | 'confirmed' // Confirmado
  | 'in_progress' // Em atendimento
  | 'completed' // Finalizado
  | 'canceled' // Cancelado

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  serviceIds: string[]
  date: string // yyyy-MM-dd
  time: string // HH:mm
  status: AppointmentStatus
  notes?: string
  professional: string
  total: number
  duration: number // minutos somados
  createdAt: string
  rating?: number // 1-5
  reviewComment?: string
}

export interface Notification {
  id: string
  audience: Role
  userId?: string // se direcionada a um cliente específico
  appointmentId?: string // agendamento relacionado (para abrir ao clicar)
  title: string
  message: string
  type: 'success' | 'info' | 'warning'
  read: boolean
  createdAt: string
}

export interface TimeRange {
  open: string // HH:mm
  close: string // HH:mm
}

export interface DaySchedule {
  day: number // 0=Dom ... 6=Sáb
  enabled: boolean
  open: string // HH:mm (legado — primeiro bloco)
  close: string // HH:mm (legado — primeiro bloco)
  ranges: TimeRange[] // blocos de horário do dia (permite intervalo de almoço, etc.)
}

export interface SalonSettings {
  name: string
  description?: string // sobre o studio (aparece na landing)
  instagram: string
  whatsapp: string
  email?: string
  address: string
  logo?: string
  openTime: string // HH:mm (legado / padrão)
  closeTime: string // HH:mm (legado / padrão)
  workDays: number[] // 0=Dom ... 6=Sáb (derivado de daySchedule)
  slotInterval: number // minutos entre atendimentos
  daySchedule: DaySchedule[] // horário de atendimento por dia da semana
  bookingWindowDays: number // até quantos dias à frente o cliente pode agendar
  cancelPolicy?: string // política de cancelamento (informativo)
  // preferências de notificação
  notifyNewBooking: boolean // avisar admin de novos agendamentos
  notifyStatusChange: boolean // avisar cliente de mudanças de status
  notifyReminder: boolean // lembrete 24h antes (simulado)
}

export interface AppState {
  users: User[]
  services: Service[]
  professionals: Professional[]
  appointments: Appointment[]
  notifications: Notification[]
  settings: SalonSettings
  currentUserId: string | null
}
