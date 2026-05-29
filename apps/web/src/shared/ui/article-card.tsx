import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    summary?: string | null
    coverImage?: string | null
    publishedAt?: string | Date | null
    readTime?: number | null
    viewCount?: number
    author: { name: string; avatar?: string | null }
    category: { name: string; slug: string; color?: string | null }
  }
  variant?: 'default' | 'horizontal' | 'featured'
  className?: string
}

export function ArticleCard({ article, variant = 'default', className }: ArticleCardProps) {
  const publishedDate = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { locale: ptBR, addSuffix: true })
    : null

  if (variant === 'horizontal') {
    return (
      <Link href={`/articles/${article.slug}`} className={cn('group flex gap-4 items-start', className)}>
        {article.coverImage && (
          <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            {article.category.name}
          </span>
          <h3 className="mt-1 text-sm font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-400">{publishedDate}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/articles/${article.slug}`} className={cn('group relative block rounded-xl overflow-hidden', className)}>
        <div className="relative h-[480px] bg-zinc-100">
          {article.coverImage ? (
            <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded uppercase tracking-wide mb-3">
            {article.category.name}
          </span>
          <h2 className="text-2xl font-black text-white leading-tight tracking-tight line-clamp-3">
            {article.title}
          </h2>
          {article.summary && (
            <p className="mt-2 text-sm text-white/70 line-clamp-2">{article.summary}</p>
          )}
          <div className="mt-4 flex items-center gap-3 text-white/60 text-xs">
            <span>{article.author.name}</span>
            <span>·</span>
            <span>{publishedDate}</span>
            {article.readTime && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime} min
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/articles/${article.slug}`} className={cn('group flex flex-col', className)}>
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-zinc-100">
        {article.coverImage ? (
          <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
            <span className="text-zinc-300 text-4xl font-black">{article.category.name[0]}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex-1 flex flex-col">
        <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
          {article.category.name}
        </span>
        <h3 className="mt-2 text-base font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {article.title}
        </h3>
        {article.summary && (
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed line-clamp-2">{article.summary}</p>
        )}
        <div className="mt-3 flex items-center gap-3 text-zinc-400 text-xs">
          <span>{article.author.name}</span>
          <span>·</span>
          <span>{publishedDate}</span>
          {article.readTime && (
            <span className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
