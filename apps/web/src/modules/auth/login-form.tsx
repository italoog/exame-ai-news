'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { api } from '@/shared/lib/api'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    setError('')
    try {
      const { data: response } = await api.post('/auth/login', data)
      const { accessToken } = response.data ?? response

      localStorage.setItem('access_token', accessToken)

      const { data: userResponse } = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const user = userResponse.data ?? userResponse

      setUser(user, accessToken)
      router.push('/')
    } catch {
      setError('E-mail ou senha incorretos')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1.5">E-mail</label>
        <input
          {...register('email')}
          type="email"
          placeholder="seu@email.com"
          className="w-full px-4 py-3 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="block text-sm font-medium text-zinc-700">Senha</label>
          <Link href="/auth/forgot-password" className="text-xs text-red-600 hover:text-red-700">
            Esqueceu a senha?
          </Link>
        </div>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-11 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
        ) : (
          'Entrar'
        )}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Não tem conta?{' '}
        <Link href="/auth/register" className="text-red-600 hover:text-red-700 font-semibold">
          Criar conta grátis
        </Link>
      </p>
    </form>
  )
}
