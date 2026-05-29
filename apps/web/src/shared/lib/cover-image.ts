const CATEGORY_SEEDS: Record<string, string> = {
  tecnologia: 'technology-digital',
  economia: 'economy-finance',
  mercados: 'stock-market-trading',
  startups: 'startup-entrepreneurship',
  negocios: 'business-corporate',
  esg: 'sustainability-green',
  internacional: 'world-global',
  politica: 'government-politics',
  saude: 'health-medicine',
  inovacao: 'innovation-future',
  educacao: 'education-learning',
}

export function getCoverImage(slug: string, categorySlug?: string): string {
  const seed = categorySlug
    ? (CATEGORY_SEEDS[categorySlug] ?? categorySlug)
    : slug
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`
}

export function getCoverImageThumb(slug: string, categorySlug?: string): string {
  const seed = categorySlug
    ? (CATEGORY_SEEDS[categorySlug] ?? categorySlug)
    : slug
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`
}
