'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Landmark, Search, MessageCircle, Pencil, LogOut, Menu, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'
import DonateButton from './DonateButton'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isChat = pathname?.startsWith('/chat')

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e2e8f0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Top row: Logo + Desktop nav + Search + User actions */}
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded bg-[#334155] flex items-center justify-center text-white text-sm font-bold">
              古
            </div>
            <span className="text-base font-bold text-[#1e293b]">古道论坛</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isHome ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'
              }`}
            >
              首页
            </Link>
            <Link
              href="/chat"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isChat ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'
              }`}
            >
              聊天室
            </Link>
          </nav>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-xs">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-md pl-9 pr-3 py-1.5 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none transition-all focus:border-[#334155] focus:bg-white"
              />
            </div>
          </form>

          {/* Desktop user actions */}
          <div className="hidden sm:flex items-center gap-2">
            {loading ? (
              <div className="w-4 h-4 border-[1.5px] border-[#cbd5e1] border-t-[#1e293b] rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href={`/profile/${user.id}`} className="btn-ghost !px-2 !py-1">
                  <span className="w-7 h-7 rounded-full bg-[#e2e8f0] flex items-center justify-center text-xs text-[#475569] font-medium">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="text-xs text-[#475569] max-w-[6em] truncate">
                    {profile?.display_name || profile?.username || ''}
                  </span>
                </Link>
                <Link href="/messages" className="btn-ghost !px-2 !py-1.5">
                  <MessageCircle size={16} />
                </Link>
                <Link href="/new-thread" className="btn-primary !px-3 !py-1.5">
                  <Pencil size={14} />
                  发帖
                </Link>
                <button onClick={handleLogout} className="btn-ghost !px-2 !py-1.5">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost">登录</Link>
                <Link href="/register" className="btn-primary">注册</Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden btn-ghost !px-2 !py-1.5"
            aria-label="菜单"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-3 anim-fade-in border-t border-[#e2e8f0] pt-3">
            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isHome ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-[#f1f5f9]'
                }`}
              >
                首页
              </Link>
              <Link
                href="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isChat ? 'bg-[#f1f5f9] text-[#1e293b]' : 'text-[#64748b] hover:bg-[#f1f5f9]'
                }`}
              >
                聊天室
              </Link>
            </nav>

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索帖子..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-md pl-9 pr-3 py-2 text-sm text-[#1e293b] placeholder-[#94a3b8] outline-none focus:border-[#334155] focus:bg-white"
              />
            </form>

            {/* Mobile user actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {loading ? (
                <div className="w-4 h-4 border-[1.5px] border-[#cbd5e1] border-t-[#1e293b] rounded-full animate-spin" />
              ) : user ? (
                <>
                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 btn-ghost !px-2 !py-1.5"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#e2e8f0] flex items-center justify-center text-xs text-[#475569] font-medium">
                      {(profile?.display_name || profile?.username || '?')[0]}
                    </span>
                    <span className="text-sm text-[#475569]">
                      {profile?.display_name || profile?.username || ''}
                    </span>
                  </Link>
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-ghost !px-2 !py-1.5"
                  >
                    <MessageCircle size={16} />
                  </Link>
                  <Link
                    href="/new-thread"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary !px-3 !py-1.5"
                  >
                    <Pencil size={14} />
                    发帖
                  </Link>
                  <button onClick={handleLogout} className="btn-ghost !px-2 !py-1.5">
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost" onClick={() => setMobileMenuOpen(false)}>登录</Link>
                  <Link href="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>注册</Link>
                </>
              )}
            </div>

            <DonateButton />
          </div>
        )}
      </div>
    </header>
  )
}
