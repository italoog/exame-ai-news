'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export interface TopArticle {
  id: string
  title: string
  viewCount: number
  category?: { name: string }
}

export interface DashboardStats {
  totalArticles: number
  totalUsers: number
  totalViews: number
  articlesPublishedToday: number
  topArticles: TopArticle[]
}

export interface DashboardResponse {
  data: DashboardStats
}

export type ArticleStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'SCHEDULED'

export interface AdminArticle {
  id: string
  title: string
  slug: string
  status: ArticleStatus
  publishedAt: string | null
  category?: { name: string }
  author?: { name: string }
}

export type UserRole = 'USER' | 'REDATOR' | 'EDITOR' | 'ADMIN'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string | null
  createdAt: string
}

export interface PaginationMeta {
  total: number
  totalPages: number
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () =>
      api.get<DashboardResponse>('/analytics/dashboard').then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminArticles(page = 1, status?: ArticleStatus) {
  return useQuery({
    queryKey: ['admin-articles', page, status],
    queryFn: () =>
      api
        .get<PaginatedResponse<AdminArticle>>('/articles', {
          params: { page, limit: 20, ...(status && { status }) },
        })
        .then((r) => r.data),
  })
}

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: ['admin-users', page],
    queryFn: () =>
      api
        .get<PaginatedResponse<AdminUser>>('/users', {
          params: { page, limit: 20 },
        })
        .then((r) => r.data),
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.patch(`/users/${userId}/role`, { role }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
