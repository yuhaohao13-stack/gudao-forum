'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-blue-400">
          <span className="text-xl">💬</span>
          逼哥论坛
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {loading ? (
            <span className="text-slate-400 animate-pulse">加载中...</span>
          ) : user ? (
            <>
              <Link href="/new-thread" className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors">
                ✏️ 发帖
              </Link>
              <Link href={`/profile/${user.id}`} className="text-slate-300 hover:text-white transition-colors">
                {profile?.display_name || profile?.username || '我'}
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-yellow-400 hover:text-yellow-300">管理</Link>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors">登录</Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors">
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
