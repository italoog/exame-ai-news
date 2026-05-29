import type { Metadata } from 'next'
import MyArticlesClient from './my-articles-client'

export const metadata: Metadata = {
  title: 'Meus Artigos | EXAME AI NEWS',
}

export default function EditorPage() {
  return <MyArticlesClient />
}
