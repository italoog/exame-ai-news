import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Header } from '@/shared/layout/header'
import { Footer } from '@/shared/layout/footer'
import { QueryProvider } from '@/shared/providers/query-provider'
import { ThemeProvider } from '@/shared/providers/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'EXAME AI NEWS — Inteligência no mercado',
    template: '%s | EXAME AI NEWS',
  },
  description:
    'A plataforma de notícias de negócios, mercados e tecnologia com inteligência artificial.',
  keywords: ['negócios', 'mercados', 'tecnologia', 'economia', 'IA', 'investimentos'],
  authors: [{ name: 'EXAME' }],
  creator: 'EXAME',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'EXAME AI NEWS',
    title: 'EXAME AI NEWS — Inteligência no mercado',
    description: 'A plataforma de notícias com inteligência artificial.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EXAME AI NEWS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXAME AI NEWS',
    description: 'A plataforma de notícias com inteligência artificial.',
    images: ['/og-image.png'],
    creator: '@exame',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import { ToastProvider } from '@/shared/ui/toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
        <QueryProvider>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <ToastProvider />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

