'use client'
import { useAdminTopArticles, type TopArticleDetail } from '@/shared/hooks/use-admin'
import { Eye, MessageSquare, Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-zinc-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function AnalyticsClient() {
  const { data: articles, isLoading } = useAdminTopArticles(10)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-1">Top 10 artigos por visualizações</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-8">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Artigo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categoria</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1"><Eye className="h-3 w-3" /> Views</span>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1"><MessageSquare className="h-3 w-3" /> Comentários</span>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center justify-end gap-1"><Heart className="h-3 w-3" /> Favoritos</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Publicado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                : articles && articles.length > 0
                ? articles.map((article: TopArticleDetail, i: number) => (
                    <tr key={article.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 font-bold">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <p className="font-medium text-zinc-900 line-clamp-2 max-w-xs">{article.title}</p>
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="shrink-0 text-zinc-400 hover:text-red-600 transition-colors mt-0.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {article.category ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                            {article.category.name}
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-900">
                        {article.viewCount.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600">
                        {article._count.comments.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600">
                        {article._count.favorites.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                        {article.publishedAt
                          ? formatDistanceToNow(new Date(article.publishedAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))
                : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                      Nenhum artigo publicado ainda.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
