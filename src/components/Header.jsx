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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-[#f0eee8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 sm:h-16 justify-between">
          {/* 左侧：Logo + 导航 */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-lg sm:text-xl select-none">🏛️</span>
              <span className="text-lg sm:text-xl font-bold font-serif tracking-wide text-[#1a1a1a]">古道论坛</span>
            </Link>
            <nav className="hidden sm:flex items-center ml-5 gap-1 text-sm">
              <Link href="/"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  !isChatPage ? 'bg-[#f0f0ee] text-[#1a1a1a] font-medium' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f3]'
                }`}
              >首页</Link>
              <Link href="/chat"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isChatPage ? 'bg-[#f0f0ee] text-[#1a1a1a] font-medium' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f3]'
                }`}
              >聊天</Link>
            </nav>
          </div>

          {/* 右侧：搜索 + 操作 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 桌面搜索 */}
            <div className="hidden sm:block relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-xs pointer-events-none">⌕</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
                placeholder="搜索..."
                className="w-44 lg:w-52 bg-[#f5f5f3] border border-transparent rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none transition-all focus:border-[#ddd] focus:bg-white focus:w-56"
              />
            </div>

            <DonateButton className="hidden sm:inline-flex btn-ghost text-xs font-medium" />

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#ccc] border-t-[#1a1a1a] rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <Link href="/messages" className="btn-ghost !p-1.5 relative">
                  💬
                  <UnreadBadge className="absolute -top-0.5 -right-0.5" />
                </Link>
                <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 text-xs">
                  ✏️ 发帖
                </Link>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1.5 btn-ghost !p-1">
                  <span className="w-7 h-7 rounded-full bg-[#c23531] flex items-center justify-center text-xs text-white font-bold shadow-sm">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium text-[#555]">
                    {profile?.display_name || profile?.username || ''}
                  </span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="btn-ghost text-xs text-[#888]">
                    管理
                  </Link>
                )}
                <button onClick={handleLogout} className="hidden sm:inline-flex btn-ghost text-xs text-[#aaa] hover:text-[#c23531]">
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-[#888] hover:text-[#1a1a1a] transition-colors px-2 py-1">
                  登录
                </Link>
                <Link href="/register" className="btn-primary !px-3 !py-1.5 text-xs">
                  注册
                </Link>
              </div>
            )}

            {/* 移动端搜索开关 */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden btn-ghost !p-1.5 text-[#999]"
            >
              {showSearch ? '✕' : '⌕'}
            </button>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="flex sm:hidden items-center gap-2 pb-2.5 overflow-x-auto scrollbar-none">
          <Link href="/"
            className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-lg transition-all ${
              !isChatPage ? 'bg-[#f0f0ee] text-[#1a1a1a]' : 'text-[#999]'
            }`}
          >首页</Link>
          <Link href="/chat"
            className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-lg transition-all ${
              isChatPage ? 'bg-[#f0f0ee] text-[#1a1a1a]' : 'text-[#999]'
            }`}
          >聊天</Link>
          <DonateButton className="whitespace-nowrap text-xs font-medium px-3 py-1 rounded-lg text-[#999] hover:bg-[#f5f5f3] transition-all" />
        </div>

        {/* 移动端搜索条 */}
        {showSearch && (
          <div className="sm:hidden pb-3 anim-fade-in">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-xs pointer-events-none">⌕</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
                placeholder="搜索帖子..."
                autoFocus
                className="w-full bg-[#f5f5f3] border border-[#e5e0d8] rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-[#ccc] focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
