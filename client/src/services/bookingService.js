import { api } from '../lib/api.js'

export async function createBooking(payload) {
  const res = await api.post('/api/bookings', payload)
  return res.data.data
}

export async function getBookingStatus(bookingId) {
  const res = await api.get(`/api/bookings/status/${bookingId}`)
  return res.data.data
}

export async function updateBooking({ bookingId, payload }) {
  const res = await api.patch(`/api/bookings/status/${bookingId}`, payload)
  return res.data.data
}

export async function cancelBooking(bookingId) {
  const res = await api.patch(`/api/bookings/status/${bookingId}/cancel`)
  return res.data.data
}
