'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setShowSearch(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-amber-400 shrink-0">
          <span className="text-xl">🏛️</span>
          古道论坛
        </Link>

        {/* 搜索栏（桌面端常显） */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索帖子..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </form>

        <nav className="flex items-center gap-2 text-sm shrink-0">
          {/* 搜索按钮（手机端） */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden text-slate-300 hover:text-white px-2"
          >
            🔍
          </button>

          {loading ? (
            <span className="text-slate-400 animate-pulse text-xs">...</span>
          ) : user ? (
            <>
              <Link href="/new-thread" className="bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                ✏️ 发帖
              </Link>
              <Link href={`/profile/${user.id}`} className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">
                {profile?.display_name || profile?.username || '我'}
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-yellow-400 hover:text-yellow-300 text-xs">管理</Link>
              )}
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors text-xs">
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm">登录</Link>
              <Link href="/register" className="bg-amber-600 hover:bg-amber-500 px-2.5 py-1.5 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap">
                注册
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* 搜索栏（手机端展开） */}
      {showSearch && (
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索帖子..."
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </form>
        </div>
      )}
    </header>
  )
}
