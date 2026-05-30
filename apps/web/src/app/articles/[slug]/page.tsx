import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Eye, Tag, ChevronRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DOMPurify from 'isomorphic-dompurify';
import { CategoryBadge } from '@/shared/ui/category-badge';
import { getCoverImage } from '@/shared/lib/cover-image';
import { FavoriteButton } from '@/shared/ui/favorite-button';
import { ArticleAiChat } from '@/shared/ui/article-ai-chat';
import { ArticleCard } from '@/shared/ui/article-card';
import { CommentsSection } from './comments-section';
import { ReadTracker } from './read-tracker';

export const revalidate = 60;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  aiSummary: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readTime: number | null;
  viewCount: number | null;
  author: { id: string; name: string; avatar: string | null };
  category: { id: string; name: string; slug: string; color: string | null };
  tags: Array<{ tag: { id: string; name: string; slug: string } }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  const apiUrl =
    process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
  try {
    const res = await fetch(`${apiUrl}/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Article | { data: Article };
    return 'data' in json ? json.data : json;
  } catch {
    return null;
  }
}

type RelatedArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  aiSummary: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readTime: number | null;
  viewCount: number;
  author: { id: string; name: string; avatar: string | null };
  category: { id: string; name: string; slug: string; color: string | null };
};

async function getRelatedArticles(articleId: string): Promise<RelatedArticle[]> {
  const apiUrl =
    process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
  try {
    const res = await fetch(`${apiUrl}/recommendations/similar/${articleId}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: RelatedArticle[] } | RelatedArticle[];
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Artigo não encontrado' };

  const ogImage = article.coverImage ?? getCoverImage(slug, article.category?.slug);

  return {
    title: article.title,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      type: 'article',
      publishedTime: article.publishedAt ?? undefined,
      authors: [article.author.name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary ?? undefined,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [relatedArticles] = await Promise.all([getRelatedArticles(article.id)]);

  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <article className="min-h-screen bg-white transition-colors dark:bg-zinc-950">
      <ReadTracker articleId={article.id} />
      {/* Breadcrumb */}
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <nav className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
          <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Início
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href={`/categories/${article.category.slug}`}
            className="hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            {article.category.name}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="max-w-40 truncate text-zinc-600 dark:text-zinc-400">
            {article.title}
          </span>
        </nav>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-3xl px-4 pb-6 pt-8 sm:px-6">
        <CategoryBadge name={article.category.name} slug={article.category.slug} />
        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
          {article.title}
        </h1>
        {article.summary && (
          <p className="mt-4 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
            {article.summary}
          </p>
        )}

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                {article.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {article.author.name[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {article.author.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {publishedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime} min de leitura
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.viewCount?.toLocaleString('pt-BR')} visualizações
              </span>
            </div>
          </div>
          <FavoriteButton articleId={article.id} />
        </div>
      </header>

      {/* Cover Image */}
      <div className="mx-auto mb-8 max-w-4xl px-4 sm:px-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={article.coverImage ?? getCoverImage(article.slug, article.category.slug)}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* AI Summary */}
      {article.aiSummary && (
        <div className="mx-auto mb-8 max-w-3xl px-4 sm:px-6">
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-red-600">
                Resumo IA
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {article.aiSummary}
            </p>
          </div>
        </div>
      )}

      {/* AI Chat */}
      <div className="mx-auto mb-8 max-w-3xl px-4 sm:px-6">
        <ArticleAiChat articleId={article.id} />
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <div
          className="prose prose-lg prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mb-3 prose-h2:mt-8 prose-h2:text-xl prose-p:leading-7 prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="h-4 w-4 text-zinc-400" />
              {article.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/search?tag=${tag.slug}`}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <CommentsSection articleId={article.id} />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="border-t border-zinc-100 pt-10 dark:border-zinc-800">
            <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Artigos relacionados
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.slice(0, 3).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
