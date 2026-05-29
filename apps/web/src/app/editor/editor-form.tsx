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
import { X, Save, Send } from 'lucide-react'

const articleSchema = z.object({
  title: z.string().min(5, 'Título muito curto').max(200, 'Título muito longo'),
  summary: z.string().max(500, 'Resumo muito longo').optional(),
  content: z.string().min(10, 'Conteúdo muito curto'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  coverImage: z.string().url('URL inválida').optional().or(z.literal('')),
  tagInput: z.string().optional(),
})

type ArticleForm = z.infer<typeof articleSchema>

interface Props {
  initialData?: Partial<ArticleForm & { id: string; status: string }>
}

export default function EditorForm({ initialData }: Props) {
  const [tags, setTags] = useState<string[]>([])
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
    <div className="min-h-screen bg-zinc-50">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-zinc-500 hover:text-zinc-900 transition-colors">
            <X className="h-5 w-5" />
          </a>
          <span className="text-sm font-medium text-zinc-700">
            {initialData?.id ? 'Editar artigo' : 'Novo artigo'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50 disabled:opacity-50 transition-colors"
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
          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Capa do artigo" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Cover URL */}
        <div>
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
            Imagem de capa (URL)
          </label>
          <input
            {...register('coverImage')}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]"
          />
          {errors.coverImage && (
            <p className="text-xs text-red-600 mt-1">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <textarea
            {...register('title')}
            placeholder="Título do artigo..."
            rows={2}
            className="w-full text-3xl font-bold border-0 resize-none focus:outline-none bg-transparent placeholder:text-zinc-300 text-zinc-900"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Summary */}
        <div>
          <textarea
            {...register('summary')}
            placeholder="Resumo (opcional)..."
            rows={2}
            className="w-full text-lg text-zinc-500 border-0 resize-none focus:outline-none bg-transparent placeholder:text-zinc-300"
          />
          {errors.summary && <p className="text-xs text-red-600">{errors.summary.message}</p>}
        </div>

        {/* Category + Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
              Categoria *
            </label>
            <select
              {...register('categoryId')}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600] bg-white"
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
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
              Tags
            </label>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Tag (Enter para adicionar)"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E10600]"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded text-xs"
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
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2 block">
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
