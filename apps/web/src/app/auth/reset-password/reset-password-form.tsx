'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { api } from '@/shared/lib/api'

const schema = z
  .object({
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirm: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: 'As senhas não coincidem',
    path: ['confirm'],
  })
type FormData = z.infer<typeof schema>

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!token) setErrorMsg('Token inválido ou ausente. Solicite um novo link.')
  }, [token])

  async function onSubmit(data: FormData) {
    setErrorMsg('')
    try {
      await api.post('/auth/reset-password', { token, password: data.password })
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 3000)
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      setErrorMsg(message ?? 'Erro ao redefinir senha. O link pode ter expirado.')
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Senha redefinida!</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Você será redirecionado para o login em instantes...
        </p>
        <Link href="/auth/login" className="text-sm text-red-600 hover:text-red-700 font-medium">
          Ir para o login
        </Link>
      </div>
    )
  }

  if (!token || errorMsg) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <p className="text-sm text-red-600">{errorMsg}</p>
        <Link href="/auth/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
          Solicitar novo link
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Nova senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            {...register('password')}
            type={showPass ? 'text' : 'password'}
            placeholder="Mínimo 6 caracteres"
            className="w-full pl-10 pr-10 py-2.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Confirmar nova senha
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            {...register('confirm')}
            type={showConfirm ? 'text' : 'password'}
            placeholder="Repita a senha"
            className="w-full pl-10 pr-10 py-2.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirm && <p className="text-xs text-red-600 mt-1">{errors.confirm.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-[#E10600] text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
      </button>
    </form>
  )
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div className="text-center text-zinc-500 text-sm py-4">Carregando...</div>}>
      <ResetForm />
    </Suspense>
  )
}
