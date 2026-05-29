import type { Metadata } from 'next'
import ProfileClient from './profile-client'

export const metadata: Metadata = {
  title: 'Perfil | EXAME AI NEWS',
}

export default function ProfilePage() {
  return <ProfileClient />
}
