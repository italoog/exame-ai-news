'use client'
import { useAdminDashboard, type TopArticle } from '@/shared/hooks/use-admin'
import { Newspaper, Users, Eye, TrendingUp, ArrowUpRight } from 'lucide-react'

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  trend?: string
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">{value}</p>
          {trend && (
            <p className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </p>
          )}
        </div>
        <div className="p-2.5 bg-primary-50 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardClient() {
  const { data, isLoading } = useAdminDashboard()
  const stats = data

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Visão geral da plataforma</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total de Artigos"
            value={stats?.totalArticles ?? 0}
            icon={Newspaper}
          />
          <StatCard
            label="Usuários"
            value={stats?.totalUsers ?? 0}
            icon={Users}
          />
          <StatCard
            label="Visualizações"
            value={stats?.totalViews?.toLocaleString('pt-BR') ?? 0}
            icon={Eye}
          />
          <StatCard
            label="Artigos Hoje"
            value={stats?.articlesPublishedToday ?? 0}
            icon={TrendingUp}
            trend="+hoje"
          />
        </div>
      )}

      {stats?.topArticles && stats.topArticles.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-zinc-900 mb-4">
            Artigos Mais Lidos
          </h2>
          <div className="space-y-3">
            {stats.topArticles.map((article: TopArticle, i: number) => (
              <div key={article.id} className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-zinc-400">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {article.title}
                  </p>
                  <p className="text-xs text-zinc-500">{article.category?.name}</p>
                </div>
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Eye className="h-3 w-3" />
                  {article.viewCount?.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
