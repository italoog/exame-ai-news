'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/shared/ui/rich-text-editor';
import { useCategories } from '@/shared/hooks/use-categories';
import {
  useCreateArticle,
  useUpdateArticle,
  usePublishArticle,
  useUnpublishArticle,
  useArchiveArticle,
} from '@/shared/hooks/use-article-mutations';
import { toast } from '@/shared/ui/toast';
import { useState } from 'react';
import { X, Save, Send, ImageIcon, ArchiveIcon, EyeOff, Sparkles } from 'lucide-react';
import { api } from '@/shared/lib/api';

const articleSchema = z.object({
  title: z.string().min(5, 'TÃ­tulo muito curto').max(200, 'TÃ­tulo muito longo'),
  summary: z.string().max(500, 'Resumo muito longo').optional(),
  content: z.string().min(10, 'ConteÃºdo muito curto'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  coverImage: z.string().url('URL invÃ¡lida').optional().or(z.literal('')),
  tagInput: z.string().optional(),
});

type ArticleForm = z.infer<typeof articleSchema>;

import { useAuthStore } from '@/shared/stores/auth.store';

interface Props {
  initialData?: Partial<
    ArticleForm & { id: string; slug: string; status: string; tags?: string[] }
  >;
}

export default function EditorForm({ initialData }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isRedator = user?.role === 'REDATOR';
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const { data: categoriesData } = useCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle(initialData?.id ?? '');
  const publishArticle = usePublishArticle();
  const unpublishArticle = useUnpublishArticle();
  const archiveArticle = useArchiveArticle();

  const categories = categoriesData?.data ?? [];

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
  });

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (t && !tags.includes(t)) setTags([...tags, t]);
      setTagInput('');
    }
  }

  function suggestImage() {
    const categoryId = watch('categoryId');
    const title = watch('title');
    const cat = categories.find((c) => c.id === categoryId);
    const seed =
      cat?.slug ??
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30) ??
      'news';
    setValue('coverImage', `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`, {
      shouldValidate: true,
    });
  }

  async function revalidateArticle(slug?: string) {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(() => undefined);
  }

  async function onSaveDraft(data: ArticleForm) {
    try {
      if (initialData?.id) {
        await updateArticle.mutateAsync({ ...data, tags, status: 'DRAFT' });
        await revalidateArticle(initialData.slug);
      } else {
        await createArticle.mutateAsync({ ...data, tags, status: 'DRAFT' });
      }
      toast('Rascunho salvo com sucesso!');
    } catch {
      toast('Erro ao salvar rascunho.', 'error');
    }
  }

  async function onPublish(data: ArticleForm) {
    try {
      if (initialData?.id) {
        await updateArticle.mutateAsync({ ...data, tags });
        await publishArticle.mutateAsync(initialData.id);
        await revalidateArticle(initialData.slug);
        toast('Artigo publicado com sucesso!');
        router.push(`/articles/${initialData.slug}`);
      } else {
        const created = await createArticle.mutateAsync({ ...data, tags, status: 'PUBLISHED' });
        toast('Artigo publicado com sucesso!');
        const slug =
          (created as { data?: { slug?: string }; slug?: string })?.data?.slug ??
          (created as { slug?: string })?.slug;
        if (slug) {
          router.push(`/articles/${slug}`);
        } else {
          router.push('/editor');
        }
      }
    } catch {
      toast('Erro ao publicar artigo.', 'error');
    }
  }

  async function handleSuggestTags() {
    const title = watch('title');
    const content = watch('content');
    if (!title || !content) {
      toast('Preencha título e conteúdo antes de sugerir tags.', 'error');
      return;
    }
    setIsSuggestingTags(true);
    try {
      const { data: res } = await api.post('/ai/suggest-tags', { title, content });
      const suggested: string[] = res?.data ?? res ?? [];
      const newTags = suggested.filter((t) => !tags.includes(t));
      if (newTags.length > 0) {
        setTags((prev) => [...prev, ...newTags]);
        toast(`${newTags.length} tag(s) sugerida(s) pela IA!`);
      } else {
        toast('Nenhuma tag nova sugerida.');
      }
    } catch {
      toast('Erro ao sugerir tags.', 'error');
    } finally {
      setIsSuggestingTags(false);
    }
  }

  async function onUnpublish() {
    if (!initialData?.id) return;
    try {
      await unpublishArticle.mutateAsync(initialData.id);
      toast('Publicação removida. Artigo voltou para rascunho.');
    } catch {
      toast('Erro ao remover publicação.', 'error');
    }
  }

  async function onArchive() {
    if (!initialData?.id) return;
    try {
      await archiveArticle.mutateAsync(initialData.id);
      toast('Artigo arquivado.');
      router.back();
    } catch {
      toast('Erro ao arquivar artigo.', 'error');
    }
  }

  const coverImage = watch('coverImage');

  return (
    <div className="min-h-screen bg-zinc-50 transition-colors dark:bg-zinc-950">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <a
            href="/editor"
            className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </a>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {initialData?.id ? 'Editar artigo' : 'Novo artigo'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {initialData?.id && initialData.status !== 'ARCHIVED' && (
            <button
              type="button"
              onClick={onArchive}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-red-400"
              title="Arquivar artigo"
            >
              <ArchiveIcon className="h-4 w-4" />
              Arquivar
            </button>
          )}
          {initialData?.id && initialData.status === 'PUBLISHED' && (
            <button
              type="button"
              onClick={onUnpublish}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-yellow-400 hover:text-yellow-600 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-yellow-400"
              title="Remover publicação (volta para rascunho)"
            >
              <EyeOff className="h-4 w-4" />
              Despublicar
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Save className="h-4 w-4" />
            Salvar rascunho
          </button>
          {!isRedator && (
            <button
              type="button"
              onClick={handleSubmit(onPublish)}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#E10600] px-4 py-2 text-sm text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Publicar
            </button>
          )}
          {isRedator && (
            <span className="px-2 text-xs italic text-zinc-400">
              Salve o rascunho — um editor irá revisar e publicar.
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {/* Cover preview */}
        {coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Capa do artigo" className="h-full w-full object-cover" />
          </div>
        )}

        {/* Cover URL */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Imagem de capa
          </label>
          <div className="flex gap-2">
            <input
              {...register('coverImage')}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E10600] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={suggestImage}
              title="Sugerir imagem gratuita baseada na categoria"
              className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-700 dark:hover:text-red-400"
            >
              <ImageIcon className="h-4 w-4" />
              Sugerir imagem
            </button>
          </div>
          {errors.coverImage && (
            <p className="mt-1 text-xs text-red-600">{errors.coverImage.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <textarea
            {...register('title')}
            placeholder="TÃ­tulo do artigo..."
            rows={2}
            className="w-full resize-none border-0 bg-transparent text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-700"
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
        </div>

        {/* Summary */}
        <div>
          <textarea
            {...register('summary')}
            placeholder="Resumo (opcional)..."
            rows={2}
            className="w-full resize-none border-0 bg-transparent text-lg text-zinc-500 placeholder:text-zinc-300 focus:outline-none dark:text-zinc-400 dark:placeholder:text-zinc-700"
          />
          {errors.summary && <p className="text-xs text-red-600">{errors.summary.message}</p>}
        </div>

        {/* Category + Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Categoria *
            </label>
            <select
              {...register('categoryId')}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#E10600] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Tags
              </label>
              <button
                type="button"
                onClick={handleSuggestTags}
                disabled={isSuggestingTags}
                className="flex items-center gap-1 text-xs text-red-600 transition-colors hover:text-red-700 disabled:opacity-50"
                title="Sugerir tags via IA"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isSuggestingTags ? 'Sugerindo...' : 'Sugerir com IA'}
              </button>
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Tag (Enter para adicionar)"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#E10600] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-600"
            />
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
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
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Conteúdo *
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
        </div>
      </div>
    </div>
  );
}
