'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, User, LogOut, Settings, Bookmark, Edit2 } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth.store';
import { api } from '@/shared/lib/api';
import { CATEGORIES } from '@/shared/lib/categories';

const NAV_LINKS = CATEGORIES.map((c) => ({ label: c.name, href: `/categories/${c.slug}` }));

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  async function handleLogout() {
    try {
      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } catch {
      // best-effort — invalida localmente mesmo se a chamada falhar
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      clearAuth();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2">
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              EXAME <span className="text-red-600">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/search"
              className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Link>
            {isAuthenticated && (
              <Link
                href="/favorites"
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                title="Artigos salvos"
              >
                <Bookmark className="h-5 w-5" />
              </Link>
            )}
            {isAuthenticated &&
              (user?.role === 'EDITOR' || user?.role === 'ADMIN' || user?.role === 'REDATOR') && (
                <Link
                  href="/editor"
                  className="hidden items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-600 dark:hover:text-red-400 sm:flex"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  {user?.role === 'REDATOR' ? 'Meus Textos' : 'Editor'}
                </Link>
              )}
            {isAuthenticated ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    {user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt={user.name ?? ''}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {user?.name?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden max-w-24 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:block">
                    {user?.name}
                  </span>
                </button>
                <div className="invisible absolute right-0 top-full mt-1 w-52 rounded-xl border border-zinc-200 bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="p-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <User className="h-4 w-4" /> Meu Perfil
                    </Link>
                    {(user?.role === 'EDITOR' ||
                      user?.role === 'ADMIN' ||
                      user?.role === 'REDATOR') && (
                      <>
                        <Link
                          href="/editor"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          <Edit2 className="h-4 w-4" /> Meus Artigos
                        </Link>
                        <Link
                          href="/editor/new"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        >
                          <Settings className="h-4 w-4" /> Novo Artigo
                        </Link>
                      </>
                    )}
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        <Settings className="h-4 w-4" /> Painel Admin
                      </Link>
                    )}
                    <hr className="my-1 border-zinc-100 dark:border-zinc-700" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4" /> Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  Cadastrar
                </Link>
              </div>
            )}
            <button
              className="rounded-lg p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-zinc-100 py-3 dark:border-zinc-800 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {(user?.role === 'EDITOR' || user?.role === 'ADMIN' || user?.role === 'REDATOR') && (
              <Link
                href="/editor"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => setMobileOpen(false)}
              >
                Editor de Artigos
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
