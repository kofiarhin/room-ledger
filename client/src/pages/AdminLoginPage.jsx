import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminLogin } from '../hooks/mutations/useAdminAuth.js'
import { Button } from '../components/common/Button.jsx'
import { InputField } from '../components/common/FormFields.jsx'
import { ErrorMessage } from '../components/common/States.jsx'
import { apiErrorMessage } from '../lib/api.js'

export function AdminLoginPage() {
  const admin = useSelector((state) => state.auth.admin)
  const navigate = useNavigate()
  const login = useAdminLogin()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (login.isSuccess) navigate('/admin/dashboard')
  }, [login.isSuccess, navigate])

  if (admin) return <Navigate to="/admin/dashboard" replace />

  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_60px_-42px_rgba(24,24,27,0.6)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Private workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">Review and manage RoomLedger booking requests.</p>
      </div>
      <form
        className="grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault()
          login.mutate(form)
        }}
      >
        <ErrorMessage message={login.error ? apiErrorMessage(login.error) : ''} />
        <InputField label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <InputField label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" disabled={login.isPending} className="w-full">
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  )
}
