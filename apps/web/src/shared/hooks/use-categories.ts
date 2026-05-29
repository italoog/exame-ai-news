'use client'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  _count?: { articles: number }
}

export function useCategories() {
  return useQuery<{ data: Category[] }>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  })
}

export function useCategory(slug: string) {
  return useQuery<{ data: Category }>({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}`).then((r) => r.data),
  })
}
