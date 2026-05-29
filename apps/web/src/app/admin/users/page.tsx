import type { Metadata } from 'next'
import AdminUsersClient from './admin-users-client'

export const metadata: Metadata = { title: 'Usuários | Admin' }

export default function AdminUsersPage() {
  return <AdminUsersClient />
}
