'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get('/favorites').then((r) => r.data),
  })
}

export function useCheckFavorite(articleId: string) {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['favorites', 'check', articleId],
    queryFn: () =>
      api.get(`/favorites/${articleId}/check`).then((r) => r.data as { favorited: boolean }),
    enabled: !!articleId && !!user,
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (articleId: string) =>
      api.post(`/favorites/${articleId}`).then((r) => r.data as { favorited: boolean }),
    onSuccess: (data, articleId) => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
      qc.setQueryData(['favorites', 'check', articleId], { favorited: data.favorited })
    },
  })
}
