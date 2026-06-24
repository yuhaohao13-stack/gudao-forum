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

  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
          <span className="text-xl sm:text-3xl font-bold text-gradient tracking-tight">
            古道论坛
          </span>
        </Link>

        {/* 搜索（桌面） */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索帖子..."
            className="w-full bg-slate-900/60 border border-slate-700/40 rounded-lg px-3 py-1.5 text-sm
                       text-slate-100 placeholder-slate-500
                       focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20
                       transition-all duration-200"
          />
        </form>

        <nav className="flex items-center gap-1.5 text-sm shrink-0">
          {/* 搜索按钮（手机） */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden btn-ghost px-2"
            aria-label="搜索"
          >
            🔍
          </button>

          {loading ? (
            <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          ) : user ? (
            <>
              <Link href="/new-thread" className="btn-amber whitespace-nowrap !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">
                ✏️ 发帖
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="btn-ghost flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-[10px] text-white font-bold">
                  {(profile?.display_name || profile?.username || '?')[0]}
                </span>
                <span className="hidden sm:inline">{profile?.display_name || profile?.username}</span>
              </Link>
              {isAdmin && (
                <Link href="/admin" className="btn-ghost text-amber-400 hover:text-amber-300">
                  管理
                </Link>
              )}
              <button onClick={handleLogout} className="btn-ghost text-slate-400 hover:text-red-400">
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">登录</Link>
              <Link href="/register" className="btn-amber whitespace-nowrap !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">
                注册
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* 搜索（手机展开） */}
      {showSearch && (
        <div className="sm:hidden px-4 pb-3 fade-in">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索帖子..."
              autoFocus
              className="input-field"
            />
          </form>
        </div>
      )}
    </header>
  )
}
