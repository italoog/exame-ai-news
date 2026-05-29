import type { Metadata } from 'next'
import CategoryClient from './category-client'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug} | EXAME AI NEWS`,
    description: `Artigos sobre ${params.slug}`,
  }
}

export default function CategoryPage({ params }: Props) {
  return <CategoryClient slug={params.slug} />
}
