import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DonateOverlay from '@/components/DonateOverlay'

export const metadata = {
  metadataBase: new URL('https://www.gudaoforum.com'),
  title: {
    default: '古道论坛 | 国际中文社区',
    template: '%s — 古道论坛',
  },
  description: '以文会友，以友辅仁 — 面向全球华人的国际中文社区。论坛讨论、在线聊天、文化分享。',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: '古道论坛' },
  alternates: { canonical: 'https://www.gudaoforum.com' },
  keywords: ['古道论坛', '国际中文社区', '中文聊天室', '华人论坛', '中国文化', 'Chinese Forum'],
  openGraph: {
    title: '古道论坛 | 国际中文社区',
    description: '以文会友，以友辅仁 — 面向全球华人的国际中文社区。',
    url: 'https://www.gudaoforum.com',
    siteName: '古道论坛',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: { index: true, follow: true },
}

export const viewport = 'width=device-width, initial-scale=1'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="build-version" content="v3-redesign" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#1a1a1a]">
        <DonateOverlay />
        <AuthProvider>
          <Header />
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
