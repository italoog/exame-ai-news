'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore, useAuthHydrated } from '@/shared/stores/auth.store'
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles', label: 'Artigos', icon: Newspaper, exact: false },
  { href: '/admin/users', label: 'Usuários', icon: Users, exact: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const hydrated = useAuthHydrated()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!user) { router.replace('/auth/login'); return }
    if (user.role !== 'ADMIN') router.replace('/')
  }, [hydrated, user, router])

  // Fecha sidebar ao navegar no mobile
  useEffect(() => { setSidebarOpen(false) }, [pathname])

  if (!hydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user.role !== 'ADMIN') return null

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Administração</p>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-zinc-400 hover:text-zinc-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <NavContent />
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex flex-col transform transition-transform duration-200 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Administração</span>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
