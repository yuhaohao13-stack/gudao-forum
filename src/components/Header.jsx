'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Landmark, Search, MessageCircle, Pencil, X, Globe } from 'lucide-react'
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
        {/* 顶部行：Logo居中 + 语言切换最右 */}
        <div className="flex items-center h-14 sm:h-16 overflow-hidden relative">
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 group whitespace-nowrap">
            <Landmark size={36} className="inline-block" />
            <span className="text-[2rem] sm:text-[2.25rem] font-bold font-serif tracking-wide text-[#1a1a1a]">古道论坛</span>
          </Link>
          <div className="flex-1"></div>
          <button onClick={toggleLang}
            className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-[#e0ddd5] text-[#888] hover:text-[#1a1a1a] hover:border-[#ccc] transition-colors whitespace-nowrap"
          >
            <Globe size={14} className="inline-block align-text-bottom mr-1" />{lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>

        {/* 操作行：导航 + 打赏（左） | 会员/私信/发帖/搜索（右） */}
        <div className="flex items-center justify-between pb-3 gap-1 overflow-x-auto scrollbar-none">
          {/* 左：导航 + 打赏 */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/"
              className={`whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                !isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
              }`}
            >{t('nav.home')}</Link>
            <Link href="/chat"
              className={`whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                isChatPage ? 'bg-[#f5f5f5] text-[#1a1a1a]' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
              }`}
            >{t('nav.chat')}</Link>
            <DonateButton className="whitespace-nowrap text-sm font-semibold px-3 py-1.5 rounded-lg text-[#c23531] hover:bg-[#fef2f0] transition-colors" />
          </div>

          {/* 右：用户操作 */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            {/* 桌面搜索框 */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('nav.search_placeholder')}
                  className="w-36 lg:w-44 bg-[#f8f8f8]" border border-transparent rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none transition-all focus:border-[#e5e5e5] focus:bg-white focus:w-48"
                />
              </div>
            </form>

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* 会员名：桌面全显示，移动端也全显示 */}
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1 btn-ghost !px-1.5 sm:!px-2 !py-1">
                  <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] sm:text-xs text-white font-bold shadow-sm">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-[10px] sm:text-xs text-[#999] font-normal whitespace-nowrap">{t('nav.profile')}：</span>
                  <span className="text-[10px] sm:text-sm font-medium text-[#555] max-w-[5em] truncate">
                    {profile?.display_name || profile?.username || ''}
                  </span>
                </Link>
                {/* 私信：桌面显示完整，移动端仅图标 */}
                <Link href="/messages" className="btn-ghost !px-1.5 sm:!px-2 !py-1.5 flex items-center gap-0.5 sm:gap-1">
                  <span className="hidden sm:inline text-xs text-[#999]">{t('nav.messages')}</span>
                  <MessageCircle size={16} className="inline-block align-text-bottom" />
                  {UnreadBadge && <UnreadBadge />}
                </Link>
                <Link href="/new-thread" className="btn-primary !px-2 sm:!px-3 !py-1.5 !text-xs whitespace-nowrap">
                  <Pencil size={16} className="inline-block align-text-bottom" /> <span className="hidden sm:inline">{t('nav.new_thread')}</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="btn-ghost !text-xs">{t('nav.admin')}</Link>
                )}
                <button onClick={handleLogout} className="hidden sm:inline-flex btn-ghost !text-xs text-[#bbb]">
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-xs sm:text-sm text-[#888] hover:text-[#1a1a1a] transition-colors">{t('nav.login')}</Link>
                <Link href="/register" className="btn-primary !px-2 sm:!px-3 !py-1.5 !text-xs">{t('nav.register')}</Link>
              </div>
            )}

            {/* 移动端搜索开关 */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="sm:hidden btn-ghost !px-2 !py-1.5 text-[#999]"
            >
              {showSearch ? <X size={16} /> : <Search size={16} />}
            </button>
          </div>
        </div>

        {/* 移动端搜索弹出框 */}
        {showSearch && (
          <div className="sm:hidden pb-3 anim-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('nav.search_placeholder')}
                autoFocus
                className="w-full bg-[#f8f8f8]" border border-[#f0f0f0] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#e0e0e0] focus:bg-white"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
