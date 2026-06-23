import type { AppState, Service, User, Appointment, Professional } from '@/types'
import { format, subDays, addDays } from 'date-fns'

const iso = (d: Date) => format(d, 'yyyy-MM-dd')
const now = new Date()

export const SERVICES: Service[] = [
  { id: 'srv_corte_fem', name: 'Corte Feminino', description: 'Corte personalizado com finalização.', duration: 60, price: 90, active: true, icon: '✂️' },
  { id: 'srv_corte_masc', name: 'Corte Masculino', description: 'Corte masculino com acabamento.', duration: 40, price: 50, active: true, icon: '💈' },
  { id: 'srv_escova', name: 'Escova', description: 'Escova modeladora com brilho.', duration: 45, price: 60, active: true, icon: '💨' },
  { id: 'srv_coloracao', name: 'Coloração', description: 'Coloração completa com produtos premium.', duration: 120, price: 180, active: true, icon: '🎨' },
  { id: 'srv_mechas', name: 'Mechas', description: 'Mechas com técnica de iluminação.', duration: 180, price: 280, active: true, icon: '✨' },
  { id: 'srv_progressiva', name: 'Progressiva', description: 'Alisamento e redução de volume.', duration: 150, price: 250, active: true, icon: '🌿' },
  { id: 'srv_hidratacao', name: 'Hidratação', description: 'Tratamento profundo de hidratação.', duration: 50, price: 80, active: true, icon: '💧' },
  { id: 'srv_manicure', name: 'Manicure', description: 'Cuidado completo das unhas das mãos.', duration: 40, price: 40, active: true, icon: '💅' },
  { id: 'srv_pedicure', name: 'Pedicure', description: 'Cuidado completo das unhas dos pés.', duration: 50, price: 45, active: true, icon: '🦶' },
]

export const PROFESSIONALS_LIST: Professional[] = [
  { id: 'pro_paula', name: 'Paula Valle', role: 'Cabeleireira & Colorista', phone: '(11) 99999-0000', active: true, color: '#C9A35E' },
  { id: 'pro_renata', name: 'Renata', role: 'Manicure & Pedicure', phone: '(11) 98888-5555', active: true, color: '#E498A2' },
  { id: 'pro_julia', name: 'Júlia', role: 'Escova & Tratamentos', phone: '(11) 97777-6666', active: true, color: '#B79468' },
]

const PROFESSIONALS = PROFESSIONALS_LIST.map((p) => p.name)

export const ADMIN: User = {
  id: 'user_admin',
  role: 'admin',
  name: 'Paula Valle',
  email: 'admin@paulavalle.com',
  phone: '(11) 99999-0000',
  password: 'admin123',
  favorites: [],
  points: 0,
  createdAt: now.toISOString(),
}

const CLIENTS: User[] = [
  { id: 'user_maria', role: 'client', name: 'Maria Oliveira', email: 'cliente@teste.com', phone: '(11) 98888-1111', password: '123456', birthDate: '1992-04-12', favorites: ['srv_escova', 'srv_coloracao'], points: 120, notes: 'Prefere atendimento pela manhã.', createdAt: subDays(now, 200).toISOString() },
  { id: 'user_ana', role: 'client', name: 'Ana Souza', email: 'ana@teste.com', phone: '(11) 97777-2222', password: '123456', birthDate: '1988-09-30', favorites: ['srv_mechas'], points: 80, createdAt: subDays(now, 150).toISOString() },
  { id: 'user_carla', role: 'client', name: 'Carla Mendes', email: 'carla@teste.com', phone: '(11) 96666-3333', password: '123456', birthDate: '1995-01-22', favorites: ['srv_manicure', 'srv_pedicure'], points: 200, createdAt: subDays(now, 90).toISOString() },
  { id: 'user_bruna', role: 'client', name: 'Bruna Lima', email: 'bruna@teste.com', phone: '(11) 95555-4444', password: '123456', birthDate: '2000-07-08', favorites: ['srv_hidratacao'], points: 40, createdAt: subDays(now, 40).toISOString() },
]

function svcTotal(ids: string[]) {
  return ids.reduce((s, id) => s + (SERVICES.find((x) => x.id === id)?.price ?? 0), 0)
}
function svcDuration(ids: string[]) {
  return ids.reduce((s, id) => s + (SERVICES.find((x) => x.id === id)?.duration ?? 0), 0)
}

