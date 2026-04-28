import { useQuery } from '@tanstack/react-query'
import { getBookingStatus } from '../../services/bookingService.js'

export function useBookingStatus(bookingId) {
  return useQuery({
    queryKey: ['booking-status', bookingId],
    queryFn: () => getBookingStatus(bookingId),
    enabled: Boolean(bookingId),
    retry: false,
  })
}
