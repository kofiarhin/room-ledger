import { useQuery } from '@tanstack/react-query'
import { getAvailability } from '../../services/availabilityService.js'

export function useAvailability({ roomId, date }) {
  return useQuery({
    queryKey: ['availability', roomId, date],
    queryFn: () => getAvailability({ roomId, date }),
    enabled: Boolean(roomId && date),
  })
}
