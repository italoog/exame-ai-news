import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">E</span>
              </div>
              <span className="font-black text-white text-xl tracking-tight">
                EXAME <span className="text-red-500">AI</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Plataforma inteligente de notícias para o mundo dos negócios.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Editorias</h4>
            <ul className="space-y-2 text-sm">
              {['Tecnologia', 'Economia', 'Mercados', 'Startups', 'ESG'].map((cat) => (
                <li key={cat}>
                  <Link href={`/categories/${cat.toLowerCase()}`} className="hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">Sobre</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Criar conta</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Entrar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Termos</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-10 pt-6 text-sm text-center">
          © {year} EXAME AI NEWS. Plataforma demonstrativa.
        </div>
      </div>
    </footer>
  )
}
