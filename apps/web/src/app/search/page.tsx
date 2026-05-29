import type { Metadata } from 'next'
import { Suspense } from 'react'
import SearchClient from './search-client'

export const metadata: Metadata = {
  title: 'Buscar | EXAME AI NEWS',
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  )
}
