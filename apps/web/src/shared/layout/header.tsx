'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, User, LogOut, Settings, Bookmark, Edit2 } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { api } from '@/shared/lib/api'

const NAV_LINKS = [
  { label: 'Tecnologia', href: '/categories/tecnologia' },
  { label: 'Economia', href: '/categories/economia' },
  { label: 'Mercados', href: '/categories/mercados' },
  { label: 'Startups', href: '/categories/startups' },
  { label: 'Negócios', href: '/categories/negocios' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, clearAuth } = useAuthStore()

  async function handleLogout() {
    try {
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token')
        : null
      if (refreshToken) await api.post('/auth/logout', { refreshToken })
    } catch {
      // best-effort — invalida localmente mesmo se a chamada falhar
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      clearAuth()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="font-black text-zinc-900 dark:text-white text-xl tracking-tight">
              EXAME <span className="text-red-600">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link href="/search" className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            {isAuthenticated && (
              <Link href="/favorites" className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Artigos salvos">
                <Bookmark className="w-5 h-5" />
              </Link>
            )}
            {(isAuthenticated && (user?.role === 'EDITOR' || user?.role === 'ADMIN' || user?.role === 'REDATOR')) && (
              <Link href="/editor" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-red-300 dark:hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
                {user?.role === 'REDATOR' ? 'Meus Textos' : 'Editor'}
              </Link>
            )}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                    {user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name ?? ''} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{user?.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-24 truncate">{user?.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  <div className="p-1">
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg"><User className="w-4 h-4" /> Meu Perfil</Link>
                    {(user?.role === 'EDITOR' || user?.role === 'ADMIN' || user?.role === 'REDATOR') && (
                      <>
                        <Link href="/editor" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg"><Edit2 className="w-4 h-4" /> Meus Artigos</Link>
                        <Link href="/editor/new" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg"><Settings className="w-4 h-4" /> Novo Artigo</Link>
                      </>
                    )}
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg"><Settings className="w-4 h-4" /> Painel Admin</Link>
                    )}
                    <hr className="my-1 border-zinc-100 dark:border-zinc-700" />
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white">Entrar</Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors">Cadastrar</Link>
              </div>
            )}
            <button className="md:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800 py-3">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {(user?.role === 'EDITOR' || user?.role === 'ADMIN' || user?.role === 'REDATOR') && (
              <Link href="/editor" className="block px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg" onClick={() => setMobileOpen(false)}>
                Editor de Artigos
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
