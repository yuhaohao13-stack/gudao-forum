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
    default: '古道论坛 | 国际中文社区 · 以文会友 · 在线聊天',
    template: '%s — 古道论坛 | 国际中文社区',
  },
  description: '古道论坛是面向全球华人的国际中文社区与在线聊天室。以文会友，以友辅仁。中文论坛推荐、海外华人社区、自由交流、畅聊生活科技文化。免费注册即刻加入，与万千华人共筑温暖的精神家园。',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: '古道论坛' },
  alternates: { canonical: 'https://www.gudaoforum.com' },
  keywords: ['古道论坛', '国际中文社区', '中文聊天室', '华人论坛', '中国文化', '以文会友', '中文社区', '海外华人', '中文论坛推荐', 'Chinese Forum', 'Chinese Community', '中文交流平台', '华人聊天室', '在线聊天', '聊天交友', '中文社交平台', 'free Chinese forum', 'Chinese chat room', 'online community', 'gudaoforum', '唐诗三百首', '四大名著', '成语故事', '谚语故事', '高清壁纸', '彩票模拟器', '中华传统文化', '古典文学'],
  openGraph: {
    title: '古道论坛 | 国际中文社区 · 以文会友 · 在线聊天',
    description: '以文会友，以友辅仁 —— 面向全球华人的国际中文社区与在线聊天室。论坛讨论、文化分享、自由交流，弘扬中华文化，连接你我他。',
    url: 'https://www.gudaoforum.com',
    siteName: '古道论坛',
    type: 'website',
    locale: 'zh_CN',
    images: [
      {
        url: 'https://www.gudaoforum.com/icons/icon-192.png',
        width: 192,
        height: 192,
        alt: '古道论坛',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '古道论坛 | 国际中文社区 · 以文会友 · 在线聊天',
    description: '面向全球华人的国际中文社区与在线聊天室。以文会友，以友辅仁。免费注册，即刻加入。',
    images: ['https://www.gudaoforum.com/icons/icon-192.png'],
  },
  robots: { index: true, follow: true },
  verification: { google: '-S_PJiPjqohBHyP8xATwcVEFDTFTHRba1e4i16Cmk-E' },
}

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1'

export default function RootLayout({ children }) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '古道论坛',
    alternateName: ['Gudao Forum', 'Gudao Community'],
    url: 'https://www.gudaoforum.com',
    description: '面向全球华人的国际中文社区与在线聊天室。以文会友，以友辅仁，弘扬中华文化，畅聊生活科技。免费注册，即刻加入全球华人社区。',
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

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '古道论坛',
    url: 'https://www.gudaoforum.com',
    description: '面向全球华人的国际中文社区。论坛讨论、在线聊天、文化交流。',
    foundingDate: '2026',
    areaServed: { '@type': 'Continent', name: 'Asia' },
    inLanguage: 'zh-CN',
    isAccessibleForFree: true,
    hasPart: [
      {
        '@type': 'WebApplication',
        name: '古道论坛聊天室',
        applicationCategory: 'CommunicationApplication',
        operatingSystem: 'All',
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '古道论坛', item: 'https://www.gudaoforum.com' },
      { '@type': 'ListItem', position: 2, name: '聊天室', item: 'https://www.gudaoforum.com/chat' },
      { '@type': 'ListItem', position: 3, name: '论坛板块', item: 'https://www.gudaoforum.com/c' },
    ],
  }

  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#fafaf9" />
        <link rel="sitemap" type="application/xml" title="古道论坛Sitemap" href="/sitemap.xml" />
        <meta name="baidu-site-verification" content="codeva-ivcpKCSsQj" />
        <meta name="build-version" content="v3-refined" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fafaf9] text-[#1a1a1a] overflow-x-hidden">
        <ErrorBoundary>
          <DonateOverlay />
          <FloatingButtons />
          <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1 w-full px-4 py-5 sm:py-6 sm:max-w-4xl sm:mx-auto">
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
