import type { Appointment, Notification, SalonSettings, User } from '@/types'

export function fromUserRow(r: any): User {
  return {
    id: r.id,
    role: r.role,
    name: r.name,
    email: r.email,
    phone: r.phone,
    password: r.password ?? '',
    photo: r.photo ?? undefined,
    birthDate: r.birth_date ?? undefined,
    notes: r.notes ?? undefined,
    favorites: r.favorites ?? [],
    points: r.points ?? 0,
    createdAt: r.created_at,
  }
}

export function fromAppointmentRow(r: any): Appointment {
  return {
    id: r.id,
    clientId: r.client_id,
    clientName: r.client_name,
    serviceIds: r.service_ids ?? [],
    date: r.date,
    time: r.time,
    status: r.status,
    notes: r.notes ?? undefined,
    professional: r.professional,
    total: Number(r.total),
    duration: r.duration,
    createdAt: r.created_at,
    rating: r.rating ?? undefined,
    reviewComment: r.review_comment ?? undefined,
  }
}

export function toAppointmentRow(a: Partial<Appointment>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (a.id !== undefined) row.id = a.id
  if (a.clientId !== undefined) row.client_id = a.clientId
  if (a.clientName !== undefined) row.client_name = a.clientName
  if (a.serviceIds !== undefined) row.service_ids = a.serviceIds
  if (a.date !== undefined) row.date = a.date
  if (a.time !== undefined) row.time = a.time
  if (a.status !== undefined) row.status = a.status
  if (a.notes !== undefined) row.notes = a.notes
  if (a.professional !== undefined) row.professional = a.professional
  if (a.total !== undefined) row.total = a.total
  if (a.duration !== undefined) row.duration = a.duration
  if (a.createdAt !== undefined) row.created_at = a.createdAt
  if (a.rating !== undefined) row.rating = a.rating
  if (a.reviewComment !== undefined) row.review_comment = a.reviewComment
  return row
}

export function fromNotificationRow(r: any): Notification {
  return {
    id: r.id,
    audience: r.audience,
    userId: r.user_id ?? undefined,
    appointmentId: r.appointment_id ?? undefined,
    title: r.title,
    message: r.message,
    type: r.type,
    read: r.read,
    createdAt: r.created_at,
  }
}

export function toNotificationRow(n: Partial<Notification>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (n.id !== undefined) row.id = n.id
  if (n.audience !== undefined) row.audience = n.audience
  if (n.userId !== undefined) row.user_id = n.userId
  if (n.appointmentId !== undefined) row.appointment_id = n.appointmentId
  if (n.title !== undefined) row.title = n.title
  if (n.message !== undefined) row.message = n.message
  if (n.type !== undefined) row.type = n.type
  if (n.read !== undefined) row.read = n.read
  if (n.createdAt !== undefined) row.created_at = n.createdAt
  return row
}

export function fromSettingsRow(r: any): SalonSettings {
  return {
    name: r.name,
    description: r.description ?? undefined,
    instagram: r.instagram,
    whatsapp: r.whatsapp,
    email: r.email ?? undefined,
    address: r.address,
    logo: r.logo ?? undefined,
    openTime: r.open_time,
    closeTime: r.close_time,
    workDays: r.work_days ?? [],
    slotInterval: r.slot_interval,
    daySchedule: r.day_schedule ?? [],
    bookingWindowDays: r.booking_window_days,
    cancelPolicy: r.cancel_policy ?? undefined,
    notifyNewBooking: r.notify_new_booking,
    notifyStatusChange: r.notify_status_change,
    notifyReminder: r.notify_reminder,
  }
}

export function toSettingsRow(s: Partial<SalonSettings>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (s.name !== undefined) row.name = s.name
  if (s.description !== undefined) row.description = s.description
  if (s.instagram !== undefined) row.instagram = s.instagram
  if (s.whatsapp !== undefined) row.whatsapp = s.whatsapp
  if (s.email !== undefined) row.email = s.email
  if (s.address !== undefined) row.address = s.address
  if (s.logo !== undefined) row.logo = s.logo
  if (s.openTime !== undefined) row.open_time = s.openTime
  if (s.closeTime !== undefined) row.close_time = s.closeTime
  if (s.workDays !== undefined) row.work_days = s.workDays
  if (s.slotInterval !== undefined) row.slot_interval = s.slotInterval
  if (s.daySchedule !== undefined) row.day_schedule = s.daySchedule
  if (s.bookingWindowDays !== undefined) row.booking_window_days = s.bookingWindowDays
  if (s.cancelPolicy !== undefined) row.cancel_policy = s.cancelPolicy
  if (s.notifyNewBooking !== undefined) row.notify_new_booking = s.notifyNewBooking
  if (s.notifyStatusChange !== undefined) row.notify_status_change = s.notifyStatusChange
  if (s.notifyReminder !== undefined) row.notify_reminder = s.notifyReminder
  return row
}
