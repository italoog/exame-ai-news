'use client'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  useAdminUsers,
  useUpdateUserRole,
  type AdminUser,
  type UserRole,
} from '@/shared/hooks/use-admin'
import { Edit2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const ROLE_STYLE: Record<UserRole, string> = {
  ADMIN: 'text-red-600 bg-red-50',
  EDITOR: 'text-purple-600 bg-purple-50',
  REDATOR: 'text-blue-600 bg-blue-50',
  USER: 'text-zinc-600 bg-zinc-100',
}

const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Admin',
  EDITOR: 'Editor',
  REDATOR: 'Redator',
  USER: 'Leitor',
}

const ROLE_OPTIONS: UserRole[] = ['USER', 'REDATOR', 'EDITOR', 'ADMIN']

export default function AdminUsersClient() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminUsers(page)
  const updateRole = useUpdateUserRole()
  const [editingId, setEditingId] = useState<string | null>(null)

  const users = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Usuários</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {meta?.total ?? 0} usuários cadastrados
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Usuário
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Role
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
                Cadastro
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-100">
                    <td className="px-4 py-3" colSpan={5}>
                      <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              : users.map((user: AdminUser) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-semibold flex-shrink-0">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-zinc-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-zinc-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === user.id ? (
                        <select
                          defaultValue={user.role}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            updateRole.mutate({
                              userId: user.id,
                              role: (e.target as HTMLSelectElement).value as UserRole,
                            })
                            setEditingId(null)
                          }}
                          onBlur={() => setEditingId(null)}
                          autoFocus
                          className="text-xs border border-zinc-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-600"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {ROLE_LABEL[role]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_STYLE[user.role]}`}
                        >
                          {ROLE_LABEL[user.role]}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-zinc-500 text-xs">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setEditingId(editingId === user.id ? null : user.id)
                        }
                        className="p-1.5 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="Alterar role"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded border border-zinc-200 text-sm disabled:opacity-40 hover:border-primary-600 transition-colors"
          >
            Anterior
          </button>
          <span className="px-4 py-2 text-sm text-zinc-500">
            {page} / {meta.totalPages}
          </span>
          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded border border-zinc-200 text-sm disabled:opacity-40 hover:border-primary-600 transition-colors"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
