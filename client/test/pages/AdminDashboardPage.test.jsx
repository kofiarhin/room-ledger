import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import { AdminDashboardPage } from '../../src/pages/AdminDashboardPage.jsx'

vi.mock('../../src/hooks/queries/useRooms.js', () => ({
  useRooms: () => ({ data: [{ id: 'room-1', name: 'Conference Room A' }], isLoading: false }),
}))

vi.mock('../../src/hooks/queries/useAdminBookings.js', () => ({
  useAdminBookings: () => ({
    data: [
      {
        id: 'booking-1',
        bookingId: 'RL-20260504-ABCD',
        room: { name: 'Conference Room A' },
        requesterName: 'Mara Whitfield',
        requesterEmail: 'mara@example.com',
        department: 'IT',
        purpose: 'Planning',
        date: '2026-05-04',
        startTime: '08:00',
        endTime: '09:00',
        durationHours: 1,
        status: 'pending',
      },
    ],
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../../src/hooks/mutations/useAdminAuth.js', () => ({
  useAdminLogout: () => ({ mutate: vi.fn() }),
}))

vi.mock('../../src/hooks/mutations/useAdminBookingActions.js', () => ({
  useApproveAdminBooking: () => ({ mutate: vi.fn(), isPending: false }),
  useDenyAdminBooking: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteAdminBooking: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateAdminBooking: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('AdminDashboardPage', () => {
  test('renders bookings and MVP metrics', () => {
    render(
      <MemoryRouter>
        <AdminDashboardPage />
      </MemoryRouter>,
    )

    expect(screen.getByText('Total bookings')).toBeInTheDocument()
    expect(screen.getByText('Pending bookings')).toBeInTheDocument()
    expect(screen.getByText('Approved bookings')).toBeInTheDocument()
    expect(screen.getByText('Denied bookings')).toBeInTheDocument()
    expect(screen.getByText('Cancelled bookings')).toBeInTheDocument()
    expect(screen.getByText('RL-20260504-ABCD')).toBeInTheDocument()
  })
})
