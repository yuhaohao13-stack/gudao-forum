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
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/'); router.refresh()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) { router.push(`/search?q=${encodeURIComponent(search.trim())}`); setShowSearch(false) }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#eee8dc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
          <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-[#1a1a1a]">古道论坛</h1>
        </Link>

        {/* Desk search */}
        <div className="hidden sm:flex flex-1 max-w-xs">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-sm">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
              placeholder="搜索帖子..."
              className="w-full bg-[#faf8f4] border border-[#eee8dc] rounded-full pl-9 pr-4 py-2 text-sm text-[#1a1a1a] placeholder-[#b0a898] outline-none transition-all focus:border-[#c23531] focus:bg-white focus:shadow-sm"
            />
          </div>
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-2 text-sm shrink-0">
          <button onClick={() => setShowSearch(!showSearch)} className="sm:hidden btn-ghost px-2">🔍</button>

          {loading ? (
            <div className="w-4 h-4 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" />
          ) : user ? (
            <>
              <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 !text-xs !rounded-lg sm:!px-4 sm:!py-2 sm:!text-sm">
                ✏️ 发帖
              </Link>
              <Link href={`/profile/${user.id}`} className="btn-ghost flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-full bg-[#c23531] flex items-center justify-center text-xs text-white font-bold shadow-sm">
                  {(profile?.display_name || profile?.username || '?')[0]}
                </span>
                <span className="hidden sm:inline font-medium text-[#444]">{profile?.display_name || profile?.username}</span>
              </Link>
              {isAdmin && <Link href="/admin" className="btn-ghost text-[#c23531]">管理</Link>}
              <button onClick={handleLogout} className="btn-ghost text-[#999] hover:text-[#c23531]">退出</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">登录</Link>
              <Link href="/register" className="btn-primary !px-3 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-sm">注册</Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="sm:hidden px-4 pb-4 anim-fade-in">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ccc]">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
              placeholder="搜索帖子..." autoFocus
              className="w-full bg-white border border-[#eee8dc] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#c23531]"
            />
          </div>
        </div>
      )}
    </header>
  )
}
