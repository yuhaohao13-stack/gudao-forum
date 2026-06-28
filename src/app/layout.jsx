import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
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
  alternates: {
    canonical: 'https://www.gudaoforum.com',
  },
  keywords: ['古道论坛', '国际中文社区', '中文聊天室', '华人论坛', '中国文化', '以文会友', '中文社区', '海外华人', 'Chinese Forum', 'Chinese Community'],
  openGraph: {
    title: '古道论坛 | 国际中文社区 · 中文聊天室',
    description: '以文会友，以友辅仁 —— 面向全球华人的国际中文社区。论坛讨论、在线聊天、文化分享，弘扬中华文化，连接你我他。',
    url: 'https://www.gudaoforum.com',
    siteName: '古道论坛',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '古道论坛 | 国际中文社区 · 中文聊天室',
    description: '以文会友，以友辅仁 —— 面向全球华人的国际中文社区。',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': 200,
    'max-image-preview': 'large',
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export const viewport = 'width=device-width, initial-scale=1, maximum-scale=1'

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f8f6f2" />
        {/* 百度站长验证 */}
        <meta name="baidu-site-verification" content="codeva-ivcpKCSsQj" />
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta name="build-version" content="v2-final" />
        <script dangerouslySetInnerHTML={{
          __html: `// 注册新 SW（清除缓存后退出）
if('serviceWorker'in navigator){
  navigator.serviceWorker.getRegistrations().then(function(r){
    r.forEach(function(s){s.unregister()})
  })
  navigator.serviceWorker.register('/sw.js')
}`
        }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f8f6f2] text-[#1a1a1a]">
        {/* 纹理背景 */}
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.025]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c23531\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />
        <DonateOverlay />
        <AuthProvider>
          <Header />
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 sm:py-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
