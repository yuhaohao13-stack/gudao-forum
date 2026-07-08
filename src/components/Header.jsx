'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Landmark, Search, MessageCircle, Pencil, X, Globe, LogOut } from 'lucide-react'
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
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'

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
        <div className="flex items-center h-20 sm:h-24 relative">
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 group whitespace-nowrap">
            <Landmark size={36} className="inline-block" />
            <span className="text-[2rem] sm:text-[2.25rem] font-bold tracking-wide text-[#1a1a1a]">古道论坛</span>
          </Link>
          <div className="flex-1"></div>
          <button onClick={toggleLang}
            className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg border border-[#e0ddd5] text-[#888] hover:text-[#1a1a1a] hover:border-[#ccc] transition-colors whitespace-nowrap"
          >
            <Globe size={14} className="inline-block align-text-bottom mr-1" />{lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>

        {/* 空白间隔行（内联style确保生效） */}
        <div style={{height: '24px'}} className="sm:hidden"></div>
        <div style={{height: '40px'}} className="hidden sm:block"></div>

        {/* 操作行：导航 + 打赏（左） | 会员/私信/发帖/搜索（右） */}
        <div className="flex items-center justify-between pb-3 gap-1 overflow-x-auto scrollbar-none">
          {/* 左：导航 + 打赏 */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/"
              className="whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors bg-[#f5f5f5] text-[#1a1a1a]"
            >{t('nav.home')}</Link>
            <a href="https://v.douyin.com/NvUr5C82ZDM/" target="_blank" rel="noopener"
              className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e8e8e8] transition-colors"
              title="浩哥维修实录 @Crazy维修 抖音">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="shrink-0">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.35 0 .69.06 1.01.18V8.48a6.34 6.34 0 0 0-1.01-.08C5.9 8.4 3 11.3 3 14.86c0 3.56 2.9 6.46 6.46 6.46 3.56 0 6.46-2.9 6.46-6.46V9.33a8.28 8.28 0 0 0 4.67 1.4v-3.4a4.84 4.84 0 0 1-1-.64z"/>
              </svg>
              <span>浩哥抖音</span>
            </a>
            <a href="https://www.crazy-repair.com" target="_blank" rel="noopener" className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e8e8e8] transition-colors">🔧 crazy 维修</a>
            <DonateButton className="flex items-center gap-2 whitespace-nowrap text-xl sm:text-2xl font-bold px-8 py-5 rounded-lg bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e8e8e8] transition-colors" />
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
                  className="w-36 lg:w-44 bg-[#f8f8f8] border border-transparent rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#1a1a1a] placeholder-[#bbb] outline-none transition-all focus:border-[#e5e5e5] focus:bg-white focus:w-48"
                />
              </div>
            </form>

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* 会员名：桌面全显示，移动端也全显示 */}
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1 btn-ghost !px-1.5 sm:!px-2 !py-1">
                  <span className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] sm:text-xs text-white font-bold">
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
                <button onClick={handleLogout} className="btn-ghost !px-1.5 !py-1.5 text-[#999] hover:text-[#c23531]">
                  <span className="hidden sm:inline !text-xs">{t('nav.logout')}</span>
                  <LogOut size={16} className="inline-block sm:hidden" />
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
                className="w-full bg-[#f8f8f8] border border-[#f0f0f0] rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#e0e0e0] focus:bg-white"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