function mk(
  id: string,
  client: User,
  serviceIds: string[],
  date: Date,
  time: string,
  status: Appointment['status'],
  extra: Partial<Appointment> = {},
): Appointment {
  return {
    id,
    clientId: client.id,
    clientName: client.name,
    serviceIds,
    date: iso(date),
    time,
    status,
    professional: PROFESSIONALS[Math.floor(Math.random() * PROFESSIONALS.length)],
    total: svcTotal(serviceIds),
    duration: svcDuration(serviceIds),
    createdAt: subDays(date, 3).toISOString(),
    ...extra,
  }
}

const APPOINTMENTS: Appointment[] = [
  // Histórico finalizado
  mk('apt_1', CLIENTS[0], ['srv_coloracao', 'srv_escova'], subDays(now, 60), '09:00', 'completed', { rating: 5, reviewComment: 'Amei o resultado!' }),
  mk('apt_2', CLIENTS[0], ['srv_escova'], subDays(now, 30), '10:00', 'completed', { rating: 5 }),
  mk('apt_3', CLIENTS[0], ['srv_hidratacao'], subDays(now, 12), '11:00', 'completed', { rating: 4, reviewComment: 'Cabelo super macio.' }),
  mk('apt_4', CLIENTS[1], ['srv_mechas'], subDays(now, 20), '14:00', 'completed', { rating: 5 }),
  mk('apt_5', CLIENTS[2], ['srv_manicure', 'srv_pedicure'], subDays(now, 7), '15:00', 'completed', { rating: 5, reviewComment: 'Atendimento impecável.' }),
  mk('apt_6', CLIENTS[3], ['srv_hidratacao'], subDays(now, 5), '16:00', 'completed', { rating: 4 }),
  mk('apt_7', CLIENTS[1], ['srv_escova'], subDays(now, 2), '09:30', 'completed', { rating: 5 }),

  // Hoje
  mk('apt_8', CLIENTS[0], ['srv_escova'], now, '09:00', 'confirmed'),
  mk('apt_9', CLIENTS[2], ['srv_manicure'], now, '11:00', 'in_progress'),
  mk('apt_10', CLIENTS[1], ['srv_coloracao'], now, '14:00', 'scheduled'),

  // Futuros
  mk('apt_11', CLIENTS[0], ['srv_corte_fem', 'srv_hidratacao'], addDays(now, 2), '10:00', 'confirmed'),
  mk('apt_12', CLIENTS[3], ['srv_progressiva'], addDays(now, 3), '13:00', 'scheduled'),
  mk('apt_13', CLIENTS[2], ['srv_pedicure'], addDays(now, 5), '15:30', 'scheduled'),

  // Cancelado
  mk('apt_14', CLIENTS[1], ['srv_corte_fem'], subDays(now, 1), '17:00', 'canceled'),
]

export function buildSeedState(): AppState {
  return {
    users: [ADMIN, ...CLIENTS],
    services: SERVICES,
    professionals: PROFESSIONALS_LIST,
    appointments: APPOINTMENTS,
    notifications: [
      { id: 'ntf_1', audience: 'admin', appointmentId: 'apt_10', title: 'Novo agendamento', message: 'Ana Souza agendou Coloração para hoje às 14:00.', type: 'info', read: false, createdAt: now.toISOString() },
      { id: 'ntf_2', audience: 'client', userId: 'user_maria', appointmentId: 'apt_8', title: 'Agendamento confirmado', message: 'Sua Escova de hoje às 09:00 foi confirmada.', type: 'success', read: false, createdAt: now.toISOString() },
    ],
    settings: {
      name: 'Studio Paula Valle',
      description:
        'Studio de Beleza Negra especialista em cachos, crespos e tranças. Cachos saudáveis, sem frizz e sem química, valorizando a sua textura natural em Itu/SP.',
      instagram: '@paulavalle_e',
      whatsapp: '(11) 95221-9784',
      email: 'contato@paulavalle.com',
      address: 'Itu — São Paulo / SP',
      openTime: '09:00',
      closeTime: '19:00',
      workDays: [1, 2, 3, 4, 5, 6],
      slotInterval: 30,
      daySchedule: [0, 1, 2, 3, 4, 5, 6].map((d) => ({
        day: d,
        enabled: [1, 2, 3, 4, 5, 6].includes(d),
        open: '09:00',
        close: d === 6 ? '17:00' : '19:00',
        ranges:
          d === 6
            ? [{ open: '09:00', close: '17:00' }]
            : [
                { open: '09:00', close: '12:30' },
                { open: '13:30', close: '19:00' },
              ],
      })),
      bookingWindowDays: 21,
      cancelPolicy: 'Cancelamentos com no mínimo 24h de antecedência.',
      notifyNewBooking: true,
      notifyStatusChange: true,
      notifyReminder: true,
    },
    currentUserId: null,
  }
}
