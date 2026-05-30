import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleCard } from '@/shared/ui/article-card'
import { NewsCarousel } from '@/shared/ui/news-carousel'
import { TrendingUp, Zap } from 'lucide-react'
import NewsletterForm from './newsletter-form'

export const metadata: Metadata = {
  title: 'EXAME AI NEWS — Notícias de Negócios e Tecnologia',
  description: 'As principais notícias do mundo dos negócios, tecnologia e mercados com análise de inteligência artificial.',
}

type Article = {
  id: string
  title: string
  slug: string
  summary: string | null
  coverImage: string | null
  publishedAt: string | null
  readTime: number | null
  viewCount: number
  author: { id: string; name: string; avatar: string | null }
  category: { id: string; name: string; slug: string; color: string | null }
}

const API = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'

async function fetchLatest(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/articles?limit=6`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const json = await res.json() as { data: Article[] }
    return json.data ?? []
  } catch { return [] }
}

async function fetchTrending(): Promise<Article[]> {
  try {
    const res = await fetch(`${API}/articles/trending`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const json = await res.json() as Article[] | { data: Article[] }
    return Array.isArray(json) ? json : (json.data ?? [])
  } catch { return [] }
}

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia' },
  { name: 'Economia', slug: 'economia' },
  { name: 'Mercados', slug: 'mercados' },
  { name: 'Startups', slug: 'startups' },
  { name: 'Negócios', slug: 'negocios' },
  { name: 'Internacional', slug: 'internacional' },
]

export default async function HomePage() {
  const [latest, trending] = await Promise.all([
    fetchLatest(),
    fetchTrending(),
  ])

  const displayLatest = latest.length > 0 ? latest : []
  const displayTrending = trending.length > 0 ? trending.slice(0, 5) : []
  const carouselArticles = latest.slice(0, 3)

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      {/* Category Bar */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 py-2 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Grid: Featured + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Carousel */}
          <div className="lg:col-span-2 h-full">
            {carouselArticles.length > 0 ? (
              <NewsCarousel articles={carouselArticles} />
            ) : (
              <div className="h-[480px] rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <p className="text-zinc-400 dark:text-zinc-600 text-sm">Nenhum destaque disponível</p>
              </div>
            )}
          </div>

          {/* Trending Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-6 h-full border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">Mais Lidos</h2>
              </div>
              {displayTrending.length > 0 ? (
                <div className="space-y-5">
                  {displayTrending.map((article, i) => (
                    <div key={article.id} className="flex items-start gap-3">
                      <span className="text-2xl font-black text-zinc-200 dark:text-zinc-700 leading-none w-6 flex-shrink-0">
                        {i + 1}
                      </span>
                      <ArticleCard article={article} variant="horizontal" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 dark:text-zinc-600 text-sm">Sem dados disponíveis</p>
              )}
            </div>
          </div>
        </div>

        {/* Latest Articles Grid */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Últimas Notícias</h2>
            </div>
            <Link href="/feed" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
              Ver todas →
            </Link>
          </div>
          {displayLatest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayLatest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
              <p className="text-sm">Nenhum artigo publicado ainda.</p>
              <Link href="/editor/new" className="mt-3 inline-block text-red-600 text-sm hover:underline">
                Criar o primeiro artigo →
              </Link>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-zinc-950 dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            Fique à frente do mercado
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Receba as principais análises com resumos gerados por IA direto no seu e-mail.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  )
}

