'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore, useAuthHydrated } from '@/shared/stores/auth.store'
import {
  LayoutDashboard,
  Newspaper,
  Users,
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

  useEffect(() => {
    if (!hydrated) return
    if (!user) { router.replace('/auth/login'); return }
    if (user.role !== 'ADMIN') router.replace('/')
  }, [hydrated, user, router])

  // Aguarda hidratação
  if (!hydrated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user.role !== 'ADMIN') return null

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="w-56 bg-white border-r border-zinc-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-zinc-200">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Administração
          </p>
        </div>
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
