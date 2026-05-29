import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso | EXAME AI NEWS',
  description: 'Leia os termos e condições de uso da plataforma EXAME AI NEWS.',
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-600 transition-colors">
          ← Voltar ao início
        </Link>
      </div>

      <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-2">
        Termos de Uso
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
        Última atualização: 29 de maio de 2026
      </p>

      <div className="prose prose-zinc dark:prose-invert prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-p:leading-7 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 max-w-none">

        <p>
          Ao acessar ou usar a EXAME AI NEWS (&quot;Plataforma&quot;), você concorda com os presentes Termos de Uso. Leia-os com atenção antes de utilizar a Plataforma.
        </p>

        <h2>1. Descrição do serviço</h2>
        <p>
          A EXAME AI NEWS é uma plataforma digital de notícias que utiliza inteligência artificial para curar, resumir e recomendar conteúdo jornalístico nas áreas de negócios, tecnologia, economia, mercados financeiros e empreendedorismo.
        </p>

        <h2>2. Elegibilidade</h2>
        <p>
          O uso da Plataforma é permitido a pessoas maiores de 16 anos. Ao criar uma conta, você declara ter capacidade legal para aceitar estes Termos.
        </p>

        <h2>3. Conta de usuário</h2>
        <ul>
          <li>Você é responsável pela confidencialidade de suas credenciais de acesso.</li>
          <li>Notifique-nos imediatamente em caso de uso não autorizado da sua conta.</li>
          <li>É proibido criar contas com identidade falsa ou em nome de terceiros sem autorização.</li>
          <li>Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos.</li>
        </ul>

        <h2>4. Conteúdo gerado por usuários</h2>
        <p>
          Usuários com perfil de Editor ou Admin podem publicar artigos na Plataforma. Ao publicar conteúdo, você declara que:
        </p>
        <ul>
          <li>Possui os direitos autorais ou a devida autorização sobre o conteúdo publicado.</li>
          <li>O conteúdo não infringe direitos de terceiros, leis vigentes ou políticas desta Plataforma.</li>
          <li>Concede à Plataforma licença não-exclusiva para exibir e distribuir o conteúdo publicado.</li>
        </ul>

        <h2>5. Condutas proibidas</h2>
        <p>É estritamente proibido:</p>
        <ul>
          <li>Publicar conteúdo falso, enganoso, difamatório, discriminatório ou que incite violência.</li>
          <li>Usar a Plataforma para fins ilegais ou não autorizados.</li>
          <li>Tentar comprometer a segurança, disponibilidade ou integridade da Plataforma.</li>
          <li>Utilizar bots, scrapers ou automações para coletar dados sem autorização.</li>
          <li>Criar múltiplas contas para contornar restrições impostas.</li>
        </ul>

        <h2>6. Propriedade intelectual</h2>
        <p>
          Todo o conteúdo editorial, design, logotipos e tecnologia da Plataforma são de propriedade da EXAME AI NEWS ou de seus licenciadores. É vedada a reprodução, distribuição ou modificação sem autorização expressa por escrito.
        </p>

        <h2>7. Uso da inteligência artificial</h2>
        <p>
          A Plataforma utiliza IA para gerar resumos automáticos de artigos, recomendar conteúdo e identificar tendências. Os resumos gerados por IA são indicativos e podem conter imprecisões — recomendamos sempre a leitura do artigo completo.
        </p>

        <h2>8. Limitação de responsabilidade</h2>
        <p>
          A Plataforma é fornecida &quot;como está&quot;, sem garantias expressas ou implícitas. Não nos responsabilizamos por decisões financeiras, de investimento ou de negócios tomadas com base no conteúdo publicado. O conteúdo é de caráter informativo e não constitui assessoria profissional.
        </p>

        <h2>9. Modificações nos Termos</h2>
        <p>
          Podemos atualizar estes Termos a qualquer momento. Usuários cadastrados serão notificados por e-mail. O uso continuado da Plataforma após a vigência das alterações implica aceitação dos novos Termos.
        </p>

        <h2>10. Rescisão</h2>
        <p>
          Você pode encerrar sua conta a qualquer momento nas configurações de perfil. Nos reservamos o direito de encerrar ou suspender contas que violem estes Termos, sem aviso prévio em casos graves.
        </p>

        <h2>11. Lei aplicável e foro</h2>
        <p>
          Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de São Paulo — SP para dirimir eventuais conflitos, com renúncia a qualquer outro, por mais privilegiado que seja.
        </p>

        <h2>12. Contato</h2>
        <p>
          Para dúvidas sobre estes Termos, entre em contato:{' '}
          <a href="mailto:termos@exame-ai.news">termos@exame-ai.news</a>.
        </p>
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex gap-4 text-sm">
        <Link href="/privacy" className="text-red-600 hover:text-red-700 font-medium">
          Política de Privacidade →
        </Link>
      </div>
    </main>
  )
}
