'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Landmark, Search, MessageCircle, Pencil, X, LogOut, Menu } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import DonateButton from './DonateButton'
import UnreadBadge from './UnreadBadge'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const { lang, toggleLang, t } = useLanguage()
  const [search, setSearch] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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
      setShowMobileMenu(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8e2d8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 sm:h-16 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-sm">
              <Landmark size={18} />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1c1917]">古道论坛</span>
          </Link>

          {/* 导航链接 - 桌面 */}
          <div className="hidden sm:flex items-center gap-1 ml-4">
            <Link href="/" className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${!isChatPage ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#666] hover:text-[#1c1917] hover:bg-[#f8f7f5]'}`}>首页</Link>
            <Link href="/chat" className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isChatPage ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#666] hover:text-[#1c1917] hover:bg-[#f8f7f5]'}`}>聊天室</Link>
          </div>

          <div className="flex-1" />

          {/* 搜索 - 桌面 */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..."
                className="w-32 lg:w-40 bg-[#f8f7f5] border border-[#e8e2d8] rounded-md pl-8 pr-3 py-1.5 text-sm text-[#1c1917] placeholder-[#bbb] outline-none transition-all focus:border-[#2563eb] focus:bg-white focus:w-44" />
            </div>
          </form>

          {/* 用户操作 */}
          <div className="flex items-center gap-1">
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#ddd] border-t-[#2563eb] rounded-full animate-spin mx-2" />
            ) : user ? (
              <>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#f8f7f5] transition-colors">
                  <span className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-xs text-white font-bold shadow-sm">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium text-[#555] max-w-[4em] truncate">{profile?.display_name || profile?.username || ''}</span>
                </Link>
                <Link href="/messages" className="p-2 rounded-md text-[#999] hover:text-[#2563eb] hover:bg-[#f8f7f5] transition-colors relative">
                  <MessageCircle size={18} /><UnreadBadge />
                </Link>
                <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 !text-xs">
                  <Pencil size={14} /> <span className="hidden sm:inline">发帖</span>
                </Link>
                {isAdmin && <Link href="/admin" className="px-2 py-1 rounded-md text-xs text-[#999] hover:text-[#2563eb] hover:bg-[#f8f7f5] transition-colors">管理</Link>}
                <button onClick={handleLogout} className="p-2 rounded-md text-[#999] hover:text-[#2563eb] hover:bg-[#f8f7f5] transition-colors"><LogOut size={16} /></button>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/login" className="text-sm text-[#666] hover:text-[#1c1917] transition-colors px-2 py-1">登录</Link>
                <Link href="/register" className="btn-primary !px-3 !py-1.5 !text-xs">注册</Link>
              </div>
            )}

            {/* 语言切换 */}
            <button onClick={() => toggleLang()} className="hidden sm:flex text-xs px-2 py-1.5 rounded-md border border-[#e8e2d8] text-[#888] hover:text-[#1c1917] hover:border-[#ccc] transition-colors items-center">
              {lang === 'zh' ? 'EN' : '中文'}
            </button>

            {/* 移动端菜单 */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-md text-[#999] hover:text-[#2563eb] transition-colors">
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {showMobileMenu && (
          <div className="sm:hidden pb-3 space-y-1 anim-fade-in border-t border-[#f5f4f0] pt-2 mt-0">
            <form onSubmit={handleSearch} className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..." autoFocus
                className="w-full bg-[#f8f7f5] border border-[#e8e2d8] rounded-md pl-9 pr-3 py-2 text-sm outline-none focus:border-[#2563eb]" />
            </form>
            <Link href="/" onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium bg-[#eff6ff] text-[#2563eb]">首页</Link>
            <Link href="/chat" onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#666] hover:bg-[#f8f7f5]">聊天室</Link>
            <Link href="/new-thread" onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-md text-sm text-[#666] hover:bg-[#f8f7f5]">发帖</Link>
            <DonateButton className="w-full text-left px-3 py-2 rounded-md text-sm text-[#666] hover:bg-[#f8f7f5]" />
            <button onClick={() => { toggleLang(); setShowMobileMenu(false); }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-[#666] hover:bg-[#f8f7f5]">
              {lang === 'zh' ? 'English' : '中文'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
