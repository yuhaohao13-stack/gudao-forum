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
  title: {
    default: '古道论坛 | 国际中文社区·以文会友',
    template: '%s — 古道论坛 | 国际中文社区',
  },
  description: '古道论坛是面向全球华人的国际中文社区。以文会友，以友辅仁。论坛讨论、文化分享、自由交流，弘扬中华文化，连接你我他。',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: '古道论坛' },
  alternates: { canonical: 'https://www.gudaoforum.com' },
  keywords: [
    '古道论坛', '国际中文社区', '华人论坛', '以文会友',
    '中文社区', '海外华人', 'Chinese Forum', 'Chinese Community',
  ],
  openGraph: {
    title: '古道论坛 | 国际中文社区·以文会友',
    description: '以文会友，以友辅仁 —— 面向全球华人的国际中文社区。论坛讨论、文化分享、自由交流。',
    url: 'https://www.gudaoforum.com',
    siteName: '古道论坛',
    type: 'website',
    locale: 'zh_CN',
    images: [
      { url: 'https://www.gudaoforum.com/icons/icon-192.png', width: 192, height: 192, alt: '古道论坛' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '古道论坛 | 国际中文社区·以文会友',
    description: '面向全球华人的国际中文社区。以文会友，以友辅仁。',
    images: ['https://www.gudaoforum.com/icons/icon-192.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1'

export default function RootLayout({ children }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '古道论坛',
    alternateName: ['Gudao Forum', 'Gudao Community'],
    url: 'https://www.gudaoforum.com',
    description: '面向全球华人的国际中文社区。以文会友，以友辅仁，弘扬中华文化。',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.gudaoforum.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#1e293b" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#1e293b] overflow-x-hidden">
        <ErrorBoundary>
          <DonateOverlay />
          <FloatingButtons />
          <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
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
