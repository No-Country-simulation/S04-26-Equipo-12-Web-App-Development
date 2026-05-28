import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/apiClient'
import { useAuthStore } from '@/store'
import type { ApiUser } from '@/store/authStore'
import { mapApiUserToRowData } from '@/features/users/adapters'

export function useUsers() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['users'],
    queryFn: () =>
      apiClient.get<ApiUser[]>('/users/').then((response) => response.data.map(mapApiUserToRowData)),
    enabled: isAuthenticated,
  })
}
