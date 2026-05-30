import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FavoriteButton } from './favorite-button'

// Captura do mock push compartilhado (variável começa com 'mock' para hoisting)
const mockRouterPush = jest.fn()

// Mock dos módulos externos ao componente
jest.mock('@/shared/stores/auth.store', () => ({
  useAuthStore: jest.fn(),
}))
jest.mock('@/shared/hooks/use-favorites', () => ({
  useCheckFavorite: jest.fn(),
  useToggleFavorite: jest.fn(),
}))
jest.mock('@/shared/ui/toast', () => ({
  toast: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockRouterPush })),
}))

import { useAuthStore } from '@/shared/stores/auth.store'
import { useCheckFavorite, useToggleFavorite } from '@/shared/hooks/use-favorites'

const mockUseAuthStore = useAuthStore as jest.Mock
const mockUseCheckFavorite = useCheckFavorite as jest.Mock
const mockUseToggleFavorite = useToggleFavorite as jest.Mock

describe('FavoriteButton', () => {
  const mockMutateAsync = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthStore.mockReturnValue({ user: { id: 'u1', name: 'João' } })
    mockUseCheckFavorite.mockReturnValue({ data: { favorited: false } })
    mockUseToggleFavorite.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  it('deve renderizar com texto "Salvar" quando não é favorito', () => {
    render(<FavoriteButton articleId="a1" />)
    expect(screen.getByText('Salvar')).toBeInTheDocument()
  })

  it('deve renderizar com texto "Salvo" quando já é favorito', () => {
    mockUseCheckFavorite.mockReturnValue({ data: { favorited: true } })
    render(<FavoriteButton articleId="a1" />)
    expect(screen.getByText('Salvo')).toBeInTheDocument()
  })

  it('deve chamar mutateAsync ao clicar quando usuário está logado', async () => {
    mockMutateAsync.mockResolvedValue({ favorited: true })
    render(<FavoriteButton articleId="a1" />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith('a1')
    })
  })

  it('deve redirecionar para login quando usuário não está autenticado', () => {
    mockUseAuthStore.mockReturnValue({ user: null })

    render(<FavoriteButton articleId="a1" />)
    fireEvent.click(screen.getByRole('button'))

    expect(mockRouterPush).toHaveBeenCalledWith('/auth/login')
  })

  it('deve desabilitar o botão enquanto está pendente', () => {
    mockUseToggleFavorite.mockReturnValue({ mutateAsync: mockMutateAsync, isPending: true })
    render(<FavoriteButton articleId="a1" />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
