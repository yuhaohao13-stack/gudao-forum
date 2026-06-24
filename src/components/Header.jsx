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
    <header className="sticky top-0 z-50 border-b border-[#e0d8c8] bg-[#faf8f4]/90 backdrop-blur-md">
      {/* 顶部朱砂线 */}
      <div className="h-0.5 bg-gradient-to-r from-[#c23531] via-[#d4403c] to-[#c23531]" />

      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[#2c2c2c]">
            古道论坛
          </h1>
        </Link>

        {/* 搜索（桌面） */}
        <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xs">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索帖子..."
            className="ink-input"
          />
        </form>

        <nav className="flex items-center gap-1 text-sm shrink-0">
          <button onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden btn-ink px-2" aria-label="搜索">
            🔍
          </button>

          {loading ? (
            <div className="w-4 h-4 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" />
          ) : user ? (
            <>
              <Link href="/new-thread" className="btn-red whitespace-nowrap !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">
                ✏️ 发帖
              </Link>
              <Link href={`/profile/${user.id}`} className="btn-ink flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] text-white font-bold">
                  {(profile?.display_name || profile?.username || '?')[0]}
                </span>
                <span className="hidden sm:inline">{profile?.display_name || profile?.username}</span>
              </Link>
              {isAdmin && (
                <Link href="/admin" className="btn-ink text-[#c23531]">管理</Link>
              )}
              <button onClick={handleLogout} className="btn-ink text-[#888] hover:text-[#c23531]">退出</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ink">登录</Link>
              <Link href="/register" className="btn-red whitespace-nowrap !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">
                注册
              </Link>
            </>
          )}
        </nav>
      </div>

      {showSearch && (
        <div className="sm:hidden px-4 pb-3 fade-in">
          <form onSubmit={handleSearch}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索帖子..." autoFocus className="ink-input" />
          </form>
        </div>
      )}
    </header>
  )
}
