'use client'
import { Bookmark } from 'lucide-react'
import { useFavorites, useToggleFavorite } from '@/shared/hooks/use-favorites'
import { ArticleCard } from '@/shared/ui/article-card'
import { ArticleCardSkeleton } from '@/shared/ui/skeleton'
import type { Article } from '@/shared/hooks/use-articles'

interface FavoriteItem {
  id: string
  article: Article
}

export default function FavoritesClient() {
  const { data, isLoading } = useFavorites()
  const toggleFavorite = useToggleFavorite()

  const favorites: FavoriteItem[] = data?.data ?? []

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Artigos Salvos</h1>
        <p className="text-zinc-500 mt-1">{favorites.length} artigos salvos</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum artigo salvo ainda</p>
          <a
            href="/"
            className="mt-4 inline-block text-sm text-primary-600 hover:underline"
          >
            Explorar artigos
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative">
              <ArticleCard article={fav.article} />
              <button
                onClick={() => toggleFavorite.mutate(fav.article.id)}
                className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                title="Remover dos salvos"
              >
                <Bookmark className="h-4 w-4 fill-primary-600 text-primary-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
