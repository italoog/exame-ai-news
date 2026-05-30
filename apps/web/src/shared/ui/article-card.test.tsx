import React from 'react'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from './article-card'

// next/image é automaticamente mockado pelo next/jest
// next/link também é mockado

const mockArticle = {
  id: 'a1',
  title: 'Artigo de Teste',
  slug: 'artigo-de-teste',
  summary: 'Resumo breve do artigo.',
  coverImage: null,
  publishedAt: new Date('2024-01-15T12:00:00').toISOString(),
  readTime: 5,
  viewCount: 100,
  author: { name: 'Autor Teste', avatar: null },
  category: { name: 'Tecnologia', slug: 'tecnologia', color: '#ff0000' },
}

describe('ArticleCard', () => {
  it('deve renderizar o título do artigo', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Artigo de Teste')).toBeInTheDocument()
  })

  it('deve renderizar o nome da categoria', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Tecnologia')).toBeInTheDocument()
  })

  it('deve renderizar o nome do autor', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText('Autor Teste')).toBeInTheDocument()
  })

  it('deve gerar href com slug correto', () => {
    render(<ArticleCard article={mockArticle} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/articles/artigo-de-teste')
  })

  it('deve renderizar com variante horizontal', () => {
    const { container } = render(<ArticleCard article={mockArticle} variant="horizontal" />)
    // Variante horizontal renderiza um link como raiz
    expect(container.querySelector('a')).toBeInTheDocument()
  })

  it('deve renderizar com variante featured', () => {
    render(<ArticleCard article={mockArticle} variant="featured" />)
    expect(screen.getByText('Artigo de Teste')).toBeInTheDocument()
  })

  it('deve renderizar tempo de leitura quando fornecido', () => {
    render(<ArticleCard article={mockArticle} />)
    expect(screen.getByText(/5 min/i)).toBeInTheDocument()
  })
})
