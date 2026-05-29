'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export interface CreateArticleData {
  title: string
  content: string
  summary?: string
  categoryId: string
  coverImage?: string
  tags?: string[]
  status?: 'DRAFT' | 'PUBLISHED'
}

export function useCreateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateArticleData) =>
      api.post('/articles', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      qc.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

export function useUpdateArticle(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateArticleData>) =>
      api.patch(`/articles/${id}`, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      qc.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

export function usePublishArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/articles/${id}/publish`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      qc.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

export function useUnpublishArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/articles/${id}/unpublish`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      qc.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}

export function useArchiveArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/articles/${id}/archive`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['articles'] })
      qc.invalidateQueries({ queryKey: ['admin-articles'] })
    },
  })
}
