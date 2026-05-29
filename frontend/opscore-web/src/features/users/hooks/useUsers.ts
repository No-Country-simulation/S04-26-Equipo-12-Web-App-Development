import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/apiClient'
import { useAuthStore } from '@/store'
import type { ApiUser } from '@/store/authStore'
import { mapApiUserToRowData } from '@/features/users/adapters'

interface UserResponse {
  count: Number
  current_page:Number
  next: String | null
  previous:String | null
  results: ApiUser[]
  success: Boolean
  total_pages: Number
}
export function useUsers() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['users'],
    queryFn: () =>
      apiClient.get<UserResponse>('/users/').then(
        (response) => {
          console.log(response.data);
          return response.data.results.map(mapApiUserToRowData)
        }
      ),
    enabled: isAuthenticated,
  })
}
