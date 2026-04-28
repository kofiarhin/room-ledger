import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import { StatusPage } from '../../src/pages/StatusPage.jsx'

vi.mock('../../src/hooks/queries/useBookingStatus.js', () => ({
  useBookingStatus: (bookingId) => ({
    data: bookingId
      ? {
          id: '1',
          bookingId,
          room: { name: 'Conference Room A' },
          requesterName: 'Mara Whitfield',
          requesterEmail: 'mara@example.com',
          department: 'IT',
          purpose: 'Planning',
          date: '2026-05-04',
          startTime: '08:00',
          endTime: '09:00',
          durationHours: 1,
          status: 'approved',
        }
      : null,
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../../src/hooks/mutations/useCancelBooking.js', () => ({
  useCancelBooking: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}))

describe('StatusPage', () => {
  test('renders found booking as read-only when approved', async () => {
    const user = userEvent.setup()
    render(<StatusPage />)

    await user.type(screen.getByLabelText(/booking id/i), 'RL-20260504-ABCD')
    await user.click(screen.getByRole('button', { name: /look up/i }))

    expect(screen.getByText('approved')).toBeInTheDocument()
    expect(screen.getByText(/read-only/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /edit pending booking/i })).not.toBeInTheDocument()
  })
})
