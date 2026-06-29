'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import DonateButton from './DonateButton'
import UnreadBadge from './UnreadBadge'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const isChatPage = pathname?.startsWith('/chat')

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#f0f0f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* 主行 */}
        <div className="flex items-center h-14 sm:h-16 justify-between gap-1 sm:gap-2 overflow-hidden">
          {/* 左：Logo */}
          <div className="flex items-center gap-0.5 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg sm:text-xl select-none">🏛️</span>
              <span className="text-base sm:text-lg font-bold font-serif tracking-wide text-[#1a1a1a]">古道论坛</span>
            </Link>
          </div>

          {/* 中：导航（桌面） */}
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                !isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a] font-medium' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
              }`}
            >首页</Link>
            <Link href="/chat"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a] font-medium' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
              }`}
            >聊天室</Link>
          </nav>

          {/* 右：操作 */}
          <div className="flex items-center gap-0.5 sm:gap-2 min-w-0">
            {/* 桌面搜索 */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-xs pointer-events-none">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="搜索帖子..."
                  className="w-36 lg:w-44 bg-[#f8f8f8] border border-transparent rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none transition-all focus:border-[#e5e5e5] focus:bg-white focus:w-48"
                />
              </div>
            </form>

            <DonateButton className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-[#c23531] hover:bg-[#fef2f0] transition-colors" />

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* 会员名：在打赏后面空4格 */}
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1 btn-ghost !px-1.5 sm:!px-2 !py-1 ml-2 sm:ml-6">
                  <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] sm:text-xs text-white font-bold shadow-sm">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-[10px] sm:text-xs text-[#999] font-normal whitespace-nowrap">会员名：</span>
                  <span className="hidden sm:inline text-xs sm:text-sm font-medium text-[#555] max-w-[5em] truncate">
                    {profile?.display_name || profile?.username || ''}
                  </span>
                </Link>
                <Link href="/messages" className="btn-ghost !px-1.5 sm:!px-2 !py-1.5 flex items-center gap-0.5 sm:gap-1">
                  <span className="hidden sm:inline text-xs text-[#999]">私信</span>
                  💬
                  {UnreadBadge && <UnreadBadge />}
                </Link>
                <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 !text-xs whitespace-nowrap">
                  ✏️ 发帖
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="btn-ghost !text-xs">管理</Link>
                )}
                <button onClick={handleLogout} className="hidden sm:inline-flex btn-ghost !text-xs text-[#bbb]">
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">登录</Link>
                <Link href="/register" className="btn-primary !px-3 !py-1.5 !text-xs">注册</Link>
              </div>
            )}

            {/* 移动端搜索开关 */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden btn-ghost !px-2 !py-1.5 text-[#999]"
            >
              {showSearch ? '✕' : '🔍'}
            </button>
          </div>
        </div>

        {/* 移动端导航 + 打赏 */}
        <div className="flex sm:hidden items-center gap-2 pb-3 overflow-x-auto scrollbar-none">
          <Link href="/"
            className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
              !isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-[#999]'
            }`}
          >首页</Link>
          <Link href="/chat"
            className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
              isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-[#999]'
            }`}
          >聊天室</Link>
          <DonateButton className="whitespace-nowrap text-sm font-semibold px-3 py-1.5 rounded-lg text-[#c23531] hover:bg-[#fef2f0] transition-colors" />
        </div>

        {/* 移动端搜索 */}
        {showSearch && (
          <div className="sm:hidden pb-3 anim-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..."
                autoFocus
                className="w-full bg-[#f8f8f8] border border-[#f0f0f0] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#e0e0e0] focus:bg-white"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
