import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import apiClient from '@/lib/apiClient'
import { useAuthStore } from '@/store'

export function useLogout() {
  const navigate = useNavigate()
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout/', { refresh: refreshToken }),
    onSettled: () => {
      logout()
      navigate('/login')
    },
  })
}
