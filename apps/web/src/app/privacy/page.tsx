import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade | EXAME AI NEWS',
  description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais na plataforma EXAME AI NEWS.',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-600 transition-colors">
          ← Voltar ao início
        </Link>
      </div>

      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
        Política de Privacidade
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
        Última atualização: 29 de maio de 2026
      </p>

      <div className="prose prose-zinc dark:prose-invert prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-p:leading-7 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 max-w-none">

        <p>
          A EXAME AI NEWS (&quot;Plataforma&quot;, &quot;nós&quot;) respeita a privacidade dos seus usuários e está comprometida com a proteção dos dados pessoais tratados em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>

        <h2>1. Dados coletados</h2>
        <p>Coletamos os seguintes dados ao utilizar a Plataforma:</p>
        <ul>
          <li><strong>Cadastro:</strong> nome, endereço de e-mail e senha (armazenada com hash bcrypt).</li>
          <li><strong>Uso:</strong> artigos lidos, favoritos salvos, comentários publicados e tempo de leitura (para personalização de conteúdo).</li>
          <li><strong>Técnicos:</strong> endereço IP, tipo de navegador e cookies de sessão necessários para autenticação.</li>
        </ul>

        <h2>2. Finalidade do tratamento</h2>
        <p>Os dados são utilizados exclusivamente para:</p>
        <ul>
          <li>Autenticar e gerenciar sua conta na Plataforma.</li>
          <li>Personalizar o feed de notícias e recomendações via inteligência artificial.</li>
          <li>Melhorar a qualidade e relevância do conteúdo publicado.</li>
          <li>Garantir a segurança e integridade da Plataforma.</li>
        </ul>

        <h2>3. Compartilhamento de dados</h2>
        <p>
          Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Podemos compartilhar dados somente quando exigido por lei ou ordem judicial.
        </p>

        <h2>4. Retenção de dados</h2>
        <p>
          Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, os dados pessoais identificáveis são removidos em até 30 dias, exceto quando houver obrigação legal de retenção.
        </p>

        <h2>5. Seus direitos (LGPD)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados.</li>
          <li>Acessar, corrigir ou atualizar seus dados.</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
          <li>Revogar o consentimento a qualquer momento.</li>
          <li>Solicitar a portabilidade dos dados.</li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato pelo e-mail: <a href="mailto:privacidade@exame-ai.news">privacidade@exame-ai.news</a>.
        </p>

        <h2>6. Cookies</h2>
        <p>
          Utilizamos cookies estritamente necessários para autenticação (JWT) e preferências de interface (tema claro/escuro). Não utilizamos cookies de rastreamento de terceiros.
        </p>

        <h2>7. Segurança</h2>
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito (HTTPS), hashing de senhas (bcrypt) e controle de acesso por perfil de usuário.
        </p>

        <h2>8. Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Notificaremos usuários cadastrados sobre alterações relevantes por e-mail. O uso contínuo da Plataforma após a notificação implica aceitação das alterações.
        </p>

        <h2>9. Contato</h2>
        <p>
          Dúvidas sobre esta política podem ser enviadas para{' '}
          <a href="mailto:privacidade@exame-ai.news">privacidade@exame-ai.news</a>.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex gap-4 text-sm">
        <Link href="/terms" className="text-red-600 hover:text-red-700 font-medium">
          Termos de Uso →
        </Link>
      </div>
    </main>
  )
}
