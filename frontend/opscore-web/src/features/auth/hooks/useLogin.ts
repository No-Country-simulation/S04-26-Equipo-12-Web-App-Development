import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import apiClient from '@/lib/apiClient'
import { useAuthStore } from '@/store'
import type { ApiUser } from '@/store/authStore'

export interface LoginResponse {
  access: string
  refresh: string
  user: ApiUser
}

interface LoginCredentials {
  email: string
  password: string
}

export function useLogin() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient.post<LoginResponse>('/auth/login/', credentials).then((response) => response.data),
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      setUser(data.user)
      navigate('/dashboard')
    },
  })
}
