import { PrismaClient, Role, ArticleStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia', color: '#3B82F6', description: 'Inovação, startups e tendências tech' },
  { name: 'Economia', slug: 'economia', color: '#10B981', description: 'Macroeconomia, indicadores e análises' },
  { name: 'Mercados', slug: 'mercados', color: '#F59E0B', description: 'Bolsa, ações e investimentos' },
  { name: 'Negócios', slug: 'negocios', color: '#EC4899', description: 'Estratégia, gestão e empresas' },
  { name: 'Startups', slug: 'startups', color: '#E10600', description: 'Ecossistema de startups e venture capital' },
  { name: 'Internacional', slug: 'internacional', color: '#64748B', description: 'Economia e política global' },
]

const TAGS = [
  'inteligencia-artificial', 'machine-learning', 'blockchain', 'web3',
  'inflacao', 'juros', 'cambio', 'pib',
  'ibovespa', 'nasdaq', 'crypto', 'dividendos',
  'fusoes', 'ipo', 'venture-capital', 'unicornio',
  'fintech', 'agtech', 'healthtech', 'edtech',
]

// Imagens via Unsplash — fotos temáticas de alta qualidade
const IMAGES: Record<string, string> = {
  'ai-journalism-newsroom':    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=1200&q=80',
  'stock-market-brazil-bull':  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  'fintech-brazil-startup':    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  'tax-reform-brazil-congress':'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
  'openai-gpt5-artificial-intelligence': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
  'nubank-digital-bank-purple':'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
  'federal-reserve-interest-rates': 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=80',
  'electric-vehicles-brazil-factory': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
  'bitcoin-crypto-bull-market':'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
  'cloud-computing-government-tech': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  'brazil-central-bank-monetary-policy': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
  'agribusiness-soy-harvest-brazil': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  'healthtech-medical-ai-startup': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  'china-economy-slowdown-skyline': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1200&q=80',
  'brazil-employment-job-market': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
}

function img(seed: string): string {
  return IMAGES[seed] ?? `https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80`
}

interface ArticleSeed {
  title: string
  slug: string
  summary: string
  content: string
  coverImage: string
  categorySlug: string
  tags: string[]
  featured: boolean
  daysAgo: number
  readTime: number
  viewCount: number
}

