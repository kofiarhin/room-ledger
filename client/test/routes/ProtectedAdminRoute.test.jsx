import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import authReducer from '../../src/redux/auth/authSlice.js'
import uiReducer from '../../src/redux/ui/uiSlice.js'
import { ProtectedAdminRoute } from '../../src/routes/ProtectedAdminRoute.jsx'

vi.mock('../../src/services/adminService.js', () => ({
  getCurrentAdmin: vi.fn().mockRejectedValue(new Error('unauthorized')),
}))

function renderRoute() {
  const store = configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
    preloadedState: { auth: { admin: null, checked: true }, ui: { banner: null } },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/login" element={<p>Login page</p>} />
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route path="dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
}

describe('ProtectedAdminRoute', () => {
  test('redirects unauthenticated users to login', async () => {
    renderRoute()

    await waitFor(() => {
      expect(screen.getByText('Login page')).toBeInTheDocument()
    })
  })
})
