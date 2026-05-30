import { useAuthStore } from './auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store entre testes
    useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false })
  })

  describe('setUser()', () => {
    it('deve autenticar o usuário e salvar token', () => {
      const user = { id: 'u1', name: 'João', email: 'joao@test.com', role: 'USER' as const }

      useAuthStore.getState().setUser(user, 'jwt-token-123')

      const state = useAuthStore.getState()
      expect(state.user).toEqual(user)
      expect(state.accessToken).toBe('jwt-token-123')
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('clearAuth()', () => {
    it('deve limpar o estado de autenticação', () => {
      const user = { id: 'u1', name: 'João', email: 'joao@test.com', role: 'USER' as const }
      useAuthStore.setState({ user, accessToken: 'token', isAuthenticated: true })

      useAuthStore.getState().clearAuth()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})
