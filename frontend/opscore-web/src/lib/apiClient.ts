import axios from 'axios'
import { authStore } from '@/store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
      return
    }

    promise.resolve(token!)
  })

  failedQueue = []
}

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const requestUrl: string = originalRequest?.url ?? ''

    if (status !== 401 || requestUrl.includes('/auth/refresh/')) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(apiClient(originalRequest))
          },
          reject,
        })
      })
    }

    const { refreshToken, setTokens, logout } = authStore.getState()

    if (!refreshToken) {
      logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    isRefreshing = true

    try {
      const refreshResponse = await apiClient.post<{ access: string }>('/auth/refresh/', {
        refresh: refreshToken,
      })

      const newAccess = refreshResponse.data.access

      setTokens(newAccess, refreshToken)
      processQueue(null, newAccess)

      originalRequest.headers.Authorization = `Bearer ${newAccess}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      logout()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