const ARTICLES: ArticleSeed[] = [
  {
    title: 'IA generativa transforma redações: como o jornalismo está se reinventando',
    slug: 'ia-generativa-transforma-redacoes-jornalismo',
    summary: 'Ferramentas de inteligência artificial generativa estão mudando fluxos editoriais em veículos de todo o mundo — da apuração à distribuição do conteúdo.',
    coverImage: img('ai-journalism-newsroom'),
    categorySlug: 'tecnologia',
    tags: ['inteligencia-artificial', 'machine-learning'],
    featured: true,
    daysAgo: 0,
    readTime: 7,
    viewCount: 14200,
    content: `<p>A inteligência artificial generativa deixou de ser uma promessa distante para se tornar uma ferramenta cotidiana nas principais redações do mundo. Do New York Times ao Estadão, passando por startups de mídia digital, os editores estão redesenhando fluxos de trabalho para incorporar modelos de linguagem de grande escala (LLMs) sem comprometer a qualidade jornalística.</p>
<h2>O que mudou na prática</h2>
<p>Nos bastidores das redações mais modernas, a IA já atua em diversas etapas do processo editorial: transcrição automática de entrevistas, geração de primeiros rascunhos de hard news, sugestão de manchetes, resumos executivos de documentos extensos e até verificação preliminar de fatos.</p>
<p>O impacto é mensurável. Veículos que adotaram ferramentas de IA relatam ganho de até 40% na produtividade de pautas de rotina, liberando repórteres para investigações mais complexas e reportagens de fôlego.</p>
<h2>Os riscos e as salvaguardas</h2>
<p>Nem tudo são avanços, porém. A proliferação de conteúdo gerado por IA traz preocupações legítimas sobre alucinações — respostas incorretas apresentadas com excesso de confiança pelos modelos. Grandes veículos implementaram camadas editoriais obrigatórias: todo conteúdo produzido com auxílio de IA passa por revisão humana antes da publicação.</p>
<p>A Associação Brasileira de Jornalismo Investigativo (Abraji) publicou diretrizes recomendando transparência total ao leitor sobre o uso de IA na apuração e na redação. A tendência é que selos de verificação se tornem padrão de mercado.</p>
<h2>Perspectivas para os próximos anos</h2>
<p>Analistas do setor projetam que, até 2027, mais de 60% do conteúdo de commodities informacionais — como notas de resultados financeiros, boletins meteorológicos e atualizações de placares esportivos — será gerado automaticamente por IA. O diferencial competitivo das redações migrará para a capacidade de produzir análises exclusivas, reportagens investigativas e narrativas que a máquina ainda não consegue replicar.</p>`,
  },
  {
    title: 'Ibovespa rompe barreira dos 160 mil pontos com fluxo estrangeiro',
    slug: 'ibovespa-rompe-160-mil-pontos-fluxo-estrangeiro',
    summary: 'O principal índice da bolsa brasileira atingiu novo recorde histórico impulsionado por capital externo e expectativas de corte de juros nos Estados Unidos.',
    coverImage: img('stock-market-brazil-bull'),
    categorySlug: 'mercados',
    tags: ['ibovespa', 'dividendos'],
    featured: true,
    daysAgo: 1,
    readTime: 5,
    viewCount: 22800,
    content: `<p>O Ibovespa fechou a sessão desta quinta-feira aos 160.412 pontos, superando pela primeira vez na história a barreira psicológica dos 160 mil pontos. O avanço de 2,3% no dia refletiu um dos maiores ingressos de capital estrangeiro em uma única sessão do ano, com fluxo positivo de R$ 3,8 bilhões.</p>
<h2>O que está por trás da alta</h2>
<p>Três fatores combinados explicam o movimento. Primeiro, a ata do último Federal Open Market Committee (FOMC) sinalizou maior abertura para um ciclo de afrouxamento monetário nos EUA ainda em 2026. Segundo, os dados de inflação brasileira vieram abaixo das expectativas, reforçando a perspectiva de manutenção da taxa Selic no nível atual. Terceiro, a temporada de resultados do primeiro trimestre superou estimativas em setores-chave como bancos, energia e agronegócio.</p>
<h2>Setores em destaque</h2>
<p>As ações de grandes bancos lideraram as altas: Itaú Unibanco avançou 3,8%, Bradesco ganhou 3,2% e o Banco do Brasil saltou 4,1%. No setor de commodities, Petrobras PN subiu 2,9% com o petróleo Brent acima de US$ 87 o barril.</p>
<p>As small caps também participaram da festa, com o índice SMLL valorizando 3,1% — sinal de que o otimismo não se restringiu às blue chips.</p>
<h2>Cautela dos estrategistas</h2>
<p>Apesar do euforia, estrategistas pedem cautela. "O mercado precificou um cenário muito benigno. Qualquer surpresa negativa na inflação americana ou nas contas públicas brasileiras pode provocar uma correção abrupta", alerta a economista-chefe de uma das maiores gestoras do país. O consenso de mercado projeta o Ibovespa entre 155 mil e 170 mil pontos ao fim do ano.</p>`,
  },
  {
    title: 'Fintechs brasileiras captam US$ 2,4 bi no primeiro semestre',
    slug: 'fintechs-brasileiras-captam-24-bi-primeiro-semestre',
    summary: 'O Brasil mantém liderança em captações de venture capital na América Latina, com fintechs respondendo por 38% de todo o volume investido no período.',
    coverImage: img('fintech-brazil-startup'),
    categorySlug: 'startups',
    tags: ['venture-capital', 'fintech'],
    featured: true,
    daysAgo: 2,
    readTime: 6,
    viewCount: 9400,
    content: `<p>O ecossistema de startups financeiras brasileiro captou US$ 2,4 bilhões no primeiro semestre de 2026, de acordo com levantamento da Associação Brasileira de Fintechs (ABFintechs). O número representa alta de 17% sobre igual período do ano anterior e consolida o país como o maior mercado de fintechs da América Latina pelo quinto ano consecutivo.</p>
<h2>Quem está recebendo o capital</h2>
<p>Os aportes se concentram em três vertentes. As fintechs de crédito para PMEs captaram US$ 780 milhões, refletindo a demanda reprimida de empresas que ainda enfrentam dificuldades de acesso ao crédito bancário tradicional. As plataformas de investimentos captaram US$ 620 milhões, beneficiadas pelo crescimento de investidores de varejo. As soluções de pagamento B2B receberam US$ 540 milhões.</p>
<h2>Perfil dos investidores</h2>
<p>Os fundos de venture capital americanos respondem por 44% do capital aportado, seguidos por fundos europeus (21%) e gestoras brasileiras (19%). A Sequoia Capital, a General Atlantic e a Softbank lideram o ranking de investidores mais ativos no período.</p>
<h2>Desafios regulatórios</h2>
<p>O setor observa com atenção as discussões no Banco Central sobre a regulação de open finance e a implementação do Drex — o real digital. Executivos de fintechs avaliam que um marco regulatório claro pode ser o catalisador para um novo ciclo de crescimento, mas temem que exigências excessivas de compliance penalizem players menores.</p>`,
  },
  {
    title: 'Reforma do IR: o que muda para trabalhadores e empresas em 2026',
    slug: 'reforma-ir-o-que-muda-trabalhadores-empresas-2026',
    summary: 'Aprovada pelo Congresso, a reforma do Imposto de Renda amplia a faixa de isenção para R$ 5.000 e cria novas obrigações para rendas mais altas.',
    coverImage: img('tax-reform-brazil-congress'),
    categorySlug: 'economia',
    tags: ['inflacao', 'pib'],
    featured: false,
    daysAgo: 3,
    readTime: 8,
    viewCount: 31500,
    content: `<p>A reforma do Imposto de Renda de Pessoa Física (IRPF), aprovada pelo Congresso Nacional com placar de 312 votos a favor e 127 contra, é a mais profunda revisão da tabela do imposto em 25 anos. A nova legislação, que entra em vigor em janeiro de 2027, amplia a isenção, cria alíquotas progressivas mais elevadas para rendas altas e muda as regras para participação em lucros e resultados (PLR).</p>
<h2>As principais mudanças</h2>
<p>A faixa de isenção sobe de R$ 2.824 para R$ 5.000 mensais. Quem ganha entre R$ 5.001 e R$ 10.000 pagará alíquota de 7,5%. Entre R$ 10.001 e R$ 20.000, a alíquota é de 15%. De R$ 20.001 a R$ 40.000, 22,5%. Acima de R$ 40.000, a alíquota máxima de 27,5% se mantém, mas incide a partir de um patamar mais elevado.</p>
<h2>Impacto para empresas</h2>
<p>Para as empresas, as mudanças envolvem especialmente as regras de distribuição de dividendos e a tributação de PLR. A isenção sobre dividendos para lucros de até R$ 50 mil anuais por sócio é mantida. Acima desse valor, incide uma alíquota de 15%, o que representa uma mudança significativa para sócios de empresas lucrativas.</p>
<h2>O debate econômico</h2>
<p>Economistas divergem sobre o impacto fiscal e econômico da medida. O Ministério da Fazenda estima um impacto de R$ 35 bilhões nas contas públicas, compensado por novas fontes de receita. Críticos alertam que a reforma pode desincentivar o investimento produtivo e a geração de empregos formais.</p>`,
  },
  {
    title: 'OpenAI lança GPT-5 com capacidades multimodais inéditas',
    slug: 'openai-lanca-gpt5-capacidades-multimodais',
    summary: 'O modelo mais avançado da OpenAI processa texto, imagem, áudio e vídeo em tempo real, redefinindo o estado da arte em inteligência artificial.',
    coverImage: img('openai-gpt5-artificial-intelligence'),
    categorySlug: 'tecnologia',
    tags: ['inteligencia-artificial', 'machine-learning'],
    featured: false,
    daysAgo: 4,
    readTime: 6,
    viewCount: 58000,
    content: `<p>A OpenAI apresentou o GPT-5, seu modelo de linguagem mais avançado, em evento transmitido ao vivo para mais de 2 milhões de espectadores. O novo modelo representa um salto qualitativo significativo em relação aos predecessores, especialmente nas capacidades multimodais e no raciocínio lógico-matemático.</p>
<h2>O que o GPT-5 consegue fazer</h2>
<p>O GPT-5 processa texto, imagens, áudio e vídeo de forma integrada e em tempo real, sem necessidade de modelos separados para cada modalidade. Em benchmarks de raciocínio matemático, o modelo atingiu 92% de acurácia em problemas de nível olímpico — comparado a 53% do GPT-4. Em tarefas de codificação, o desempenho supera o de engenheiros de software seniores em 78% dos casos testados.</p>
<h2>Implicações para o mercado</h2>
<p>A chegada do GPT-5 intensifica a corrida entre grandes players de tecnologia. Google, Anthropic e Meta precisarão responder com atualizações significativas para seus próprios modelos. Analistas estimam que a OpenAI pode dobrar sua avaliação de mercado, que já supera US$ 150 bilhões, com a nova geração de produtos empresariais baseados no GPT-5.</p>
<h2>Riscos e governança</h2>
<p>A Comissão Europeia já anunciou que iniciará investigação sobre possíveis riscos sistêmicos associados ao novo modelo, no âmbito do AI Act. Nos EUA, o debate sobre regulação de IA ganhou nova urgência com o lançamento.</p>`,
  },
  {
    title: 'Nubank atinge 100 milhões de clientes e mira expansão global',
    slug: 'nubank-100-milhoes-clientes-expansao-global',
    summary: 'O banco digital brasileiro se torna o primeiro da América Latina a atingir 100 milhões de clientes, com foco agora na expansão para novos mercados.',
    coverImage: img('nubank-digital-bank-purple'),
    categorySlug: 'negocios',
    tags: ['fintech', 'ipo'],
    featured: false,
    daysAgo: 5,
    readTime: 5,
    viewCount: 19700,
    content: `<p>O Nubank anunciou que sua base de clientes ultrapassou a marca de 100 milhões em todos os países em que atua — Brasil, México e Colômbia. O feito torna a fintech fundada em 2013 o maior banco digital do mundo em número de clientes, superando o Revolut europeu.</p>
<h2>A estratégia de crescimento</h2>
<p>O crescimento acelerado do Nubank no último ano foi impulsionado pela expansão de seu portfólio de produtos: seguros, investimentos, crédito consignado e, mais recentemente, o serviço de conta para menores de idade. A receita por cliente (ARPU) aumentou 34% em relação ao ano anterior, sinalizando que a empresa conseguiu monetizar melhor sua base existente enquanto ainda cresce.</p>
<h2>Próximos mercados</h2>
<p>O CEO David Vélez confirmou que o banco está em fase de análise para entrada em três novos mercados: Alemanha, Reino Unido e um país da África anglófona ainda não revelado. A estratégia para a Europa prevê um produto simplificado focado em imigrantes latino-americanos antes de uma oferta mais abrangente.</p>
<h2>Ações em alta</h2>
<p>As ações do Nubank (NYSE: NU) subiram 8,4% após o anúncio, com os papéis atingindo US$ 14,20 — máxima histórica. O valor de mercado da empresa ultrapassa US$ 68 bilhões, tornando-a a empresa de capital aberto mais valiosa do setor financeiro brasileiro.</p>`,
  },
  {
    title: 'Fed sinaliza dois cortes de juros em 2026; dólar cai frente ao real',
    slug: 'fed-sinaliza-dois-cortes-juros-2026-dolar-cai',
    summary: 'O banco central americano indicou que deve cortar a taxa de juros duas vezes ainda este ano, levando o dólar a recuar para R$ 4,95.',
    coverImage: img('federal-reserve-interest-rates'),
    categorySlug: 'economia',
    tags: ['juros', 'cambio'],
    featured: false,
    daysAgo: 6,
    readTime: 5,
    viewCount: 27300,
    content: `<p>O presidente do Federal Reserve, Jerome Powell, sinalizou durante discurso no Economic Club of New York que o banco central americano está preparado para realizar dois cortes na taxa de juros ainda em 2026, desde que os dados de inflação continuem a trajetória de arrefecimento observada nos últimos meses.</p>
<h2>Reação dos mercados</h2>
<p>A reação foi imediata nos mercados globais. O índice DXY, que mede o desempenho do dólar frente a uma cesta de moedas, recuou 0,9%. Frente ao real, a moeda americana caiu para R$ 4,95 — menor nível em 18 meses. O Ibovespa avançou 1,7%, enquanto bolsas europeias e asiáticas também registraram altas.</p>
<h2>O que Powell disse exatamente</h2>
<p>Powell afirmou que a inflação americana está "visivelmente mais próxima" da meta de 2% ao ano, com o índice PCE core em 2,4% na última leitura. "Não precisamos ver mais dados para ter confiança, mas queremos ter mais confiança antes de agir", afirmou. O mercado precifica agora 78% de probabilidade de um primeiro corte em setembro.</p>
<h2>Impacto no Brasil</h2>
<p>Para o Brasil, a perspectiva de juros americanos menores é duplamente positiva: melhora o fluxo de capitais para emergentes e reduz a pressão sobre o câmbio, o que ajuda a ancorar as expectativas de inflação doméstica. O Copom, contudo, deve aguardar sinais mais concretos antes de qualquer movimento na Selic.</p>`,
  },
  {
    title: 'Mercado de EVs no Brasil dobra e montadoras correm para adaptar fábricas',
    slug: 'mercado-evs-brasil-dobra-montadoras-adaptam-fabricas',
    summary: 'As vendas de veículos elétricos cresceram 103% no Brasil em 12 meses, pressionando montadoras a acelerar investimentos em capacidade produtiva local.',
    coverImage: img('electric-vehicles-brazil-factory'),
    categorySlug: 'negocios',
    tags: ['inflacao', 'venture-capital'],
    featured: false,
    daysAgo: 7,
    readTime: 6,
    viewCount: 12100,
    content: `<p>O Brasil registrou a venda de 148.000 veículos elétricos e híbridos plug-in nos últimos 12 meses, um crescimento de 103% frente ao período anterior. O número ainda representa apenas 7,4% do total de automóveis emplacados no país, mas o ritmo de expansão é o mais acelerado da América Latina e chama atenção das grandes montadoras globais.</p>
<h2>Quem lidera o mercado</h2>
<p>A BYD consolidou sua liderança com 34% de participação de mercado, seguida pela montadora estatal chinesa SAIC (19%) e pela Volkswagen (12%). A Tesla, apesar do reconhecimento de marca, mantém apenas 6% de share no segmento premium. A GM e a Stellantis anunciaram investimentos combinados de R$ 14 bilhões para eletrificação de suas plantas brasileiras até 2030.</p>
<h2>Desafios de infraestrutura</h2>
<p>O crescimento acelerado expõe gargalos significativos. A rede de carregamento rápido no Brasil conta com apenas 3.200 pontos, número considerado insuficiente para suportar uma frota elétrica maior. A Aneel estuda regulação para obrigar postos de combustíveis a instalar carregadores elétricos a partir de 2027.</p>
<h2>O papel das baterias</h2>
<p>Um dos maiores desafios para a nationalização da cadeia produtiva é a ausência de fábricas de baterias no Brasil. O governo federal negocia com três consórcios — dois asiáticos e um europeu — para instalar as primeiras gigafactories no país, com previsão de operação entre 2028 e 2030.</p>`,
  },
  {
    title: 'Criptomoedas: Bitcoin supera US$ 120 mil com aprovação de ETFs na Europa',
    slug: 'bitcoin-supera-120-mil-etfs-aprovados-europa',
    summary: 'O Bitcoin atingiu novo recorde histórico após reguladores europeus aprovarem os primeiros ETFs de criptomoedas spot do continente.',
    coverImage: img('bitcoin-crypto-bull-market'),
    categorySlug: 'mercados',
    tags: ['crypto', 'nasdaq'],
    featured: false,
    daysAgo: 8,
    readTime: 5,
    viewCount: 44600,
    content: `<p>O Bitcoin ultrapassou a barreira dos US$ 120.000 pela primeira vez na história, atingindo máxima de US$ 121.340 nesta quarta-feira após a Autoridade Europeia de Valores Mobiliários e Mercados (ESMA) aprovar os primeiros ETFs de Bitcoin spot em sete países da União Europeia.</p>
<h2>O gatilho europeu</h2>
<p>A decisão da ESMA abre caminho para que investidores institucionais europeus acessem Bitcoin através de veículos regulados, algo que já é possível nos EUA desde janeiro de 2024. Estima-se que os ETFs europeus devam captar entre US$ 15 e US$ 25 bilhões nos primeiros 12 meses de operação, representando demanda adicional significativa pelo ativo.</p>
<h2>O efeito cascata no mercado</h2>
<p>A alta do Bitcoin arrastou o restante do mercado cripto. Ethereum subiu 18%, atingindo US$ 5.800. Solana valorizou 24%, chegando a US$ 420. O valor de mercado total do setor cripto ultrapassou US$ 4 trilhões pela primeira vez, superando o PIB da Alemanha.</p>
<h2>Vozes contrárias</h2>
<p>Não faltam céticos. O prêmio Nobel de Economia Paul Krugman reiterou sua posição de que o Bitcoin não tem valor intrínseco e que os preços atuais refletem especulação pura. O BIS (Banco de Compensações Internacionais) publicou relatório alertando para riscos sistêmicos caso a correlação entre criptoativos e o sistema financeiro tradicional continue crescendo.</p>`,
  },
  {
    title: 'Amazon e Google disputam contratos de cloud com governo brasileiro de R$ 8 bi',
    slug: 'amazon-google-disputam-cloud-governo-brasileiro',
    summary: 'O Ministério da Gestão licitou a maior contratação de computação em nuvem da administração pública federal, atraindo as gigantes americanas.',
    coverImage: img('cloud-computing-government-tech'),
    categorySlug: 'tecnologia',
    tags: ['inteligencia-artificial', 'fintech'],
    featured: false,
    daysAgo: 9,
    readTime: 6,
    viewCount: 8900,
    content: `<p>O Ministério da Gestão e Inovação em Serviços Públicos (MGI) lançou edital de licitação para a maior contratação de computação em nuvem da história do governo federal brasileiro — um contrato de R$ 8 bilhões para fornecimento de infraestrutura cloud, ferramentas de IA e serviços gerenciados por um período de cinco anos.</p>
<h2>Os concorrentes</h2>
<p>Amazon Web Services (AWS), Google Cloud e Microsoft Azure são os candidatos naturais. A Oracle entrou na disputa com uma proposta agressiva de preço, e a empresa brasileira Tivit se posiciona como opção nacional em um consórcio com a IBM. O critério técnico tem peso de 60% na avaliação, enquanto o preço responde por 40%.</p>
<h2>Soberania de dados</h2>
<p>O edital impõe condição que pode ser decisiva: todos os dados classificados como sensíveis pelo governo devem ser armazenados em data centers localizados no Brasil. A AWS é a única das três grandes que possui três zonas de disponibilidade no país, o que lhe dá vantagem técnica na cláusula de residência de dados.</p>
<h2>Impacto no setor de TI</h2>
<p>O contrato é visto como catalisador para o mercado de TI brasileiro. Especialistas estimam que o gasto adicional em qualificação de pessoal, migração de sistemas e adaptação de processos pode gerar um efeito multiplicador de até R$ 3 para cada real contratado, beneficiando empresas de médio porte do setor.</p>`,
  },
  {
    title: 'Selic deve cair a 10,5% até o fim do ano, projeta mercado',
    slug: 'selic-deve-cair-105-fim-do-ano-mercado',
    summary: 'Com inflação controlada e atividade econômica moderada, economistas esperam mais dois cortes na taxa básica de juros até dezembro.',
    coverImage: img('brazil-central-bank-monetary-policy'),
    categorySlug: 'economia',
    tags: ['juros', 'inflacao'],
    featured: false,
    daysAgo: 10,
    readTime: 4,
    viewCount: 15800,
    content: `<p>O mercado financeiro reviu para baixo as projeções para a taxa Selic ao final de 2026. A mediana do Boletim Focus, pesquisa semanal realizada pelo Banco Central com mais de 100 instituições financeiras, aponta para 10,5% ao ano em dezembro — dois cortes de 0,25 ponto percentual a partir do patamar atual de 11%.</p>
<h2>O cenário que embasa a projeção</h2>
<p>Três elementos constroem o caso para novos cortes: o IPCA de abril veio em 3,8% na leitura anualizada, abaixo do centro da meta; as expectativas de inflação para 12 meses estão ancoradas em 3,9%; e os núcleos de inflação — que excluem itens voláteis como alimentos e energia — mostram desaceleração consistente.</p>
<h2>Riscos ao cenário</h2>
<p>O principal risco doméstico é a deterioração das contas públicas. O déficit primário do governo central acumulado em 12 meses chegou a R$ 68 bilhões, acima da meta de R$ 30 bilhões estabelecida pelo novo arcabouço fiscal. Se a situação piorar, o Copom pode interromper o ciclo de cortes.</p>
<h2>Impacto na economia real</h2>
<p>Uma Selic a 10,5% representaria o menor patamar desde 2022 e teria efeito positivo sobre o crédito habitacional, o financiamento de veículos e o cartão de crédito rotativo — três dos maiores canais de transmissão da política monetária para as famílias brasileiras.</p>`,
  },
  {
    title: 'Agronegócio bate recorde de exportações com R$ 180 bi no semestre',
    slug: 'agronegocio-recorde-exportacoes-180-bi-semestre',
    summary: 'Soja, carne bovina e milho impulsionaram o setor a um novo pico histórico, com a China respondendo por 40% de todas as compras.',
    coverImage: img('agribusiness-soy-harvest-brazil'),
    categorySlug: 'negocios',
    tags: ['pib', 'cambio'],
    featured: false,
    daysAgo: 11,
    readTime: 5,
    viewCount: 11200,
    content: `<p>O agronegócio brasileiro exportou US$ 34,2 bilhões no primeiro semestre de 2026, equivalente a R$ 180 bilhões pela taxa de câmbio média do período. O resultado supera em 12% o recorde anterior, estabelecido no mesmo semestre de 2024, e confirma o setor como o principal responsável pelo superávit comercial do país.</p>
<h2>Os produtos que lideram</h2>
<p>A soja em grão respondeu por 28% do total exportado, com volume de 38 milhões de toneladas — alta de 8% sobre o ano anterior, beneficiada pela colheita recorde de 163 milhões de toneladas na safra 2025/26. A carne bovina processada foi o segundo maior item, com US$ 6,1 bilhões, impulsionada pela reabertura do mercado americano. O milho completou o pódio com US$ 4,8 bilhões.</p>
<h2>A dependência da China</h2>
<p>O principal mercado comprador continua sendo a China, responsável por 40% das exportações do agronegócio brasileiro. Especialistas alertam que essa concentração representa um risco estratégico: qualquer desaceleração na demanda chinesa ou mudança nas políticas comerciais de Pequim pode afetar significativamente o desempenho do setor.</p>`,
  },
  {
    title: 'Startups de saúde digital captam R$ 3,2 bi impulsionadas por IA médica',
    slug: 'startups-saude-digital-captam-32-bi-ia-medica',
    summary: 'Healthtechs brasileiras atraem capital recorde com soluções de diagnóstico assistido por IA, telemedicina e gestão de planos de saúde.',
    coverImage: img('healthtech-medical-ai-startup'),
    categorySlug: 'startups',
    tags: ['healthtech', 'venture-capital'],
    featured: false,
    daysAgo: 12,
    readTime: 6,
    viewCount: 7600,
    content: `<p>As startups brasileiras de saúde digital captaram R$ 3,2 bilhões nos primeiros cinco meses de 2026, segundo dados da Distrito Healthtech Report. O valor representa alta de 45% sobre todo o ano de 2025 e posiciona o Brasil como o terceiro maior mercado de healthtech do mundo em número de rodadas de investimento, atrás apenas dos EUA e da Índia.</p>
<h2>IA como diferencial competitivo</h2>
<p>A inteligência artificial é o principal driver de valorização das healthtechs. Empresas com produtos de diagnóstico assistido por IA receberam avaliações de mercado 3,2 vezes superiores às concorrentes sem essa componente, segundo análise da consultoria McKinsey. O diagnóstico de retinopatia diabética por IA, desenvolvido por uma startup de Belo Horizonte, recebeu aprovação da Anvisa e está sendo adotado em postos de saúde do SUS em cinco estados.</p>
<h2>Os unicórnios do setor</h2>
<p>Três healthtechs brasileiras hoje carregam o status de unicórnio: a Dr. Consulta (R$ 8 bi de valuation), a Omint Digital (R$ 6,5 bi) e a Alice Saúde (R$ 5,2 bi). Uma quarta empresa, a Prontmed, está em negociações avançadas para uma rodada Série D que deve colocá-la nessa categoria até o fim do ano.</p>`,
  },
  {
    title: 'China desacelera e impacto nos países emergentes preocupa FMI',
    slug: 'china-desacelera-impacto-emergentes-preocupa-fmi',
    summary: 'O crescimento do PIB chinês deve fechar 2026 em 4,2%, abaixo da meta oficial, com reflexos sobre a demanda por commodities e o fluxo de capitais.',
    coverImage: img('china-economy-slowdown-skyline'),
    categorySlug: 'internacional',
    tags: ['pib', 'cambio'],
    featured: false,
    daysAgo: 13,
    readTime: 7,
    viewCount: 13400,
    content: `<p>O Fundo Monetário Internacional (FMI) revisou para baixo sua projeção de crescimento para a China em 2026, de 4,6% para 4,2% ao ano. A revisão reflete a persistência de problemas estruturais no setor imobiliário, a fraqueza do consumo doméstico e os efeitos defasados da guerra tarifária com os Estados Unidos.</p>
<h2>Por que a desaceleração importa</h2>
<p>A China é a locomotiva da demanda global por commodities. Uma desaceleração de 1 ponto percentual no crescimento chinês está associada, historicamente, a uma queda de 5% a 8% nos preços do minério de ferro e de 3% a 5% na soja. Para o Brasil, que tem na China seu principal parceiro comercial, esse movimento pode reduzir o superávit comercial em até US$ 12 bilhões ao ano, segundo estimativas do Instituto de Pesquisa Econômica Aplicada (Ipea).</p>
<h2>A resposta de Pequim</h2>
<p>O governo chinês anunciou um pacote de estímulos fiscais de US$ 280 bilhões, focado em infraestrutura verde e digitalização da indústria. Analistas, porém, avaliam que as medidas são insuficientes para reverter a tendência estrutural de menor crescimento, que reflete o esgotamento do modelo baseado em exportações e investimento em capital fixo.</p>`,
  },
  {
    title: 'Mercado de trabalho aquecido pressiona salários e divide economistas',
    slug: 'mercado-trabalho-aquecido-pressiona-salarios',
    summary: 'A taxa de desemprego no Brasil atingiu 6,1%, menor patamar em 12 anos. Para uns, é sinal de prosperidade; para outros, risco inflacionário.',
    coverImage: img('brazil-employment-job-market'),
    categorySlug: 'economia',
    tags: ['inflacao', 'pib'],
    featured: false,
    daysAgo: 14,
    readTime: 5,
    viewCount: 18900,
    content: `<p>A Pesquisa Nacional por Amostra de Domicílios Contínua (PNAD Contínua) do IBGE revelou que a taxa de desemprego no Brasil caiu para 6,1% no trimestre encerrado em abril de 2026 — o menor nível em 12 anos. O resultado surpreendeu positivamente o mercado, que esperava 6,5%, e desencadeou um debate entre economistas sobre as implicações para a inflação e para a política monetária.</p>
<h2>O que está por trás da queda</h2>
<p>A expansão do setor de serviços lidera a criação de empregos formais, com destaque para tecnologia da informação, saúde e turismo. O agronegócio também contribuiu com geração de postos sazonais durante a colheita recorde. A formalização acelerada — impulsionada pelo MEI e pela fiscalização ampliada — elevou a proporção de trabalhadores com carteira assinada para 58%, novo recorde.</p>
<h2>A preocupação inflacionária</h2>
<p>O salário médio real cresceu 4,2% em 12 meses, acima da inflação do período. Para economistas mais hawkish, esse movimento de salários é um sinal de alerta para pressões inflacionárias futuras, especialmente nos setores de serviços intensivos em mão de obra. O risco é um ciclo de espiral salário-preço que obrigue o Banco Central a reverter o ciclo de cortes de juros.</p>`,
  },
]

