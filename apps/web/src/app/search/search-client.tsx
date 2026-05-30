'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useArticles } from '@/shared/hooks/use-articles';
import { ArticleCard } from '@/shared/ui/article-card';
import { ArticleCardSkeleton } from '@/shared/ui/skeleton';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const initialTag = searchParams.get('tag') ?? '';
  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [activeTag, setActiveTag] = useState(initialTag);

  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const tag = searchParams.get('tag') ?? '';
    setQuery(q);
    setDebouncedQuery(q);
    setActiveTag(tag);
  }, [searchParams]);

  // Debounce: só dispara a busca 400ms após parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading } = useArticles({
    search: debouncedQuery || undefined,
    tag: activeTag || undefined,
    status: 'PUBLISHED',
    limit: 12,
  });

  const articles = data?.data ?? [];

  function handleClear() {
    setQuery('');
    setDebouncedQuery('');
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Buscar artigos</h1>

      <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um termo de busca..."
          autoFocus
          className="focus:ring-primary-600 w-full rounded-lg border border-zinc-200 bg-white py-3 pl-10 pr-10 text-sm text-zinc-900 focus:border-transparent focus:outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {(debouncedQuery || activeTag) && (
        <p className="mb-6 text-sm text-zinc-500">
          {isLoading
            ? 'Buscando...'
            : activeTag
              ? `${data?.meta.total ?? 0} artigos com a tag #${activeTag}`
              : `${data?.meta.total ?? 0} resultados para "${debouncedQuery}"`}
        </p>
      )}

      {isLoading && debouncedQuery ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : debouncedQuery || activeTag ? (
        <div className="py-20 text-center text-zinc-400">
          <Search className="mx-auto mb-4 h-12 w-12 opacity-30" />
          <p className="text-lg">Nenhum resultado encontrado</p>
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-400">
          <Search className="mx-auto mb-4 h-12 w-12 opacity-30" />
          <p className="text-lg">Digite algo para buscar</p>
        </div>
      )}
    </main>
  );
}
