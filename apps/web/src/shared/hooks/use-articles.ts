'use client'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export interface Article {
  id: string
  title: string
  slug: string
  summary: string | null
  aiSummary: string | null
  coverImage: string | null
  status: string
  featured: boolean
  publishedAt: string | null
  createdAt?: string | null
  readTime: number | null
  viewCount: number
  author: { id: string; name: string; avatar: string | null }
  category: { id: string; name: string; slug: string }
  tags: { tag: { id: string; name: string } }[]
  _count?: { comments: number; favorites: number }
}

export interface ArticlesResponse {
  data: Article[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export interface ArticleFilters {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
  status?: string
}

export function useArticles(filters: ArticleFilters = {}) {
  return useQuery<ArticlesResponse>({
    queryKey: ['articles', filters],
    queryFn: () =>
      api.get('/articles', { params: filters }).then((r) => r.data),
  })
}

export function useInfiniteArticles(filters: Omit<ArticleFilters, 'page'> = {}) {
  return useInfiniteQuery<ArticlesResponse>({
    queryKey: ['articles-infinite', filters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      api
        .get('/articles', { params: { ...filters, page: pageParam, limit: 12 } })
        .then((r) => r.data),
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  })
}

export function useArticle(slug: string) {
  return useQuery<{ data: Article }>({
    queryKey: ['article', slug],
    queryFn: () => api.get(`/articles/${slug}`).then((r) => r.data),
  })
}

export function useTrendingArticles() {
  return useQuery<{ data: Article[] }>({
    queryKey: ['articles-trending'],
    queryFn: () => api.get('/articles/trending').then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useFeaturedArticles() {
  return useQuery<{ data: Article[] }>({
    queryKey: ['articles-featured'],
    queryFn: () => api.get('/articles/featured').then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  })
}
