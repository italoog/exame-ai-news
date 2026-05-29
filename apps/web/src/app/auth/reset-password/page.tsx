import type { Metadata } from 'next'
import ResetPasswordForm from './reset-password-form'

export const metadata: Metadata = { title: 'Nova Senha | EXAME AI NEWS' }

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-black text-zinc-900 dark:text-white text-2xl tracking-tight">
              EXAME <span className="text-red-600">AI</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Nova senha</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Escolha uma senha segura</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-8">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