async function main() {
  console.log('Iniciando seed do banco de dados...')

  const defaultPasswordHash = await bcrypt.hash('Senha123!', 10)

  console.log('Criando categorias...')
  const categories = await Promise.all(
    CATEGORIES.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      })
    )
  )
  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]))
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
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t]))
  console.log(tags.length + ' tags criadas')

  console.log('Criando usuários...')
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

  const redator1 = await prisma.user.upsert({
    where: { email: 'redator1@exame.com' },
    update: {},
    create: {
      name: 'Fábio Andrade',
      email: 'redator1@exame.com',
      password: defaultPasswordHash,
      role: Role.REDATOR,
      bio: 'Redatór especializado em startups e inovação',
      emailVerified: true,
    },
  })

  const redator2 = await prisma.user.upsert({
    where: { email: 'redator2@exame.com' },
    update: {},
    create: {
      name: 'Juliana Lima',
      email: 'redator2@exame.com',
      password: defaultPasswordHash,
      role: Role.REDATOR,
      bio: 'Redatora de mercados financeiros',
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
          name: ['João Silva', 'Maria Santos', 'Pedro Alves', 'Lúcia Ferreira', 'Rafael Oliveira'][i],
          email,
          password: defaultPasswordHash,
          role: Role.USER,
          emailVerified: true,
        },
      })
    )
  )
  console.log((users.length + 5) + ' usuários criados')

  console.log('Criando artigos...')
  const authors = [admin, editor1, editor2, redator1, redator2]
  let articleCount = 0

  for (const [i, art] of ARTICLES.entries()) {
    const category = catMap[art.categorySlug]
    if (!category) continue
    const author = authors[i % authors.length]
    const articleTags = art.tags
      .map((t) => tagMap[t])
      .filter(Boolean)

    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        coverImage: art.coverImage,
        viewCount: art.viewCount,
      },
      create: {
        title: art.title,
        slug: art.slug,
        content: art.content,
        summary: art.summary,
        coverImage: art.coverImage,
        aiSummary: `Resumo gerado por IA: ${art.summary}`,
        status: ArticleStatus.PUBLISHED,
        featured: art.featured,
        publishedAt: new Date(Date.now() - art.daysAgo * 24 * 60 * 60 * 1000),
        readTime: art.readTime,
        viewCount: art.viewCount,
        authorId: author.id,
        categoryId: category.id,
        tags: {
          create: articleTags.map((tag) => ({
            tag: { connect: { id: tag.id } },
          })),
        },
      },
    })
    articleCount++
  }
  console.log(articleCount + ' artigos criados')

  console.log('Criando comentários...')
  const allArticles = await prisma.article.findMany({ take: 8 })
  const COMMENTS = [
    'Análise excelente! Muito relevante para o cenário atual.',
    'Ótima cobertura. Ficou faltando abordar o impacto nas PMEs.',
    'Importante perspectiva. Compartilhando com meu time.',
    'Dados muito interessantes. Parabéns pela apuração.',
    'Esse tema merecia uma cobertura mais aprofundada ainda.',
  ]
  let commentCount = 0
  for (const article of allArticles.slice(0, 6)) {
    for (const user of [...users.slice(0, 3), editor1]) {
      const comment = await prisma.comment.create({
        data: {
          content: COMMENTS[commentCount % COMMENTS.length],
          userId: user.id,
          articleId: article.id,
        },
      })
      commentCount++
      await prisma.comment.create({
        data: {
          content: 'Concordo completamente! Perspectiva muito pertinente.',
          userId: users[commentCount % users.length].id,
          articleId: article.id,
          parentId: comment.id,
        },
      })
      commentCount++
    }
  }
  console.log(commentCount + ' comentários criados')

  console.log('Criando favoritos...')
  for (const user of users.slice(0, 3)) {
    for (const article of allArticles.slice(0, 5)) {
      await prisma.favorite.upsert({
        where: { userId_articleId: { userId: user.id, articleId: article.id } },
        update: {},
        create: { userId: user.id, articleId: article.id },
      })
    }
  }
  console.log('Favoritos criados')

  console.log('\nSeed concluído com sucesso!')
  console.log('---')
  console.log('Admin:    admin@exame.com / Senha123!')
  console.log('Editor1:  editor1@exame.com / Senha123!  (EDITOR)')
  console.log('Editor2:  editor2@exame.com / Senha123!  (EDITOR)')
  console.log('Redator1: redator1@exame.com / Senha123! (REDATOR)')
  console.log('Redator2: redator2@exame.com / Senha123! (REDATOR)')
  console.log('User:     joao@email.com / Senha123!     (USER)')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


