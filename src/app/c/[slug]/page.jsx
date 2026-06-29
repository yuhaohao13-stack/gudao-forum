'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function CategoryPage() {
  const { profile } = useAuth()
  const { slug } = useParams()
  const router = useRouter()
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [sortBy, setSortBy] = useState('latest')
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const isAnnouncements = slug === 'announcements'
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
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
    fetch()
  }, [slug, sortBy])

  const togglePin = async (e, thread) => {
    e.stopPropagation()
    const newVal = !thread.is_pinned
    await supabase.from('threads').update({ is_pinned: newVal }).eq('id', thread.id)
    setThreads(threads.map(t => t.id === thread.id ? { ...t, is_pinned: newVal } : t))
  }

  if (!category) return <div className="flex justify-center py-16"><div className="w-4 h-4 border-[1.5px] border-[#ccc] border-t-[#1a1a1a] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <div className="mb-5">
        <Link href="/" className="text-xs text-[#bbb] hover:text-[#888] transition-colors">&larr; 首页</Link>
        <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mt-1">{category.icon} {category.name}</h1>
        <p className="text-[#aaa] text-xs mt-0.5">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          <button onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'latest' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>⏱ 最新</button>
          <button onClick={() => setSortBy('hot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sortBy === 'hot' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>🔥 最热</button>
        </div>
        {(!isAnnouncements || isAdmin) && (
          <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 text-xs">✏️ 发帖</Link>
        )}
      </div>

      {isAnnouncements && !isAdmin && (
        <div className="card p-3 text-center mb-4"><p className="text-[#aaa] text-xs">🔒 此版块仅管理员可发帖</p></div>
      )}

      <div className="space-y-1.5">
        {threads.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-2xl mb-2">📭</div>
            <p className="text-[#999] text-xs">这里还没有帖子</p>
            {(!isAnnouncements || isAdmin) && <Link href="/new-thread" className="btn-primary mt-3">发第一条帖子</Link>}
          </div>
        ) : threads.map((t, i) => (
          <div key={t.id} onClick={() => router.push(`/t/${t.id}`)}
            className={`post-card cursor-pointer ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  {t.is_pinned && <span className="meta-tag bg-[#f5f0e8] text-[#8b6914] border border-[#e8e0d0]">📌 置顶</span>}
                  {(t.profiles?.role === 'admin' || t.profiles?.role === 'moderator') && !t.is_pinned &&
                    <span className="meta-tag bg-[#f5f0e8] text-[#8b6914] border border-[#e8e0d0]">👑 管理员</span>}
                  {t.is_locked && <span className="meta-tag bg-[#f5f0e8] text-[#888] border border-[#e8e0d0]">🔒 已锁</span>}
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm truncate leading-snug">{t.title}</h3>
                <div className="text-xs text-[#aaa] mt-1">
                  <span className="font-medium text-[#888]">{t.profiles?.display_name || t.profiles?.username}</span>
                  <span className="text-[#ddd8d0] mx-1">·</span>
                  <span>{new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                  <span className="ml-2 stat">💬 <span className="stat-num">{t.reply_count || 0}</span></span>
                  <span className="ml-1.5 stat">👁 <span className="stat-num">{t.view_count || 0}</span></span>
                </div>
              </div>
              {isAdmin && (
                <button onClick={(e) => togglePin(e, t)}
                  className={`shrink-0 mt-0.5 px-1.5 py-1 rounded text-xs transition-all ${t.is_pinned ? 'text-[#8b6914] bg-[#f5f0e8]' : 'text-[#ddd] hover:text-[#8b6914] hover:bg-[#f5f0e8]'}`}
                  title={t.is_pinned ? '取消置顶' : '置顶'}>
                  📌
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
