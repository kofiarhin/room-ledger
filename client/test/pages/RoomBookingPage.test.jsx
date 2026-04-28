import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import { RoomBookingPage } from '../../src/pages/RoomBookingPage.jsx'

const mutate = vi.fn()

vi.mock('../../src/hooks/queries/useRoom.js', () => ({
  useRoom: () => ({
    data: { id: 'room-1', name: 'Conference Room A', slug: 'conference-room-a' },
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../../src/hooks/queries/useAvailability.js', () => ({
  useAvailability: () => ({
    data: {
      blockedIntervals: [],
      slots: [
        { startTime: '08:00', durations: [1, 2] },
        { startTime: '09:00', durations: [1] },
      ],
    },
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../../src/hooks/mutations/useCreateBooking.js', () => ({
  useCreateBooking: () => ({ mutate, isPending: false, error: null }),
}))

describe('RoomBookingPage', () => {
  test('renders availability and validates booking form', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/rooms/conference-room-a']}>
        <Routes>
          <Route path="/rooms/:roomSlug" element={<RoomBookingPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Conference Room A')).toBeInTheDocument()
    expect(screen.getByText('Fully open')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /request booking/i }))

    expect(screen.getByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Valid email is required.')).toBeInTheDocument()
  })
})
