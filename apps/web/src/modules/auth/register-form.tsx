'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { api } from '@/shared/lib/api'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    setError('')
    try {
      const { data: response } = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })

      const { accessToken } = response.data ?? response
      localStorage.setItem('access_token', accessToken)

      const { data: userResponse } = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setUser(userResponse.data ?? userResponse, accessToken)
      router.push('/')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message ?? 'Erro ao criar conta. Tente novamente.')
    }
  }

  const inputClass =
    'w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Nome completo</label>
        <input {...register('name')} placeholder="João Silva" className={inputClass} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">E-mail</label>
        <input {...register('email')} type="email" placeholder="seu@email.com" className={inputClass} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Senha</label>
        <input {...register('password')} type="password" placeholder="Mínimo 8 caracteres" className={inputClass} />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Confirmar senha</label>
        <input {...register('confirmPassword')} type="password" placeholder="Repita a senha" className={inputClass} />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Criando conta...</>
        ) : (
          'Criar conta grátis'
        )}
      </button>
    </form>
  )
}
