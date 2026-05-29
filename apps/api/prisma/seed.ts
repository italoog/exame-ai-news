import { PrismaClient, Role, ArticleStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia', color: '#3B82F6', description: 'Inovação, startups e tendências tech' },
  { name: 'Economia', slug: 'economia', color: '#10B981', description: 'Macroeconomia, indicadores e análises' },
  { name: 'Mercados', slug: 'mercados', color: '#F59E0B', description: 'Bolsa, ações e investimentos' },
  { name: 'Política', slug: 'politica', color: '#8B5CF6', description: 'Cenário político nacional e internacional' },
  { name: 'Negócios', slug: 'negocios', color: '#EC4899', description: 'Estratégia, gestão e empresas' },
  { name: 'Startups', slug: 'startups', color: '#E10600', description: 'Ecossistema de startups e venture capital' },
  { name: 'ESG', slug: 'esg', color: '#22C55E', description: 'Sustentabilidade e governança corporativa' },
  { name: 'Internacional', slug: 'internacional', color: '#64748B', description: 'Economia e política global' },
]

const TAGS = [
  'inteligencia-artificial', 'machine-learning', 'blockchain', 'web3', 'metaverso',
  'inflacao', 'juros', 'cambio', 'pib', 'fiscal',
  'ibovespa', 'nasdaq', 'crypto', 'fundos', 'dividendos',
  'eleicoes', 'congresso', 'regulacao', 'reforma', 'tributacao',
  'fusoes', 'ipo', 'venture-capital', 'unicornio', 'disruption',
]

const ARTICLE_CONTENT =
  '<p>O cenário econômico brasileiro atravessa um momento de profunda transformação. Os indicadores mais recentes apontam para uma recuperação gradual, mas os desafios estruturais permanecem presentes no horizonte de médio prazo.</p>' +
  '<p>Segundo especialistas ouvidos pela redação, a combinação de política fiscal responsável com estímulos seletivos ao crescimento tem sido a receita adotada pelos principais países emergentes.</p>' +
  '<h2>Cenário Internacional</h2>' +
  '<p>No plano externo, a desaceleração da economia chinesa e a persistente inflação nos países desenvolvidos continuam pressionando os mercados. O Federal Reserve mantém seu discurso cauteloso.</p>' +
  '<p>Para os mercados emergentes, isso significa um ambiente de maior volatilidade, exigindo que os governos mantenham disciplina nas contas públicas para preservar a confiança dos investidores.</p>' +
  '<h2>Perspectivas para o Brasil</h2>' +
  '<p>No contexto doméstico, os analistas destacam a importância do arcabouço fiscal como âncora para as expectativas. A trajetória da dívida pública será avaliada pelas agências de rating.</p>' +
  '<p>O setor de tecnologia mostra resiliência notável. As startups brasileiras continuam atraindo capital estrangeiro nas verticais de fintech, agtech e healthtech.</p>'

