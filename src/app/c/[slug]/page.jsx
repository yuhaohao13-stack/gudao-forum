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

  if (!category) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <div className="mb-6">
        <Link href="/" className="text-sm text-[#c23531]/70 hover:text-[#c23531] transition-colors">&larr; 返回首页</Link>
        <h1 className="text-2xl font-bold font-serif text-[#1a1a1a] mt-1">{category.icon} {category.name}</h1>
        <p className="text-[#999] text-sm mt-0.5">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button onClick={() => setSortBy('latest')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'latest' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white text-[#666] border border-[#eee8dc] hover:border-[#c23531] hover:text-[#c23531]'}`}>⏱️ 最新</button>
          <button onClick={() => setSortBy('hot')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${sortBy === 'hot' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white text-[#666] border border-[#eee8dc] hover:border-[#c23531] hover:text-[#c23531]'}`}>🔥 最热</button>
        </div>
        {(!isAnnouncements || isAdmin) && (
          <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 text-xs">✏️ 发新帖</Link>
        )}
      </div>

      {isAnnouncements && !isAdmin && (
        <div className="card p-4 text-center mb-4"><p className="text-[#999] text-sm">🔒 站务管理仅管理员可发帖</p></div>
      )}

      <div className="space-y-2.5">
        {threads.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-[#999] text-sm">这里还没有帖子</p>
            {(!isAnnouncements || isAdmin) && <Link href="/new-thread" className="btn-primary mt-3">发第一条帖子</Link>}
          </div>
        ) : threads.map((t, i) => (
          <Link key={t.id} href={`/t/${t.id}`}
            className={`post-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                {t.is_pinned && <span className="meta-tag bg-[#b8860b]/10 text-[#8b6914] border border-[#8b6914]/20">📌 置顶</span>}
                {(t.profiles?.role === 'admin' || t.profiles?.role === 'moderator') && !t.is_pinned &&
                  <span className="meta-tag bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20">👑 管理员</span>}
                {t.is_locked && <span className="meta-tag bg-[#888]/10 text-[#888] border border-[#888]/20">🔒 已锁</span>}
              </div>
              <h3 className="font-semibold text-[#1a1a1a] truncate leading-snug">{t.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-[#999] truncate min-w-0">
                  <span className="font-medium text-[#666]">{t.profiles?.display_name || t.profiles?.username}</span>
                  <span className="text-[#d8d0c0] mx-1.5">·</span>
                  <span>{new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0 ml-3">
                  <span className="stat">💬 <span className="stat-num">{t.reply_count || 0}</span></span>
                  <span className="stat">👁️ <span className="stat-num">{t.view_count || 0}</span></span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
