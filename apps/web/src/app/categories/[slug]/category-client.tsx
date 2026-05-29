'use client'
import { useState } from 'react'
import { useArticles } from '@/shared/hooks/use-articles'
import { useCategory } from '@/shared/hooks/use-categories'
import { ArticleCard } from '@/shared/ui/article-card'
import { ArticleCardSkeleton } from '@/shared/ui/skeleton'

export default function CategoryClient({ slug }: { slug: string }) {
  const [page, setPage] = useState(1)
  const { data: categoryData } = useCategory(slug)
  const { data, isLoading } = useArticles({
    category: slug,
    page,
    status: 'PUBLISHED',
    limit: 12,
  })

  const category = categoryData?.data
  const articles = data?.data ?? []
  const meta = data?.meta

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
          Categoria
        </span>
        <h1 className="text-3xl font-bold text-zinc-900 mt-1">
          {category?.name ?? slug}
        </h1>
        {category?.description && (
          <p className="text-zinc-500 mt-2">{category.description}</p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded border border-zinc-200 text-sm disabled:opacity-40 hover:border-primary-600 transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-zinc-500">
                {page} / {meta.totalPages}
              </span>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded border border-zinc-200 text-sm disabled:opacity-40 hover:border-primary-600 transition-colors"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
