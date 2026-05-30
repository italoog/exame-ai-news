import React from 'react'
import { render, act } from '@testing-library/react'
import { toast, ToastProvider } from './toast'

describe('toast()', () => {
  it('deve chamar _addToast quando ToastProvider está montado', () => {
    const { getByText } = render(<ToastProvider />)

    act(() => {
      toast('Operação realizada com sucesso!')
    })

    expect(getByText('Operação realizada com sucesso!')).toBeInTheDocument()
  })

  it('deve exibir toast de erro com mensagem correta', () => {
    const { getByText } = render(<ToastProvider />)

    act(() => {
      toast('Erro ao processar.', 'error')
    })

    expect(getByText('Erro ao processar.')).toBeInTheDocument()
  })

  it('deve não lançar erro quando chamado sem ToastProvider', () => {
    expect(() => toast('mensagem sem provider')).not.toThrow()
  })
})
