import type { Metadata } from 'next'
import AdminDashboardClient from './dashboard-client'

export const metadata: Metadata = { title: 'Admin | EXAME AI NEWS' }

export default function AdminPage() {
  return <AdminDashboardClient />
}
