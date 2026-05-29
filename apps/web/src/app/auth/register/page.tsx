import type { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from '@/modules/auth/register-form'

export const metadata: Metadata = { title: 'Criar conta' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <span className="font-black text-zinc-900 text-2xl tracking-tight">
              EXAME <span className="text-red-600">AI</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Crie sua conta</h1>
          <p className="text-zinc-500 mt-1">Comece a ler notícias com inteligência artificial</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
          <RegisterForm />
        </div>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-red-600 hover:text-red-700 font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
