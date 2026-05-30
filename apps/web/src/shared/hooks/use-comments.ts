'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export interface Comment {
  id: string
  content: string
  likeCount: number
  createdAt: string
  user: { id: string; name: string; avatar: string | null }
  replies: Comment[]
  _count: { likes: number }
}

export function useComments(articleId: string) {
  return useQuery<Comment[]>({
    queryKey: ['comments', articleId],
    queryFn: () =>
      api.get(`/articles/${articleId}/comments`).then((r) => {
        const d = r.data
        return (d.data ?? d) as Comment[]
      }),
    enabled: !!articleId,
  })
}

export function useCreateComment(articleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { content: string; parentId?: string }) =>
      api.post(`/articles/${articleId}/comments`, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', articleId] }),
  })
}

export function useDeleteComment(articleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (commentId: string) => api.delete(`/comments/${commentId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', articleId] }),
  })
}

export function useLikeComment(articleId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (commentId: string) =>
      api.post(`/comments/${commentId}/like`).then((r) => r.data as { liked: boolean }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', articleId] }),
  })
}
