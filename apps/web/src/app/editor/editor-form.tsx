'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RichTextEditor } from '@/shared/ui/rich-text-editor'
import { useCategories } from '@/shared/hooks/use-categories'
import {
  useCreateArticle,
  useUpdateArticle,
  usePublishArticle,
} from '@/shared/hooks/use-article-mutations'
import { useState } from 'react'
import { X, Save, Send, ImageIcon } from 'lucide-react'

const articleSchema = z.object({
  title: z.string().min(5, 'TÃ­tulo muito curto').max(200, 'TÃ­tulo muito longo'),
  summary: z.string().max(500, 'Resumo muito longo').optional(),
  content: z.string().min(10, 'ConteÃºdo muito curto'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  coverImage: z.string().url('URL invÃ¡lida').optional().or(z.literal('')),
  tagInput: z.string().optional(),
})

type ArticleForm = z.infer<typeof articleSchema>

interface Props {
  initialData?: Partial<ArticleForm & { id: string; status: string; tags?: string[] }>
}

export default function EditorForm({ initialData }: Props) {
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const { data: categoriesData } = useCategories()
  const createArticle = useCreateArticle()
  const updateArticle = useUpdateArticle(initialData?.id ?? '')
  const publishArticle = usePublishArticle()

  const categories = categoriesData?.data ?? []

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      summary: initialData?.summary ?? '',
      content: initialData?.content ?? '',
      categoryId: initialData?.categoryId ?? '',
      coverImage: initialData?.coverImage ?? '',
    },
  })

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (t && !tags.includes(t)) setTags([...tags, t])
      setTagInput('')
    }
  }

  function suggestImage() {
    const categoryId = watch('categoryId')
    const title = watch('title')
    const cat = categories.find((c) => c.id === categoryId)
    const seed = cat?.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) ?? 'news'
    setValue('coverImage', `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`, {
      shouldValidate: true,
    })
  }

  async function onSaveDraft(data: ArticleForm) {
    if (initialData?.id) {
      await updateArticle.mutateAsync({ ...data, tags, status: 'DRAFT' })
    } else {
      await createArticle.mutateAsync({ ...data, tags, status: 'DRAFT' })
    }
  }

  async function onPublish(data: ArticleForm) {
    if (initialData?.id) {
      await updateArticle.mutateAsync({ ...data, tags })
      await publishArticle.mutateAsync(initialData.id)
    } else {
      await createArticle.mutateAsync({ ...data, tags, status: 'PUBLISHED' })
    }
  }

  const coverImage = watch('coverImage')

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/editor" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </a>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {initialData?.id ? 'Editar artigo' : 'Novo artigo'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            Salvar rascunho
          </button>
          <button
            type="button"
            onClick={handleSubmit(onPublish)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#E10600] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            Publicar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Cover preview */}
        {coverImage && (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Capa do artigo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Cover URL */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1 block">
            Imagem de capa
          </label>
          <div className="flex gap-2">
            <input
              {...register('coverImage')}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600] placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={suggestImage}
              title="Sugerir imagem gratuita baseada na categoria"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors whitespace-nowrap"
            >
              <ImageIcon className="h-4 w-4" />
              Sugerir imagem
            </button>
          </div>
          {errors.coverImage && (
            <p className="text-xs text-red-600 mt-1">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <textarea
            {...register('title')}
            placeholder="TÃ­tulo do artigo..."
            rows={2}
            className="w-full text-3xl font-bold border-0 resize-none focus:outline-none bg-transparent placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-zinc-900 dark:text-zinc-50"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Summary */}
        <div>
          <textarea
            {...register('summary')}
            placeholder="Resumo (opcional)..."
            rows={2}
            className="w-full text-lg text-zinc-500 dark:text-zinc-400 border-0 resize-none focus:outline-none bg-transparent placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
          />
          {errors.summary && <p className="text-xs text-red-600">{errors.summary.message}</p>}
        </div>

        {/* Category + Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1 block">
              Categoria *
            </label>
            <select
              {...register('categoryId')}
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
            >
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-600 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1 block">
              Tags
            </label>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Tag (Enter para adicionar)"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1 block">
            Conteúdo *
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <p className="text-xs text-red-600 mt-1">{errors.content.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
