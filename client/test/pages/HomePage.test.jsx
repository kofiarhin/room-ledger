import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import { HomePage } from '../../src/pages/HomePage.jsx'

vi.mock('../../src/hooks/queries/useRooms.js', () => ({
  useRooms: () => ({
    data: [
      { id: '1', name: 'Conference Room A', slug: 'conference-room-a' },
      { id: '2', name: 'Conference Room B', slug: 'conference-room-b' },
    ],
    isLoading: false,
    error: null,
  }),
}))

describe('HomePage', () => {
  test('renders room selection and status link', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText('RoomLedger')).toBeInTheDocument()
    expect(screen.getByText('Conference Room A')).toBeInTheDocument()
    expect(screen.getByText('Conference Room B')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /check booking status/i })).toBeInTheDocument()
  })
})
