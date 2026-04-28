import { useQuery } from '@tanstack/react-query'
import { getRooms } from '../../services/roomService.js'

export function useRooms() {
  return useQuery({ queryKey: ['rooms'], queryFn: getRooms })
}
