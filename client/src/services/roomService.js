import { api } from '../lib/api.js'

export async function getRooms() {
  const res = await api.get('/api/rooms')
  return res.data.data
}

export async function getRoom(roomIdOrSlug) {
  const res = await api.get(`/api/rooms/${roomIdOrSlug}`)
  return res.data.data
}
