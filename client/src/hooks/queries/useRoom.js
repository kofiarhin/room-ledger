import { useQuery } from '@tanstack/react-query'
import { getRoom } from '../../services/roomService.js'

export function useRoom(roomIdOrSlug) {
  return useQuery({
    queryKey: ['room', roomIdOrSlug],
    queryFn: () => getRoom(roomIdOrSlug),
    enabled: Boolean(roomIdOrSlug),
  })
}
