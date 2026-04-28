import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { clearAdmin, setAdmin, setAuthChecked } from '../redux/auth/authSlice.js'
import { getCurrentAdmin } from '../services/adminService.js'
import { SkeletonBlock } from '../components/common/States.jsx'

export function ProtectedAdminRoute() {
  const dispatch = useDispatch()
  const { admin, checked } = useSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(!checked)

  useEffect(() => {
    if (checked) {
      setIsChecking(false)
      return undefined
    }

    let active = true
    setIsChecking(true)

    getCurrentAdmin()
      .then((currentAdmin) => {
        if (active) dispatch(setAdmin(currentAdmin))
      })
      .catch(() => {
        if (active) dispatch(clearAdmin())
      })
      .finally(() => {
        if (active) {
          dispatch(setAuthChecked())
          setIsChecking(false)
        }
      })

    return () => {
      active = false
    }
  }, [checked, dispatch])

  if (isChecking) return <SkeletonBlock className="h-64" />
  if (!admin) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
