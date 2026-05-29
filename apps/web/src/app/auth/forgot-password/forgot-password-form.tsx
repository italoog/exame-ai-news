'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { api } from '@/shared/lib/api'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      await api.post('/auth/forgot-password', data)
      setSentEmail(data.email)
      setSent(true)
    } catch {
      // Mesmo com erro, não revelamos se o email existe
      setSentEmail(data.email)
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Verifique seu e-mail</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Se <strong className="text-zinc-700 dark:text-zinc-300">{sentEmail}</strong> estiver
          cadastrado, você receberá as instruções para redefinir sua senha em breve.
        </p>
        <p className="text-xs text-zinc-400">Não recebeu? Verifique a caixa de spam.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            {...register('email')}
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-[#E10600] text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
      </button>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao login
        </Link>
      </div>
    </form>
  )
}
