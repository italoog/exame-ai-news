import type { Metadata } from 'next'
import EditorForm from '../editor-form'

export const metadata: Metadata = {
  title: 'Novo Artigo | EXAME AI NEWS',
}

export default function NewArticlePage() {
  return <EditorForm />
}
