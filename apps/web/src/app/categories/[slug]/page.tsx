import type { Metadata } from 'next'
import CategoryClient from './category-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug} | EXAME AI NEWS`,
    description: `Artigos sobre ${slug}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  return <CategoryClient slug={slug} />
}
