import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { LanguageProvider } from '@/lib/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DonateOverlay from '@/components/DonateOverlay'
import ErrorBoundary from '@/components/ErrorBoundary'

export const metadata = {
  metadataBase: new URL('https://www.gudaoforum.com'),
  title: {
    default: '古道论坛 | 国际中文社区 · 中文聊天室 · 以文会友',
    template: '%s — 古道论坛 | 国际中文社区',
  },
  description: '古道论坛是面向全球华人的国际中文社区与在线聊天室。以文会友，以友辅仁，弘扬中华文化，畅聊生活科技。免费注册，即刻加入，与万千华人共筑温暖的精神家园。',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: '古道论坛' },
  alternates: { canonical: 'https://www.gudaoforum.com' },
  keywords: ['古道论坛', '国际中文社区', '中文聊天室', '华人论坛', '中国文化', '以文会友', '中文社区', '海外华人', 'Chinese Forum', 'Chinese Community'],
  openGraph: {
    title: '古道论坛 | 国际中文社区 · 中文聊天室',
    description: '以文会友，以友辅仁 —— 面向全球华人的国际中文社区。论坛讨论、在线聊天、文化分享，弘扬中华文化，连接你我他。',
    url: 'https://www.gudaoforum.com',
    siteName: '古道论坛',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: { index: true, follow: true },
  verification: { google: '-S_PJiPjqohBHyP8xATwcVEFDTFTHRba1e4i16Cmk-E' },
}

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#fafaf9" />
        <meta name="baidu-site-verification" content="codeva-ivcpKCSsQj" />
        <meta name="build-version" content="v3-refined" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fafaf9] text-[#1a1a1a] overflow-x-hidden">
        <ErrorBoundary>
          <DonateOverlay />
          <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 sm:py-6">
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
