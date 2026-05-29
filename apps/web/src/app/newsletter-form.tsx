'use client'
import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { api } from '@/shared/lib/api'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.post('/newsletter/subscribe', { email })
      setStatus('success')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      setErrorMsg(msg ?? 'Erro ao inscrever. Tente novamente.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3">
        <CheckCircle className="w-10 h-10 text-green-400" />
        <p className="text-white font-semibold text-lg">Inscrição confirmada!</p>
        <p className="text-zinc-400 text-sm">Verifique seu e-mail para o link de boas-vindas.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus('idle') }}
        placeholder="seu@email.com"
        required
        className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-lg text-sm focus:outline-none focus:border-red-500"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors whitespace-nowrap flex items-center gap-2"
      >
        {status === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Inscrevendo...</> : 'Assinar grátis'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs sm:col-span-2 text-center w-full">{errorMsg}</p>
      )}
    </form>
  )
}
