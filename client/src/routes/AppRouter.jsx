import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout.jsx'
import { AdminDashboardPage } from '../pages/AdminDashboardPage.jsx'
import { AdminLoginPage } from '../pages/AdminLoginPage.jsx'
import { HomePage } from '../pages/HomePage.jsx'
import { RoomBookingPage } from '../pages/RoomBookingPage.jsx'
import { StatusPage } from '../pages/StatusPage.jsx'
import { ProtectedAdminRoute } from './ProtectedAdminRoute.jsx'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rooms/:roomSlug" element={<RoomBookingPage />} />
          <Route path="status" element={<StatusPage />} />
          <Route path="admin/login" element={<AdminLoginPage />} />
          <Route path="admin" element={<ProtectedAdminRoute />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
