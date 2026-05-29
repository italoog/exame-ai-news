'use client'
import { Bookmark } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useCheckFavorite, useToggleFavorite } from '@/shared/hooks/use-favorites'
import { toast } from '@/shared/ui/toast'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
  articleId: string
  className?: string
}

export function FavoriteButton({ articleId, className = '' }: FavoriteButtonProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  const { data } = useCheckFavorite(articleId)
  const toggle = useToggleFavorite()

  const favorited = data?.favorited ?? false

  async function handleClick() {
    if (!user) {
      router.push('/auth/login')
      return
    }
    try {
      const res = await toggle.mutateAsync(articleId)
      toast(res.favorited ? 'Artigo salvo nos favoritos!' : 'Artigo removido dos favoritos.')
    } catch {
      toast('Erro ao atualizar favoritos.', 'error')
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={toggle.isPending}
      title={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 ${
        favorited
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60'
          : 'border-zinc-200 bg-white text-zinc-500 hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-red-700 dark:hover:text-red-400'
      } ${className}`}
    >
      <Bookmark
        className="h-4 w-4 transition-all"
        fill={favorited ? 'currentColor' : 'none'}
      />
      <span className="text-sm font-medium">{favorited ? 'Salvo' : 'Salvar'}</span>
    </button>
  )
}
