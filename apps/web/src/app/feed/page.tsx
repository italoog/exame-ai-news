import type { Metadata } from 'next'
import FeedClient from './feed-client'

export const metadata: Metadata = {
  title: 'Feed | EXAME AI NEWS',
  description: 'Seu feed personalizado de notícias',
}

export default function FeedPage() {
  return <FeedClient />
}
