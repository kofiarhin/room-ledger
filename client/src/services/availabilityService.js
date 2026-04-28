import { api } from '../lib/api.js'

export async function getAvailability({ roomId, date }) {
  const res = await api.get('/api/availability', { params: { roomId, date } })
  return res.data.data
}
