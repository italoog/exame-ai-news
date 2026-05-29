'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/shared/lib/api'
import EditorForm from '../editor-form'
import { useAuthStore } from '@/shared/stores/auth.store'

interface ArticleEditData {
  id: string
  title: string
  summary: string
  content: string
  categoryId: string
  coverImage: string
  status: string
  tags: string[]
}

export default function EditArticlePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [initialData, setInitialData] = useState<ArticleEditData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.replace('/auth/login')
      return
    }
    if (user.role !== 'EDITOR' && user.role !== 'ADMIN') {
      router.replace('/')
      return
    }

    api
      .get<{ data: { id: string; title: string; summary: string | null; content: string; coverImage: string | null; status: string; category: { id: string }; tags: { tag: { name: string } }[] } }>(`/articles/edit/${params.id}`)
      .then((res) => {
        const a = res.data.data
        setInitialData({
          id: a.id,
          title: a.title,
          summary: a.summary ?? '',
          content: a.content ?? '',
          categoryId: a.category.id,
          coverImage: a.coverImage ?? '',
          status: a.status,
          tags: a.tags?.map((t) => t.tag.name) ?? [],
        })
      })
      .catch(() => setError('Artigo não encontrado ou sem permissão de edição.'))
      .finally(() => setLoading(false))
  }, [params.id, user, router])

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 gap-4">
        <p className="text-red-600 font-medium">{error ?? 'Artigo não encontrado'}</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 underline"
        >
          Voltar
        </button>
      </div>
    )
  }

  return <EditorForm initialData={initialData} />
}
