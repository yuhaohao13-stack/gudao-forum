import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: '古道论坛',
  description: '古道论坛 — 自由讨论、友善交流',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '古道论坛',
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#f5f0e8" />
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker'in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`
        }} />
      </head>
      <body className="min-h-screen text-[#2c2c2c] flex flex-col bg-[#f5f0e8]">
        {/* 水墨山水画背景 */}
        <div
          className="fixed inset-0 pointer-events-none -z-10 opacity-70"
          style={{
            backgroundImage: 'url(/bg-ink.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <AuthProvider>
          <Header />
          <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
