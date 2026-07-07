'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Landmark, Search, MessageCircle, Pencil, X, Globe, LogOut, Menu } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import DonateButton from './DonateButton'
import UnreadBadge from './UnreadBadge'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const { lang, toggleLang, t } = useLanguage()
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
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
      setShowSearch(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8e2d8] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        {/* 顶部行 */}
        <div className="flex items-center h-16 sm:h-20 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#b45309] to-[#92400e] flex items-center justify-center text-white shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
              <Landmark size={20} className="sm:size-[22]" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1917]">古道论坛</span>
          </Link>

          {/* 桌面导航 */}
          <div className="hidden sm:flex items-center gap-1 ml-4">
            <Link href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !isChatPage ? 'bg-[#f3f1ed] text-[#1c1917]' : 'text-[#999] hover:text-[#1c1917] hover:bg-[#f8f7f5]'
              }`}
            >首页</Link>
            <Link href="/chat"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isChatPage ? 'bg-[#f3f1ed] text-[#1c1917]' : 'text-[#999] hover:text-[#1c1917] hover:bg-[#f8f7f5]'
              }`}
            >聊天室</Link>
            <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00f2fe] to-[#fe2c55] text-white hover:opacity-90 transition-all shadow-sm ml-1">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="shrink-0">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.35 0 .69.06 1.01.18V8.48a6.34 6.34 0 0 0-1.01-.08C5.9 8.4 3 11.3 3 14.86c0 3.56 2.9 6.46 6.46 6.46 3.56 0 6.46-2.9 6.46-6.46V9.33a8.28 8.28 0 0 0 4.67 1.4v-3.4a4.84 4.84 0 0 1-1-.64z"/>
              </svg>
              抖音
            </a>
            <DonateButton className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#b45309] hover:bg-[#fef3c7] transition-colors" />
            <a href="https://www.crazy-repair.com" target="_blank" rel="noopener"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">Crazy维修</a>
          </div>

          <div className="flex-1"></div>

          {/* 右：搜索 + 用户操作 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 桌面搜索框 */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="搜索帖子..."
                  className="w-32 lg:w-40 bg-[#f8f7f5] border border-[#e8e2d8] rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#1c1917] placeholder-[#bbb] outline-none transition-all focus:border-[#b45309] focus:bg-white focus:w-44"
                />
              </div>
            </form>

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#b45309] rounded-full animate-spin mx-2" />
            ) : user ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#f8f7f5] transition-colors">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b45309] to-[#92400e] flex items-center justify-center text-xs text-white font-bold shadow-sm">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium text-[#555] max-w-[5em] truncate">
                    {profile?.display_name || profile?.username || ''}
                  </span>
                </Link>
                <Link href="/messages" className="p-2 rounded-lg text-[#999] hover:text-[#b45309] hover:bg-[#f8f7f5] transition-colors relative">
                  <MessageCircle size={18} />
                  {UnreadBadge && <UnreadBadge />}
                </Link>
                <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 !text-xs">
                  <Pencil size={15} className="inline-block" /> <span className="hidden sm:inline">发帖</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="px-2 py-1 rounded-lg text-xs text-[#999] hover:text-[#b45309] hover:bg-[#f8f7f5] transition-colors">管理</Link>
                )}
                <button onClick={handleLogout} className="p-2 rounded-lg text-[#999] hover:text-[#b45309] hover:bg-[#f8f7f5] transition-colors" title="退出">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-[#888] hover:text-[#1c1917] transition-colors px-2 py-1">登录</Link>
                <Link href="/register" className="btn-primary !px-3 !py-1.5 !text-xs">注册</Link>
              </div>
            )}

            <button onClick={() => toggleLang()} className="hidden sm:flex text-xs px-2 py-1.5 rounded-lg border border-[#e8e2d8] text-[#888] hover:text-[#1c1917] hover:border-[#ccc] transition-colors items-center gap-1">
              <Globe size={13} />{lang === 'zh' ? 'EN' : '中文'}
            </button>

            {/* 移动端菜单开关 */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="sm:hidden p-2 rounded-lg text-[#999] hover:text-[#b45309] hover:bg-[#f8f7f5] transition-colors">
              {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* 移动端搜索开关 */}
            <button onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden p-2 rounded-lg text-[#999] hover:text-[#b45309] hover:bg-[#f8f7f5] transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* 移动端搜索弹出 */}
        {showSearch && (
          <div className="sm:hidden pb-3 anim-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..."
                autoFocus
                className="w-full bg-[#f8f7f5] border border-[#e8e2d8] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#b45309] focus:bg-white"
              />
            </form>
          </div>
        )}

        {/* 移动端菜单 */}
        {showMobileMenu && (
          <div className="sm:hidden pb-4 anim-fade-in space-y-1">
            <Link href="/" onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#1c1917] bg-[#f3f1ed]">首页</Link>
            <Link href="/chat" onClick={() => setShowMobileMenu(false)}
              className="block px-4 py-2.5 rounded-lg text-sm text-[#666] hover:bg-[#f8f7f5]">聊天室</Link>
            <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#00f2fe] to-[#fe2c55] text-white">🔴 抖音 · 浩哥维修实录</a>
            <a href="https://www.crazy-repair.com" target="_blank" rel="noopener"
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-600">🔧 Crazy维修</a>
            <button onClick={() => { toggleLang(); setShowMobileMenu(false); }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-[#666] hover:bg-[#f8f7f5]">
              <Globe size={14} className="inline-block mr-1" />{lang === 'zh' ? '切换 English' : '切换 中文'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
