import axios from 'axios'
import { useAuthStore } from '@/shared/stores/auth.store'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/')
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      try {
        const refreshToken = typeof window !== 'undefined'
          ? localStorage.getItem('refresh_token')
          : null
        if (!refreshToken) throw new Error('no refresh token')

        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'
        const { data } = await axios.post(`${apiBase}/auth/refresh`, { refreshToken })
        const newAccessToken = data.accessToken ?? data.data?.accessToken
        const newRefreshToken = data.refreshToken ?? data.data?.refreshToken

        localStorage.setItem('access_token', newAccessToken)
        if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken)
        useAuthStore.getState().setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        useAuthStore.getState().clearAuth()
        if (typeof window !== 'undefined') window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  },
)
