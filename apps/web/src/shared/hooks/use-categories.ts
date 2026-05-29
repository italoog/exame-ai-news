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
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const r = await api.get('/categories')
      const raw = r.data
      const list: Category[] = Array.isArray(raw) ? raw : (raw?.data ?? [])
      return { data: list }
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const r = await api.get(`/categories/${slug}`)
      const raw = r.data
      const category: Category = raw?.data ?? raw
      return { data: category }
    },
  })
}
