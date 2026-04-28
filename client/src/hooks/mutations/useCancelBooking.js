import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelBooking } from '../../services/bookingService.js'

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(['booking-status', booking.bookingId], booking)
    },
  })
}
