'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Landmark, Search, MessageCircle, Pencil, LogOut, Menu, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from './AuthProvider'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const { user, profile, loading } = useAuth()
  const { lang, toggleLang } = useLanguage()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push(`/search?q=${search.trim()}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-3">
            <div className="w-8 h-8 rounded-md bg-[#0079d3] flex items-center justify-center text-white">
              <Landmark size={17} />
            </div>
            <span className="text-lg font-bold text-[#222]">古道论坛</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/" className={`px-3 py-1.5 rounded-md text-sm font-medium ${pathname === '/' ? 'bg-[#e8f4fd] text-[#0079d3]' : 'text-[#666] hover:text-[#222] hover:bg-gray-100'}`}>首页</Link>
            <Link href="/chat" className={`px-3 py-1.5 rounded-md text-sm font-medium ${pathname?.startsWith('/chat') ? 'bg-[#e8f4fd] text-[#0079d3]' : 'text-[#666] hover:text-[#222] hover:bg-gray-100'}`}>聊天室</Link>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:block relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索" className="input-search w-32 lg:w-40" />
          </form>

          {/* User area */}
          <div className="flex items-center gap-1">
            {loading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#0079d3] rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link href={`/profile/${user.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100">
                  <span className="w-7 h-7 rounded-full bg-[#0079d3] flex items-center justify-center text-xs text-white font-bold">
                    {(profile?.display_name || profile?.username || '?')[0]}
                  </span>
                  <span className="hidden sm:inline text-sm text-[#555] max-w-[4em] truncate">{profile?.display_name || profile?.username}</span>
                </Link>
                <Link href="/messages" className="btn-ghost !p-2 relative"><MessageCircle size={18} /></Link>
                <Link href="/new-thread" className="btn btn-primary !py-1.5 !px-3 !text-xs"><Pencil size={14} /> <span className="hidden sm:inline">发帖</span></Link>
                {isAdmin && <Link href="/admin" className="btn-ghost !text-xs">管理</Link>}
                <button onClick={handleLogout} className="btn-ghost !p-2"><LogOut size={16} /></button>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login" className="px-3 py-1.5 rounded-md text-sm text-[#666] hover:text-[#222] hover:bg-gray-100">登录</Link>
                <Link href="/register" className="btn btn-primary !py-1.5 !px-3 !text-xs">注册</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 rounded-md hover:bg-gray-100">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-3 space-y-1 border-t pt-2">
            <form onSubmit={handleSearch} className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索帖子..." autoFocus
                className="w-full bg-gray-100 rounded-md pl-9 pr-3 py-2 text-sm outline-none focus:bg-white focus:border focus:border-[#0079d3]" />
            </form>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium bg-[#e8f4fd] text-[#0079d3]">首页</Link>
            <Link href="/chat" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#666] hover:bg-gray-100">聊天室</Link>
            <Link href="/new-thread" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#666] hover:bg-gray-100">发帖</Link>
            <button onClick={() => { toggleLang(); setMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-sm text-[#666] hover:bg-gray-100">{lang === 'zh' ? 'English' : '中文'}</button>
          </div>
        )}
      </div>
    </header>
  )
}
