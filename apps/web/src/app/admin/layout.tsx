'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import {
  LayoutDashboard,
  Newspaper,
  Users,
  BarChart3,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/articles', label: 'Artigos', icon: Newspaper, exact: false },
  { href: '/admin/users', label: 'Usuários', icon: Users, exact: false },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, exact: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const pathname = usePathname()

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500">Acesso restrito a administradores.</p>
      </div>
    )
  }

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
