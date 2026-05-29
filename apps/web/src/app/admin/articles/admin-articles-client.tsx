'use client'
import { useState } from 'react'
import { useAdminArticles, type AdminArticle, type ArticleStatus } from '@/shared/hooks/use-admin'
import { usePublishArticle } from '@/shared/hooks/use-article-mutations'
import Link from 'next/link'
import { Edit2, Eye, CheckCircle2, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_STYLE: Record<ArticleStatus, { label: string; className: string }> = {
  PUBLISHED: { label: 'Publicado', className: 'text-green-600 bg-green-50' },
  DRAFT: { label: 'Rascunho', className: 'text-yellow-600 bg-yellow-50' },
  ARCHIVED: { label: 'Arquivado', className: 'text-zinc-500 bg-zinc-100' },
  SCHEDULED: { label: 'Agendado', className: 'text-blue-600 bg-blue-50' },
}

export default function AdminArticlesClient() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminArticles(page)
  const publishArticle = usePublishArticle()

  const articles = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Artigos</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {meta?.total ?? 0} artigos no total
          </p>
        </div>
        <Link
          href="/editor/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo artigo
        </Link>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Título
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">
                Categoria
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
                Autor
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden xl:table-cell">
                Data
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100">
                    <td className="px-4 py-3" colSpan={6}>
                      <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : articles.map((article: AdminArticle) => {
                  const s = STATUS_STYLE[article.status] ?? STATUS_STYLE.DRAFT
                  return (
                    <tr
                      key={article.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-900 line-clamp-1 max-w-xs">
                          {article.title}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-zinc-600">{article.category?.name}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-zinc-600">{article.author?.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-zinc-500 text-xs">
                        {article.publishedAt
                          ? formatDistanceToNow(new Date(article.publishedAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/articles/${article.slug}`}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/editor/${article.id}`}
                            className="p-1.5 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          {article.status === 'DRAFT' && (
                            <button
                              onClick={() => publishArticle.mutate(article.id)}
                              className="p-1.5 text-zinc-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Publicar"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
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
    </div>
  )
}
