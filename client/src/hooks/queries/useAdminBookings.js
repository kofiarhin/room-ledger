import { useQuery } from '@tanstack/react-query'
import { getAdminBookings } from '../../services/adminService.js'

export function useAdminBookings(filters) {
  return useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => getAdminBookings(filters),
  })
}
