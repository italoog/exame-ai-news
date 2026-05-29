'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export interface Comment {
  id: string
  content: string
  createdAt: string
  author: { id: string; name: string; avatar: string | null }
  _count: { likes: number; replies: number }
  replies?: Comment[]
  likedByUser?: boolean
}

export function useComments(articleId: string) {
  return useQuery<{ data: Comment[] }>({
    queryKey: ['comments', articleId],
    queryFn: () =>
      api.get(`/comments?articleId=${articleId}`).then((r) => r.data),
    enabled: !!articleId,
  })
}

export function useCreateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      articleId: string
      content: string
      parentId?: string
    }) => api.post('/comments', data).then((r) => r.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['comments', vars.articleId] })
    },
  })
}

export function useToggleCommentLike() {
  return useMutation({
    mutationFn: (commentId: string) =>
      api.post(`/comments/${commentId}/like`).then((r) => r.data),
  })
}
