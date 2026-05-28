import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import apiClient from '@/lib/apiClient'
import { useAuthStore } from '@/store'
import type { ApiUser } from '@/store/authStore'

export function useMe() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.get<ApiUser>('/auth/me/').then((response) => response.data),
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }
  }, [query.data, setUser])

  return query
}
