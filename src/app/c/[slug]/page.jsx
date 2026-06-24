'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function CategoryPage() {
  const { profile } = useAuth()
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [sortBy, setSortBy] = useState('latest')
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const isAnnouncements = slug === 'announcements'
  const supabase = createClient()

  useEffect(() => {
    const fetchCategory = async () => {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single()
      setCategory(cat)
      if (cat) {
        const { data } = await supabase.from('threads')
          .select('*, profiles!inner(username, display_name, role)').eq('category_id', cat.id)
          .order('is_pinned', { ascending: false }).order(sortBy === 'hot' ? 'reply_count' : 'created_at', { ascending: false })
        const sorted = (data || []).sort((a, b) => {
          const aA = a.profiles?.role === 'admin' || a.profiles?.role === 'moderator'
          const bB = b.profiles?.role === 'admin' || b.profiles?.role === 'moderator'
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
          if (aA !== bB) return aA ? -1 : 1
          return 0
        })
        setThreads(sorted)
      }
    }
    fetchCategory()
  }, [slug, sortBy])

  if (!category) return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="fade-in">
      <div className="mb-6">
        <Link href="/" className="text-sm text-[#c23531]/70 hover:text-[#c23531] transition-colors">&larr; 返回首页</Link>
        <h1 className="text-2xl font-bold text-[#111] mt-1">{category.icon} {category.name}</h1>
        <p className="text-[#8c8c8c] text-sm mt-0.5">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === 'latest' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white/60 text-[#666] hover:text-[#c23531] border border-[#e0d8c8]'}`}
          >⏱️ 最新</button>
          <button onClick={() => setSortBy('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === 'hot' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white/60 text-[#666] hover:text-[#c23531] border border-[#e0d8c8]'}`}
          >🔥 最热</button>
        </div>
        <div className="flex items-center gap-2">
          {isAnnouncements && !isAdmin && <span className="text-xs text-[#8c8c8c] hidden sm:block">仅管理员可发帖</span>}
          {(!isAnnouncements || isAdmin) && (
            <Link href="/new-thread" className="btn-red !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">✏️ 发新帖</Link>
          )}
        </div>
      </div>

      {isAnnouncements && !isAdmin && (
        <div className="mb-4 text-center py-3 paper-card">
          <p className="text-[#8c8c8c] text-sm">🔒 站务管理仅管理员可发帖</p>
        </div>
      )}

      <div className="space-y-2">
        {threads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-[#8c8c8c] text-sm">这里还没有帖子</p>
            {(!isAnnouncements || isAdmin) && <Link href="/new-thread" className="btn-red inline-block mt-3">发第一条帖子</Link>}
          </div>
        ) : (
          threads.map((thread, i) => (
            <Link key={thread.id} href={`/t/${thread.id}`}
              className={`thread-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}
            >
              <div className="text-[#111]">
                <div className="flex items-center gap-1 flex-wrap text-xs mb-1">
                  {thread.is_pinned && <span className="text-[10px] bg-[#b8860b]/10 text-[#8b6914] border border-[#8b6914]/20 px-1.5 py-0.5 rounded font-medium">📌 置顶</span>}
                  {(thread.profiles?.role === 'admin' || thread.profiles?.role === 'moderator') && !thread.is_pinned &&
                    <span className="text-[10px] bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20 px-1.5 py-0.5 rounded font-medium">👑 管理员</span>}
                  {thread.is_locked && <span className="text-[10px] bg-[#888]/10 text-[#666] border border-[#888]/20 px-1.5 py-0.5 rounded font-medium">🔒 已锁</span>}
                </div>
                <div className="font-semibold group-hover:text-[#c23531] transition-colors truncate">{thread.title}</div>
                <div className="text-xs text-[#111] mt-1">
                  <span>{thread.profiles?.display_name || thread.profiles?.username}</span>
                  <span className="text-[#d8d0c0] mx-1">·</span>
                  {new Date(thread.created_at).toLocaleDateString('zh-CN')}
                  <span className="ml-2">💬 {thread.reply_count || 0}</span>
                  <span className="ml-1">👁️ {thread.view_count || 0}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
