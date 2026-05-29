import type { Metadata } from 'next'
import FavoritesClient from './favorites-client'

export const metadata: Metadata = {
  title: 'Salvos | EXAME AI NEWS',
}

export default function FavoritesPage() {
  return <FavoritesClient />
}
