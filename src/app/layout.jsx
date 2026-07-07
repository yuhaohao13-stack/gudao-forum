import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { LanguageProvider } from '@/lib/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DonateOverlay from '@/components/DonateOverlay'
import ErrorBoundary from '@/components/ErrorBoundary'
import FloatingButtons from '@/components/FloatingButtons'

export const metadata = {
  metadataBase: new URL('https://www.gudaoforum.com'),
  title: { default: '古道论坛 | 国际中文社区 · 以文会友 · 在线聊天', template: '%s — 古道论坛' },
  description: '面向全球华人的国际中文社区与聊天室。以文会友，以友辅仁。',
  manifest: '/manifest.json',
}

export const viewport = 'width=device-width, initial-scale=1'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#0079d3" />
        <link rel="icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <DonateOverlay />
          <FloatingButtons />
          <LanguageProvider>
            <AuthProvider>
              <Header />
              <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
                {children}
              </main>
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
