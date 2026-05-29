'use client'
import { useState, useTransition, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useArticles } from '@/shared/hooks/use-articles'
import { ArticleCard } from '@/shared/ui/article-card'
import { ArticleCardSkeleton } from '@/shared/ui/skeleton'

export default function SearchClient() {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''
  const initialTag = searchParams.get('tag') ?? ''
  const [query, setQuery] = useState(initialQ)
  const [submitted, setSubmitted] = useState(initialQ)
  const [activeTag, setActiveTag] = useState(initialTag)
  const [, startTransition] = useTransition()

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const tag = searchParams.get('tag') ?? ''
    setQuery(q)
    setSubmitted(q)
    setActiveTag(tag)
  }, [searchParams])

  const { data, isLoading } = useArticles({
    search: submitted || undefined,
    tag: activeTag || undefined,
    status: 'PUBLISHED',
    limit: 12,
  })

  const articles = data?.data ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => setSubmitted(query))
  }

  function handleClear() {
    setQuery('')
    setSubmitted('')
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-zinc-900 mb-6">Buscar artigos</h1>

      <form onSubmit={handleSubmit} className="relative mb-8 max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um termo de busca..."
          className="w-full pl-10 pr-10 py-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {(submitted || activeTag) && (
        <p className="text-sm text-zinc-500 mb-6">
          {isLoading
            ? 'Buscando...'
            : activeTag
              ? `${data?.meta.total ?? 0} artigos com a tag #${activeTag}`
              : `${data?.meta.total ?? 0} resultados para "${submitted}"`}
        </p>
      )}

      {isLoading && submitted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (submitted || activeTag) ? (
        <div className="text-center py-20 text-zinc-400">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum resultado encontrado</p>
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-400">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Digite algo para buscar</p>
        </div>
      )}
    </main>
  )
}
