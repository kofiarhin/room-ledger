import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  approveAdminBooking,
  deleteAdminBooking,
  denyAdminBooking,
  updateAdminBooking,
} from '../../services/adminService.js'

function useInvalidatingMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['availability'] })
    },
  })
}

export function useApproveAdminBooking() {
  return useInvalidatingMutation(approveAdminBooking)
}

export function useDenyAdminBooking() {
  return useInvalidatingMutation(denyAdminBooking)
}

export function useUpdateAdminBooking() {
  return useInvalidatingMutation(updateAdminBooking)
}

export function useDeleteAdminBooking() {
  return useInvalidatingMutation(deleteAdminBooking)
}
