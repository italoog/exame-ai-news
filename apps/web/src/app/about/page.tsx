import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, BarChart2, ShieldCheck, Zap, Users, Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre | EXAME AI NEWS',
  description: 'Conheça a EXAME AI NEWS — a plataforma inteligente de notícias para o mundo dos negócios, powered by IA.',
}

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Resumos com IA',
    description: 'Cada artigo conta com um resumo gerado automaticamente por inteligência artificial, destacando os pontos mais relevantes para sua tomada de decisão.',
  },
  {
    icon: Zap,
    title: 'Conteúdo em tempo real',
    description: 'Notícias publicadas por editores especializados, processadas e indexadas em segundos para que você esteja sempre à frente.',
  },
  {
    icon: BarChart2,
    title: 'Trending & Recomendações',
    description: 'Algoritmo proprietário identifica os temas em alta e personaliza seu feed com base nos conteúdos que você mais consome.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança e privacidade',
    description: 'Arquitetura segura com JWT, bcrypt e conformidade com a LGPD. Seus dados nunca são vendidos a terceiros.',
  },
  {
    icon: Newspaper,
    title: 'Editorial de qualidade',
    description: 'Cobertura especializada em tecnologia, economia, mercados financeiros, startups e negócios internacionais.',
  },
  {
    icon: Users,
    title: 'Comunidade de leitores',
    description: 'Salve artigos favoritos, comente e interaja com outros profissionais do ecossistema de negócios.',
  },
]

const STACK = [
  { label: 'Frontend', value: 'Next.js 15 · TypeScript · TailwindCSS · shadcn/ui · TanStack Query' },
  { label: 'Backend', value: 'NestJS · Prisma · PostgreSQL 16 · Redis · BullMQ' },
  { label: 'IA', value: 'Google Gemini · Groq · Resumos automáticos · Auto-tagging' },
  { label: 'Infra', value: 'Oracle Cloud VPS · Docker Swarm · Easypanel · GitHub Actions' },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-zinc-950 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Notícias inteligentes para{' '}
            <span className="text-red-500">decisões melhores</span>
          </h1>
          <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            A EXAME AI NEWS é uma plataforma editorial de próxima geração que combina jornalismo especializado com inteligência artificial para entregar o que realmente importa para profissionais de negócios.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold rounded-lg transition-colors"
            >
              Ver as notícias
            </Link>
          </div>
        </div>
      </section>

      {/* Missão */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
              Nossa missão
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              Acreditamos que informação de qualidade não deve ser um privilégio. Nossa missão é democratizar o acesso a análises profundas sobre negócios, tecnologia e economia — tornando o conteúdo mais acessível, relevante e fácil de consumir com o auxílio da inteligência artificial.
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Cada artigo publicado na plataforma passa por um pipeline de IA que gera resumos objetivos, sugere tags e identifica conexões com outros conteúdos — economizando seu tempo sem sacrificar a profundidade.
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800">
            <div className="space-y-5">
              {[
                { label: 'Artigos publicados', value: '15+' },
                { label: 'Resumos gerados por IA', value: '15+' },
                { label: 'Categorias editoriais', value: '6' },
                { label: 'Leitores cadastrados', value: 'Crescendo' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</span>
                  <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight text-center mb-12">
            O que torna a plataforma diferente
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900 transition-colors"
              >
                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack técnica */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-8">
          Stack tecnológica
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {STACK.map((s) => (
            <div
              key={s.label}
              className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="w-1 rounded-full bg-red-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mb-1">{s.label}</p>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Projeto open-source desenvolvido como demonstração de arquitetura fullstack enterprise com boas práticas de engenharia de software.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-4">Pronto para começar?</h2>
          <p className="text-zinc-400 mb-8">Crie sua conta gratuitamente e tenha acesso a todo o conteúdo da plataforma.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
