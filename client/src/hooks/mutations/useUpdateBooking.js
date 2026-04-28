import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBooking } from '../../services/bookingService.js'

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBooking,
    onSuccess: (booking) => {
      queryClient.setQueryData(['booking-status', booking.bookingId], booking)
    },
  })
}
