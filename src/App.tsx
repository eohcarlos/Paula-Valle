import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store/store'
import type { Role } from '@/types'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'

import ClientLayout from '@/pages/client/ClientLayout'
import ClientDashboard from '@/pages/client/Dashboard'
import Booking from '@/pages/client/Booking'
import ClientAppointments from '@/pages/client/Appointments'
import History from '@/pages/client/History'
import Profile from '@/pages/client/Profile'
import Loyalty from '@/pages/client/Loyalty'
import Favorites from '@/pages/client/Favorites'

import AdminLayout from '@/pages/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminAppointments from '@/pages/admin/Appointments'
import Agenda from '@/pages/admin/Agenda'
import Clients from '@/pages/admin/Clients'
import Services from '@/pages/admin/Services'
import Professionals from '@/pages/admin/Professionals'
import Reports from '@/pages/admin/Reports'
import Settings from '@/pages/admin/Settings'

function Protected({ role, children }: { role: Role; children: React.ReactNode }) {
  const { currentUser, loading } = useStore()
  if (loading) return null
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/app'} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/recuperar-senha" element={<ForgotPassword />} />

      {/* Painel do Cliente */}
      <Route
        path="/app"
        element={
          <Protected role="client">
            <ClientLayout />
          </Protected>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="agendar" element={<Booking />} />
        <Route path="agendamentos" element={<ClientAppointments />} />
        <Route path="historico" element={<History />} />
        <Route path="fidelidade" element={<Loyalty />} />
        <Route path="favoritos" element={<Favorites />} />
        <Route path="perfil" element={<Profile />} />
      </Route>

      {/* Painel Administrativo */}
      <Route
        path="/admin"
        element={
          <Protected role="admin">
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="agendamentos" element={<AdminAppointments />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="profissionais" element={<Professionals />} />
        <Route path="servicos" element={<Services />} />
        <Route path="relatorios" element={<Reports />} />
        <Route path="configuracoes" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
