import { api } from '../lib/api.js'

export async function loginAdmin(payload) {
  const res = await api.post('/api/admin/login', payload)
  return res.data.data
}

export async function logoutAdmin() {
  const res = await api.post('/api/admin/logout')
  return res.data.data
}

export async function getCurrentAdmin() {
  const res = await api.get('/api/admin/me')
  return res.data.data
}

export async function getAdminBookings(params = {}) {
  const res = await api.get('/api/admin/bookings', { params })
  return res.data.data
}

export async function updateAdminBooking({ id, payload }) {
  const res = await api.patch(`/api/admin/bookings/${id}`, payload)
  return res.data.data
}

export async function approveAdminBooking(id) {
  const res = await api.patch(`/api/admin/bookings/${id}/approve`)
  return res.data.data
}

export async function denyAdminBooking({ id, adminNote }) {
  const res = await api.patch(`/api/admin/bookings/${id}/deny`, { adminNote })
  return res.data.data
}

export async function deleteAdminBooking(id) {
  const res = await api.delete(`/api/admin/bookings/${id}`)
  return res.data.data
}
