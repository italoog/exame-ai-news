import type { Metadata } from 'next'
import { LoginForm } from '@/modules/auth/login-form'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-black text-zinc-900 text-2xl tracking-tight">
              EXAME <span className="text-red-600">AI</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Bem-vindo de volta</h1>
          <p className="text-zinc-500 mt-1">Entre com sua conta para continuar</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
