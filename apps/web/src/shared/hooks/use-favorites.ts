'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/lib/api'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get('/favorites').then((r) => r.data),
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (articleId: string) =>
      api.post('/favorites/toggle', { articleId }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
