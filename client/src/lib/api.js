import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL

if (!apiBaseUrl) {
  throw new Error('Missing VITE_API_URL. Add it to client/.env.')
}

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

export function apiErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Request failed.'
}
