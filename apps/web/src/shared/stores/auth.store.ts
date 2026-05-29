import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'REDATOR' | 'EDITOR' | 'ADMIN'
  avatar?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setUser: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setUser: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'exame-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

/** Retorna true apenas após o Zustand hidratar o store do localStorage */
export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    // persist adiciona getState().rehydrate — o subscribe detecta o fim da hidratação
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    // Se já hidratou antes deste efeito rodar
    if (useAuthStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])
  return hydrated
}
