import { useMutation } from '@tanstack/react-query'
import { createBooking } from '../../services/bookingService.js'

export function useCreateBooking() {
  return useMutation({ mutationFn: createBooking })
}
