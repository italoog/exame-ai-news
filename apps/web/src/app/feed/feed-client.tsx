'use client'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Loader2 } from 'lucide-react'
import { useInfiniteArticles } from '@/shared/hooks/use-articles'
import { ArticleCard } from '@/shared/ui/article-card'
import { ArticleCardSkeleton } from '@/shared/ui/skeleton'

export default function FeedClient() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteArticles({ status: 'PUBLISHED' })

  const { ref, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage()
  }, [inView, hasNextPage, fetchNextPage])

  const articles = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Seu Feed</h1>
        <p className="text-zinc-500 mt-1">
          As últimas notícias selecionadas para você
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div ref={ref} className="flex justify-center py-10">
            {isFetchingNextPage && (
              <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            )}
          </div>
        </>
      )}
    </main>
  )
}
