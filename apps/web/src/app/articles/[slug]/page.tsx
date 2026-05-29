import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, Eye, Tag, ChevronRight, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CategoryBadge } from '@/shared/ui/category-badge'

interface ArticlePageProps {
  params: { slug: string }
}

async function getArticle(slug: string) {
  return {
    id: '1',
    title: 'Inteligência Artificial Transforma o Jornalismo: O Futuro das Redações Digitais',
    slug,
    content: `
      <p>O cenário do jornalismo digital está passando por uma transformação sem precedentes. A inteligência artificial não é mais uma promessa futura — ela já está no coração das redações mais inovadoras do mundo.</p>
      <h2>A Revolução Silenciosa</h2>
      <p>Ferramentas baseadas em Large Language Models (LLMs) estão acelerando desde a pesquisa de pauta até a distribuição de conteúdo. Redações como Bloomberg, Reuters e Associated Press já automatizam dezenas de milhares de textos por mês.</p>
      <p>No Brasil, portais como Agência Brasil e veículos do Grupo Globo experimentam com sumarização automática e categorização de conteúdo. A tecnologia ainda enfrenta resistência, mas os resultados falam por si.</p>
      <h2>Dados que Impressionam</h2>
      <p>Segundo pesquisa da Reuters Institute, 78% das redações globais já utilizam alguma forma de IA em seus fluxos de trabalho. No Brasil, esse número ainda está em 34%, mas cresce 12 pontos percentuais ao ano.</p>
      <p>A produtividade aumenta em média 40% quando jornalistas usam IA como assistente — não como substituto. A chave está na curadoria humana sobre o output da máquina.</p>
      <h2>Desafios e Oportunidades</h2>
      <p>Checagem de fatos, viés algorítmico e questões autorais são os principais desafios. Porém, as oportunidades superam os riscos quando a tecnologia é implementada com responsabilidade.</p>
    `,
    summary: 'Como as grandes redações do mundo estão adotando IA para acelerar a produção de conteúdo e personalizar a experiência do leitor.',
    aiSummary: 'Redações globais adotam IA em larga escala: Bloomberg e Reuters automatizam milhares de textos/mês. No Brasil, adoção cresce 12 p.p. ao ano. Chave do sucesso: curadoria humana sobre output da IA, não substituição.',
    coverImage: null,
    publishedAt: new Date().toISOString(),
    readTime: 7,
    viewCount: 12847,
    author: { id: '1', name: 'Ana Beatriz Costa', avatar: null, bio: 'Editora de Tecnologia' },
    category: { name: 'Tecnologia', slug: 'tecnologia', color: '#3B82F6' },
    tags: [
      { tag: { id: '1', name: 'inteligência-artificial', slug: 'inteligencia-artificial' } },
      { tag: { id: '2', name: 'machine-learning', slug: 'machine-learning' } },
    ],
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Artigo não encontrado' }

  return {
    title: article.title,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  const publishedDate = article.publishedAt
    ? format(new Date(article.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-1 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-600">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/categories/${article.category.slug}`} className="hover:text-zinc-600">
            {article.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-600 truncate max-w-40">{article.title}</span>
        </nav>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <CategoryBadge name={article.category.name} slug={article.category.slug} />
        <h1 className="mt-4 text-3xl md:text-4xl font-black text-zinc-900 leading-tight tracking-tight">
          {article.title}
        </h1>
        {article.summary && (
          <p className="mt-4 text-lg text-zinc-500 leading-relaxed">{article.summary}</p>
        )}

        {/* Meta */}
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-600">{article.author.name[0]}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{article.author.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min de leitura
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount?.toLocaleString('pt-BR')} visualizações
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
            <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* AI Summary */}
      {article.aiSummary && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Resumo IA</span>
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed">{article.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
        <div
          className="prose prose-zinc prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-p:leading-7 prose-p:text-zinc-700
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-zinc-100">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-zinc-400" />
              {article.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${tag.slug}`}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-medium rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
