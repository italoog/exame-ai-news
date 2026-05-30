import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/shared/ui/article-card';
import { NewsCarousel } from '@/shared/ui/news-carousel';
import { TrendingUp, Zap } from 'lucide-react';
import NewsletterForm from './newsletter-form';
import { CATEGORIES } from '@/shared/lib/categories';

export const metadata: Metadata = {
  title: 'EXAME AI NEWS — Notícias de Negócios e Tecnologia',
  description:
    'As principais notícias do mundo dos negócios, tecnologia e mercados com análise de inteligência artificial.',
};

type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  aiSummary: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readTime: number | null;
  viewCount: number;
  author: { id: string; name: string; avatar: string | null };
  category: { id: string; name: string; slug: string; color: string | null };
};

const API =
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function fetchLatest(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/articles?limit=6`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: Article[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function fetchTrending(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = (await res.json()) as Article[] | { data: Article[] };
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [latest, trending] = await Promise.all([fetchLatest(), fetchTrending()]);

  const displayLatest = latest.length > 0 ? latest : [];
  const displayTrending = trending.length > 0 ? trending.slice(0, 5) : [];
  const carouselArticles = latest.slice(0, 3);

  return (
    <div className="min-h-screen bg-white transition-colors dark:bg-zinc-950">
      {/* Category Bar */}
      <div className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="scrollbar-none mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 whitespace-nowrap py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-white hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-red-400"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Main Grid: Featured + Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Featured Carousel */}
          <div className="h-full lg:col-span-2">
            {carouselArticles.length > 0 ? (
              <NewsCarousel articles={carouselArticles} />
            ) : (
              <div className="flex h-[480px] items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <p className="text-sm text-zinc-400 dark:text-zinc-600">
                  Nenhum destaque disponível
                </p>
              </div>
            )}
          </div>

          {/* Trending Sidebar */}
          <div className="lg:col-span-1">
            <div className="h-full rounded-xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
                  Mais Lidos
                </h2>
              </div>
              {displayTrending.length > 0 ? (
                <div className="space-y-5">
                  {displayTrending.map((article, i) => (
                    <div key={article.id} className="flex items-start gap-3">
                      <span className="w-6 flex-shrink-0 text-2xl font-black leading-none text-zinc-200 dark:text-zinc-700">
                        {i + 1}
                      </span>
                      <ArticleCard article={article} variant="horizontal" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400 dark:text-zinc-600">Sem dados disponíveis</p>
              )}
            </div>
          </div>
        </div>

        {/* Latest Articles Grid */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-red-600" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Últimas Notícias
              </h2>
            </div>
            <Link
              href="/feed"
              className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
            >
              Ver todas →
            </Link>
          </div>
          {displayLatest.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayLatest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-zinc-400 dark:text-zinc-600">
              <p className="text-sm">Nenhum artigo publicado ainda.</p>
              <Link
                href="/editor/new"
                className="mt-3 inline-block text-sm text-red-600 hover:underline"
              >
                Criar o primeiro artigo →
              </Link>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 rounded-2xl border bg-zinc-950 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900 md:p-12">
          <h2 className="mb-3 text-2xl font-black tracking-tight text-white md:text-3xl">
            Fique à frente do mercado
          </h2>
          <p className="mx-auto mb-6 max-w-md text-zinc-400">
            Receba as principais análises com resumos gerados por IA direto no seu e-mail.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
