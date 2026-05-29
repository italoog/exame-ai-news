import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleCard } from '@/shared/ui/article-card'
import { TrendingUp, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EXAME AI NEWS — Notícias de Negócios e Tecnologia',
  description: 'As principais notícias do mundo dos negócios, tecnologia e mercados com análise de inteligência artificial.',
}

const MOCK_FEATURED = {
  id: '1',
  title: 'Inteligência Artificial Transforma o Jornalismo: O Futuro das Redações Digitais',
  slug: 'ia-transforma-jornalismo-digital',
  summary: 'Como as grandes redações do mundo estão adotando IA para acelerar a produção de conteúdo e personalizar a experiência do leitor.',
  coverImage: null,
  publishedAt: new Date().toISOString(),
  readTime: 7,
  viewCount: 12847,
  author: { name: 'Ana Beatriz Costa', avatar: null },
  category: { name: 'Tecnologia', slug: 'tecnologia', color: '#3B82F6' },
}

const MOCK_ARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 2),
  title: [
    'Ibovespa Atinge Nova Máxima Histórica com Fluxo Estrangeiro',
    'Startups Brasileiras Captam R$ 4 Bilhões no Primeiro Trimestre',
    'Reforma Tributária: Impactos para Empresas e Investidores',
    'Fintechs Desafiam Bancos Tradicionais no Crédito Consignado',
    'ESG Deixa de ser Diferencial e Vira Requisito de Mercado',
    'Venture Capital Global Mantém Cautela no Brasil',
  ][i],
  slug: `artigo-${i + 2}`,
  summary: 'Análise aprofundada com dados exclusivos e perspectivas de especialistas do mercado financeiro.',
  coverImage: null,
  publishedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
  readTime: (i % 6) + 3,
  viewCount: (i + 1) * 800,
  author: { name: i % 2 === 0 ? 'Ana Beatriz Costa' : 'Carlos Mendes', avatar: null },
  category: {
    name: ['Mercados', 'Startups', 'Política', 'Negócios', 'ESG', 'Internacional'][i],
    slug: ['mercados', 'startups', 'politica', 'negocios', 'esg', 'internacional'][i],
    color: null,
  },
}))

const TRENDING = MOCK_ARTICLES.slice(0, 5)

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia' },
  { name: 'Economia', slug: 'economia' },
  { name: 'Mercados', slug: 'mercados' },
  { name: 'Startups', slug: 'startups' },
  { name: 'Negócios', slug: 'negocios' },
  { name: 'ESG', slug: 'esg' },
  { name: 'Internacional', slug: 'internacional' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Category Bar */}
      <div className="border-b border-zinc-100 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex items-center gap-1 py-2 whitespace-nowrap">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
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
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <ArticleCard article={MOCK_FEATURED} variant="featured" />
          </div>

          {/* Trending Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-50 rounded-xl p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wide">Mais Lidos</h2>
              </div>
              <div className="space-y-5">
                {TRENDING.map((article, i) => (
                  <div key={article.id} className="flex items-start gap-3">
                    <span className="text-2xl font-black text-zinc-200 leading-none w-6 flex-shrink-0">
                      {i + 1}
                    </span>
                    <ArticleCard article={article} variant="horizontal" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles Grid */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-600" />
              <h2 className="text-lg font-bold text-zinc-900">Últimas Notícias</h2>
            </div>
            <Link href="/articles" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_ARTICLES.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 bg-zinc-950 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            Fique à frente do mercado
          </h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Receba as principais análises com resumos gerados por IA direto no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg text-sm focus:outline-none focus:border-red-500"
            />
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors whitespace-nowrap">
              Assinar grátis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
