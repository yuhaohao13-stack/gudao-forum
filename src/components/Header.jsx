'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import UnreadBadge from './UnreadBadge'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const [search, setSearch] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const isChatPage = pathname?.startsWith('/chat')
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0f0f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 justify-between">
          {/* Logo + 导航 */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg">🏛️</span>
              <span className="font-bold font-serif text-base tracking-wide">古道论坛</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              <Link href="/"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  !isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a] font-medium' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
                }`}
              >首页</Link>
              <Link href="/chat"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a] font-medium' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
                }`}
              >聊天室</Link>
            </nav>
          </div>

          {/* 右侧 */}
          <div className="flex items-center gap-2">
            {/* 搜索 */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..."
                className="w-36 lg:w-44 bg-[#f5f5f5] rounded-md px-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none transition-all focus:bg-white focus:border focus:border-[#e5e5e5] focus:w-48"
              />
            </form>

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-1.5">
                <Link href="/messages" className="btn-ghost !p-1.5 relative text-sm" title="私信">
                  💬
                  <UnreadBadge className="absolute -top-0.5 -right-0.5" />
                </Link>
                <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 !text-xs">
                  发帖
                </Link>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1.5 btn-ghost !p-1">
                  <span className="w-7 h-7 rounded-full bg-[#c23531] flex items-center justify-center text-xs text-white font-bold">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-sm text-[#555]">
                    {profile?.display_name || profile?.username || ''}
                  </span>
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
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="flex sm:hidden items-center gap-2 pb-3 overflow-x-auto scrollbar-none">
          <Link href="/"
            className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-md transition-colors ${
              !isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-[#999]'
            }`}
          >首页</Link>
          <Link href="/chat"
            className={`whitespace-nowrap text-xs font-medium px-3 py-1 rounded-md transition-colors ${
              isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-[#999]'
            }`}
          >聊天室</Link>
        </div>
      </div>
    </header>
  )
}
