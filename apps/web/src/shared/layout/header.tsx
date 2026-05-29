'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X, User, LogOut, Settings, Bookmark } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'

const NAV_LINKS = [
  { label: 'Tecnologia', href: '/categories/tecnologia' },
  { label: 'Economia', href: '/categories/economia' },
  { label: 'Mercados', href: '/categories/mercados' },
  { label: 'Startups', href: '/categories/startups' },
  { label: 'ESG', href: '/categories/esg' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isAuthenticated, clearAuth } = useAuthStore()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="font-black text-zinc-900 text-xl tracking-tight">
              EXAME <span className="text-red-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {isAuthenticated && (
              <Link
                href="/favorites"
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
                title="Artigos salvos"
              >
                <Bookmark className="w-5 h-5" />
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors">
                  <div className="w-7 h-7 bg-zinc-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-zinc-600">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-zinc-700 max-w-24 truncate">
                    {user?.name}
                  </span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 rounded-xl shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  <div className="p-1">
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg">
                      <User className="w-4 h-4" /> Meu Perfil
                    </Link>
                    {(user?.role === 'EDITOR' || user?.role === 'ADMIN') && (
                      <Link href="/editor/new" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg">
                        <Settings className="w-4 h-4" /> Editor
                      </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg">
                        <Settings className="w-4 h-4" /> Admin
                      </Link>
                    )}
                    <hr className="my-1 border-zinc-100" />
                    <button
                      onClick={clearAuth}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-100 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
