'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, MessageCircle, Plus, LogOut, Menu, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import DonateButton from './DonateButton'
import UnreadBadge from './UnreadBadge'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const isChatPage = pathname?.startsWith('/chat')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileSearchOpen(false)
      setMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (mobileSearchOpen) setMobileSearchOpen(false)
  }

  const getInitial = () => {
    if (profile?.display_name) return profile.display_name[0]
    if (profile?.username) return profile.username[0]
    if (user?.email) return user.email[0].toUpperCase()
    return '?'
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center h-14 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">古</span>
            </div>
            <span className="text-base font-semibold text-slate-800 hidden sm:block">
              古道论坛
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1 ml-2">
            <Link
              href="/"
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                !isChatPage
                  ? 'text-slate-800 bg-slate-50 font-medium'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              首页
            </Link>
            <Link
              href="/chat"
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                isChatPage
                  ? 'text-slate-800 bg-slate-50 font-medium'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              聊天室
            </Link>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子..."
                className="w-44 lg:w-52 h-8 bg-slate-50 border border-slate-100 rounded-md pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-slate-200"
              />
            </div>
          </form>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-1.5">
            <DonateButton />

            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-slate-200 border-t-slate-600 rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/messages"
                  className="btn-ghost !px-2 !py-1.5 relative"
                  title="消息"
                >
                  <MessageCircle size={16} />
                  {UnreadBadge && <UnreadBadge />}
                </Link>
                <Link
                  href="/new-thread"
                  className="btn-primary !px-3 !py-1.5 !text-xs"
                >
                  <Plus size={14} />
                  发帖
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-1.5 btn-ghost !px-2 !py-1.5"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-semibold">
                    {getInitial()}
                  </div>
                  <span className="text-sm text-slate-600 font-medium max-w-[6em] truncate">
                    {profile?.display_name || profile?.username || ''}
                  </span>
                </Link>
                <button onClick={handleLogout} className="btn-ghost !px-2 !py-1.5" title="退出">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="btn-primary !px-3 !py-1.5 !text-xs"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen)
                if (mobileMenuOpen) setMobileMenuOpen(false)
              }}
              className="btn-ghost !px-2 !py-1.5"
            >
              <Search size={16} />
            </button>
            {user ? (
              <Link
                href="/new-thread"
                className="btn-primary !px-2.5 !py-1.5 !text-xs"
              >
                <Plus size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn-primary !px-2.5 !py-1.5 !text-xs"
              >
                登录
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="btn-ghost !px-2 !py-1.5"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 anim-fade-in">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索帖子..."
                  autoFocus
                  className="w-full h-9 bg-slate-50 border border-slate-100 rounded-md pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-200"
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-3 border-t border-slate-100 anim-fade-in">
            <nav className="flex flex-col gap-1 pt-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm px-3 py-2 rounded-md transition-colors ${
                  !isChatPage
                    ? 'text-slate-800 bg-slate-50 font-medium'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                首页
              </Link>
              <Link
                href="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm px-3 py-2 rounded-md transition-colors ${
                  isChatPage
                    ? 'text-slate-800 bg-slate-50 font-medium'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                聊天室
              </Link>
              {user ? (
                <>
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm px-3 py-2 rounded-md text-slate-400 hover:text-slate-600"
                  >
                    消息
                  </Link>
                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-slate-400 hover:text-slate-600"
                  >
                    <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-semibold">
                      {getInitial()}
                    </div>
                    {profile?.display_name || profile?.username || '用户'}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-md text-slate-400 hover:text-slate-600 text-left"
                  >
                    <LogOut size={14} />
                    退出
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm px-3 py-2 rounded-md text-slate-400 hover:text-slate-600"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm px-3 py-2 rounded-md text-slate-800 bg-slate-50 font-medium"
                  >
                    注册
                  </Link>
                </>
              )}
              <DonateButton />
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
