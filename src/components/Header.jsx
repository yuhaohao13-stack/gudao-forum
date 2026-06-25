'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'

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
    router.push('/'); router.refresh()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) { router.push(`/search?q=${encodeURIComponent(search.trim())}`); setShowSearch(false) }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#eee8dc]">
      {/* ========== 桌面版 Header（原样保留） ========== */}
      <div className="hidden sm:flex max-w-4xl mx-auto px-4 h-12 items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-[#1a1a1a]">古道论坛</h1>
          </Link>

          <nav className="flex items-center ml-4 gap-1 text-sm">
            <Link href="/"
              className={`px-3 py-1.5 rounded-full transition-all ${
                !isChatPage ? 'bg-[#c23531]/10 text-[#c23531] font-medium' : 'text-[#888] hover:text-[#c23531] hover:bg-[#c23531]/5'
              }`}
            >🏠 首页</Link>
            <Link href="/chat"
              className={`px-3 py-1.5 rounded-full transition-all ${
                isChatPage ? 'bg-[#c23531]/10 text-[#c23531] font-medium' : 'text-[#888] hover:text-[#c23531] hover:bg-[#c23531]/5'
              }`}
            >💬 聊天</Link>
          </nav>
        </div>

        {/* 桌面搜索 */}
        <div className="flex-1 max-w-xs">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-sm">🔍</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
              placeholder="搜索帖子..."
              className="w-full bg-[#faf8f4] border border-[#eee8dc] rounded-full pl-9 pr-4 py-2 text-sm text-[#1a1a1a] placeholder-[#b0a898] outline-none transition-all focus:border-[#c23531] focus:bg-white focus:shadow-sm"
            />
          </div>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 text-sm shrink-0">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" />
          ) : user ? (
            <>
              <Link href="/new-thread" className="btn-primary !px-4 !py-2 !text-sm">
                ✏️ 发帖
              </Link>
              <Link href={`/profile/${user.id}`} className="btn-ghost flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-full bg-[#c23531] flex items-center justify-center text-xs text-white font-bold shadow-sm">
                  {(profile?.display_name || profile?.username || '?')[0]}
                </span>
                <span className="font-medium text-[#444]">{profile?.display_name || profile?.username}</span>
              </Link>
              {isAdmin && <Link href="/admin" className="btn-ghost text-[#c23531]">管理</Link>}
              <button onClick={handleLogout} className="btn-ghost text-[#999] hover:text-[#c23531]">退出</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">登录</Link>
              <Link href="/register" className="btn-primary !px-4 !py-2 !text-sm">注册</Link>
            </>
          )}
        </nav>
      </div>

      {/* ========== 手机版 Header（两排） ========== */}
      <div className="sm:hidden">
        {/* 第一排：古道论坛 */}
        <div className="flex items-center justify-center h-11 px-4 border-b border-[#eee8dc]/50">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏛️</span>
            <h1 className="text-xl font-bold font-serif tracking-wide text-[#1a1a1a]">古道论坛</h1>
          </Link>
        </div>

        {/* 第二排：导航操作栏 */}
        <div className="flex items-center justify-between px-3 py-1.5 gap-1 overflow-x-auto scrollbar-none">
          {/* 左侧导航 */}
          <div className="flex items-center gap-0.5 text-sm shrink-0">
            <Link href="/"
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all ${
                !isChatPage ? 'bg-[#c23531]/10 text-[#c23531]' : 'text-[#888]'
              }`}
            >🏠 首页</Link>
            <Link href="/chat"
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-all ${
                isChatPage ? 'bg-[#c23531]/10 text-[#c23531]' : 'text-[#888]'
              }`}
            >💬 聊天</Link>

            <button onClick={() => setShowSearch(!showSearch)}
              className="px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium text-[#888] hover:text-[#c23531] transition-all"
            >🔍</button>
          </div>

          {/* 右侧用户操作 */}
          <div className="flex items-center gap-0.5 text-sm shrink-0">
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href="/new-thread" className="btn-primary !px-2.5 !py-1.5 !text-xs !rounded-lg">
                  ✏️ 发帖
                </Link>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1 px-1.5 py-1">
                  <span className="w-6 h-6 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] text-white font-bold shadow-sm shrink-0">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                </Link>
                {isAdmin && <Link href="/admin" className="px-1.5 py-1 text-[#c23531] text-xs">管理</Link>}
                <button onClick={handleLogout} className="px-1.5 py-1 text-[#999] text-xs">退出</button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-2 py-1 text-[#888] text-xs font-medium">登录</Link>
                <Link href="/register" className="btn-primary !px-2.5 !py-1.5 !text-xs !rounded-lg">注册</Link>
              </>
            )}
          </div>
        </div>

        {/* 移动端搜索条 */}
        {showSearch && (
          <div className="px-4 pb-3 anim-fade-in border-t border-[#eee8dc]/50 pt-2">
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
      </div>
    </header>
  )
}
