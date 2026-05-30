import React from 'react'
import { render } from '@testing-library/react'
import { Skeleton, ArticleCardSkeleton } from './skeleton'

describe('Skeleton', () => {
  it('deve renderizar com classe animate-pulse', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('deve aceitar className customizada', () => {
    const { container } = render(<Skeleton className="h-4 w-full" />)
    expect(container.firstChild).toHaveClass('h-4', 'w-full')
  })
})

describe('ArticleCardSkeleton', () => {
  it('deve renderizar múltiplos elementos de skeleton', () => {
    const { container } = render(<ArticleCardSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(1)
  })
})
