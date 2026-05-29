import type { Metadata } from 'next'
import AdminArticlesClient from './admin-articles-client'

export const metadata: Metadata = { title: 'Artigos | Admin' }

export default function AdminArticlesPage() {
  return <AdminArticlesClient />
}
