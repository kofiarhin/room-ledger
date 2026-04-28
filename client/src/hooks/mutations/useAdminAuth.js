import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { clearAdmin, setAdmin } from '../../redux/auth/authSlice.js'
import { loginAdmin, logoutAdmin } from '../../services/adminService.js'

export function useAdminLogin() {
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (admin) => dispatch(setAdmin(admin)),
  })
}

export function useAdminLogout() {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutAdmin,
    onSettled: () => {
      dispatch(clearAdmin())
      queryClient.removeQueries({ queryKey: ['admin-bookings'] })
    },
  })
}
