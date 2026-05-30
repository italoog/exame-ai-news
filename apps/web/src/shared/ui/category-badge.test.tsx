import React from 'react'
import { render, screen } from '@testing-library/react'
import { CategoryBadge } from './category-badge'

// next/link não precisa de mock no jsdom com next/jest
describe('CategoryBadge', () => {
  it('deve renderizar o nome da categoria', () => {
    render(<CategoryBadge name="Tecnologia" slug="tecnologia" />)
    expect(screen.getByText('Tecnologia')).toBeInTheDocument()
  })

  it('deve gerar href correto com o slug', () => {
    render(<CategoryBadge name="Política" slug="politica" />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/categories/politica')
  })

  it('deve aplicar className customizada', () => {
    render(<CategoryBadge name="Esportes" slug="esportes" className="minha-classe" />)
    const link = screen.getByRole('link')
    expect(link.className).toContain('minha-classe')
  })
})
