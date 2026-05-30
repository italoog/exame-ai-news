'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { useInfiniteArticles } from '@/shared/hooks/use-articles';
import { useCategories } from '@/shared/hooks/use-categories';
import { ArticleCard } from '@/shared/ui/article-card';
import { ArticleCardSkeleton } from '@/shared/ui/skeleton';

export default function FeedClient() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data ?? [];

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteArticles({ status: 'PUBLISHED', category: activeCategory });

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    void refetch();
  }, [activeCategory, refetch]);

  const articles = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Seu Feed</h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          As últimas notícias selecionadas para você
        </p>
      </div>

      {/* Filtros de categoria */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(undefined)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === undefined
              ? 'bg-red-600 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug === activeCategory ? undefined : cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-red-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {articles.length === 0 ? (
            <div className="py-20 text-center text-zinc-400">
              <p className="text-lg">Nenhum artigo encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          <div ref={ref} className="flex justify-center py-10">
            {isFetchingNextPage && <Loader2 className="text-primary-600 h-6 w-6 animate-spin" />}
          </div>
        </>
      )}
    </main>
  );
}
