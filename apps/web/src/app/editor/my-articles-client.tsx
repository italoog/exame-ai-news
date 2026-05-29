'use client'
import { useArticles } from '@/shared/hooks/use-articles'
import { useAuthStore } from '@/shared/stores/auth.store'
import Link from 'next/link'
import { Plus, Edit2, Eye, Clock, CheckCircle2, Archive } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_MAP = {
  DRAFT: { label: 'Rascunho', icon: Clock, className: 'text-yellow-600 bg-yellow-50' },
  PUBLISHED: { label: 'Publicado', icon: CheckCircle2, className: 'text-green-600 bg-green-50' },
  ARCHIVED: { label: 'Arquivado', icon: Archive, className: 'text-zinc-500 bg-zinc-100' },
  SCHEDULED: { label: 'Agendado', icon: Clock, className: 'text-blue-600 bg-blue-50' },
} as const

type StatusKey = keyof typeof STATUS_MAP

export default function MyArticlesClient() {
  const { user } = useAuthStore()
  const { data, isLoading } = useArticles({ limit: 50 })

  if (!user || (user.role !== 'EDITOR' && user.role !== 'ADMIN' && user.role !== 'REDATOR')) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">Acesso restrito a redatores e editores.</p>
      </div>
    )
  }

  const articles = data?.data ?? []

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Meus Artigos</h1>
          <p className="text-zinc-500 mt-1">{articles.length} artigos</p>
        </div>
        <Link
          href="/editor/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E10600] text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo artigo
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <Edit2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum artigo ainda</p>
          <Link
            href="/editor/new"
            className="mt-4 inline-block text-sm text-[#E10600] hover:underline"
          >
            Criar primeiro artigo
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => {
            const statusKey = (article.status as StatusKey) in STATUS_MAP
              ? (article.status as StatusKey)
              : 'DRAFT'
            const status = STATUS_MAP[statusKey]
            const StatusIcon = status.icon
            return (
              <div
                key={article.id}
                className="flex items-center gap-4 p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 truncate">{article.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {article.category.name} &middot;{' '}
                    {formatDistanceToNow(
                      new Date(article.publishedAt ?? article.createdAt ?? Date.now()),
                      { addSuffix: true, locale: ptBR },
                    )}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/editor/${article.id}`}
                    className="p-1.5 text-zinc-400 hover:text-[#E10600] hover:bg-red-50 rounded transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