async function main() {
  console.log('Iniciando seed do banco de dados...')

  const defaultPasswordHash = await bcrypt.hash('Senha123!', 10)

  console.log('Criando categorias...')
  const categories = await Promise.all(
    CATEGORIES.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )
  console.log(categories.length + ' categorias criadas')

  console.log('Criando tags...')
  const tags = await Promise.all(
    TAGS.map((name) =>
      prisma.tag.upsert({
        where: { slug: name },
        update: {},
        create: { name, slug: name },
      })
    )
  )
  console.log(tags.length + ' tags criadas')

  console.log('Criando usuarios...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@exame.com' },
    update: {},
    create: {
      name: 'Admin EXAME',
      email: 'admin@exame.com',
      password: defaultPasswordHash,
      role: Role.ADMIN,
      bio: 'Administrador da plataforma EXAME AI NEWS',
      emailVerified: true,
    },
  })

  const editor1 = await prisma.user.upsert({
    where: { email: 'editor1@exame.com' },
    update: {},
    create: {
      name: 'Ana Beatriz Costa',
      email: 'editor1@exame.com',
      password: defaultPasswordHash,
      role: Role.EDITOR,
      bio: 'Editora de Economia e Mercados',
      emailVerified: true,
    },
  })

  const editor2 = await prisma.user.upsert({
    where: { email: 'editor2@exame.com' },
    update: {},
    create: {
      name: 'Carlos Mendes',
      email: 'editor2@exame.com',
      password: defaultPasswordHash,
      role: Role.EDITOR,
      bio: 'Editor de Tecnologia e Startups',
      emailVerified: true,
    },
  })

  const userEmails = [
    'joao@email.com', 'maria@email.com', 'pedro@email.com',
    'lucia@email.com', 'rafael@email.com',
  ]
  const users = await Promise.all(
    userEmails.map((email, i) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: 'Usuário ' + (i + 1),
          email,
          password: defaultPasswordHash,
          role: Role.USER,
          emailVerified: true,
        },
      })
    )
  )
  console.log((users.length + 3) + ' usuários criados')

  console.log('Criando artigos...')
  const authors = [admin, editor1, editor2]
  const articleSlugs = [
    'ia-transforma-jornalismo-digital',
    'ibovespa-atinge-nova-maxima',
    'startups-brasileiras-captam-bilhoes',
    'reforma-tributaria-aprovada',
    'juros-altos-impactam-credito',
    'mercado-crypto-recuperacao',
    'esg-estrategia-crescimento',
    'economia-global-perspectivas',
    'fintechs-desafiam-bancos',
    'venture-capital-2024',
  ]

  const articles = await Promise.all(
    articleSlugs.map(async (slug, i) => {
      const category = categories[i % categories.length]
      const author = authors[i % authors.length]
      const tag1 = tags[i % tags.length]
      const tag2 = tags[(i + 1) % tags.length]
      const title = 'Artigo: ' + slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

      return prisma.article.upsert({
        where: { slug },
        update: {},
        create: {
          title,
          slug,
          content: ARTICLE_CONTENT,
          summary: 'Resumo executivo do artigo com os principais pontos abordados pela redacao.',
          aiSummary: 'Resumo gerado por IA: analise aprofundada dos principais aspectos economicos e de mercado.',
          status: ArticleStatus.PUBLISHED,
          featured: i < 3,
          publishedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          readTime: Math.floor(Math.random() * 8) + 3,
          viewCount: Math.floor(Math.random() * 10000),
          authorId: author.id,
          categoryId: category.id,
          tags: {
            create: [
              { tag: { connect: { id: tag1.id } } },
              { tag: { connect: { id: tag2.id } } },
            ],
          },
        },
      })
    })
  )
  console.log(articles.length + ' artigos criados')

  console.log('Criando comentarios...')
  let commentCount = 0
  for (const article of articles.slice(0, 5)) {
    for (const user of [...users.slice(0, 3), editor1]) {
      const comment = await prisma.comment.create({
        data: {
          content: 'Otima analise sobre ' + article.title + '. Muito relevante para o cenario atual do mercado.',
          userId: user.id,
          articleId: article.id,
        },
      })
      commentCount++

      await prisma.comment.create({
        data: {
          content: 'Concordo completamente! Perspectiva muito pertinente.',
          userId: users[Math.floor(Math.random() * users.length)].id,
          articleId: article.id,
          parentId: comment.id,
        },
      })
      commentCount++
    }
  }
  console.log(commentCount + ' comentarios criados')

  console.log('Criando favoritos...')
  for (const user of users.slice(0, 3)) {
    for (const article of articles.slice(0, 4)) {
      await prisma.favorite.upsert({
        where: { userId_articleId: { userId: user.id, articleId: article.id } },
        update: {},
        create: { userId: user.id, articleId: article.id },
      })
    }
  }
  console.log('Favoritos criados')

  console.log('\nSeed concluido com sucesso!')
  console.log('---')
  console.log('Admin:   admin@exame.com / Senha123!')
  console.log('Editor1: editor1@exame.com / Senha123!')
  console.log('Editor2: editor2@exame.com / Senha123!')
  console.log('User:    joao@email.com / Senha123!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })