import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Eye, Tag, ChevronRight, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CategoryBadge } from '@/shared/ui/category-badge'

interface ArticlePageProps {
  params: { slug: string }
}

interface Article {
  id: string
  title: string
  slug: string
  content: string
  summary: string | null
  aiSummary: string | null
  coverImage: string | null
  publishedAt: string | null
  readTime: number | null
  viewCount: number | null
  author: { id: string; name: string; avatar: string | null }
  category: { id: string; name: string; slug: string; color: string | null }
  tags: Array<{ tag: { id: string; name: string; slug: string } }>
}

async function getArticle(slug: string): Promise<Article | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
  try {
    const res = await fetch(`${apiUrl}/api/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json() as { data: Article }
    return json.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Artigo não encontrado' }

  return {
    title: article.title,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-1 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/categories/${article.category.slug}`} className="hover:text-zinc-600">
            {article.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-600 truncate max-w-40">{article.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <CategoryBadge name={article.category.name} slug={article.category.slug} />
        <h1 className="mt-4 text-3xl md:text-4xl font-black text-zinc-900 leading-tight tracking-tight">
          {article.title}
        </h1>
        {article.summary && (
          <p className="mt-4 text-lg text-zinc-500 leading-relaxed">{article.summary}</p>
        )}

        {/* Meta */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-600">{article.author.name[0]}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{article.author.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min de leitura
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount?.toLocaleString('pt-BR')} visualizações
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* AI Summary */}
      {article.aiSummary && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Resumo IA</span>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed">{article.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <div
          className="prose prose-zinc prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-p:leading-7 prose-p:text-zinc-700
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-zinc-400" />
              {article.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${tag.slug}`}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-medium rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
