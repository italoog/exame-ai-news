import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-black text-zinc-900 mb-4">404</h1>
        <p className="text-zinc-500 mb-8">Página não encontrada</p>
        <Link href="/" className="text-red-600 hover:text-red-700 font-semibold">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
