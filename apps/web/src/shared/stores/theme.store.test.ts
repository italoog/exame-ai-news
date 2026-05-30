import { useThemeStore } from './theme.store'

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' })
  })

  describe('toggleTheme()', () => {
    it('deve alternar de light para dark', () => {
      useThemeStore.getState().toggleTheme()
      expect(useThemeStore.getState().theme).toBe('dark')
    })

    it('deve alternar de dark para light', () => {
      useThemeStore.setState({ theme: 'dark' })
      useThemeStore.getState().toggleTheme()
      expect(useThemeStore.getState().theme).toBe('light')
    })

    it('deve alternar múltiplas vezes corretamente', () => {
      useThemeStore.getState().toggleTheme() // → dark
      useThemeStore.getState().toggleTheme() // → light
      useThemeStore.getState().toggleTheme() // → dark
      expect(useThemeStore.getState().theme).toBe('dark')
    })
  })

  it('deve iniciar com tema light por padrão', () => {
    expect(useThemeStore.getState().theme).toBe('light')
  })
})
