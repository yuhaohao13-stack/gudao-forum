'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Flame, MessageSquare, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CAT_COLORS = {
  announcements: ['#fef3c7', '#b45309'],
  random: ['#dbeafe', '#2563eb'],
  tech: ['#e0e7ff', '#4338ca'],
  life: ['#fce7f3', '#db2777'],
  resources: ['#d1fae5', '#059669'],
  fiction: ['#f3e8ff', '#7c3aed'],
}

export default function Home() {
  const [cats, setCats] = useState([])
  const [threads, setThreads] = useState([])
  const [tab, setTab] = useState('latest')
  const [stats, setStats] = useState({ posts: 0, users: 0 })
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      const { data: c } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = c || []
      const annIdx = sorted.findIndex(x => x.slug === 'announcements')
      if (annIdx > 0) { const [a] = sorted.splice(annIdx, 1); sorted.unshift(a) }
      setCats(sorted)

      const aid = sorted.find(x => x.slug === 'announcements')?.id
      let q = supabase.from('threads').select('*, profiles(username,display_name), categories(name,slug)')
      if (aid) q = q.neq('category_id', aid)
      const { data: t } = await q.order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(20)
      setThreads(t || [])

      const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true })
      const { count: uc } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setStats({ posts: pc || 0, users: uc || 0 })
    })()
  }, [])

  const initials = (p) => (p?.display_name || p?.username || '?')[0]
  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime()
    if (diff < 3600000) return Math.floor(diff/60000)+'m'
    if (diff < 86400000) return Math.floor(diff/3600000)+'h'
    return new Date(d).toLocaleDateString('zh-CN', {month:'short',day:'numeric'})
  }

  return (
    <div className="space-y-6">

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-[#888]">
        <span><strong className="text-[#222]">{stats.posts}</strong> 帖子</span>
        <span className="text-[#ddd]">·</span>
        <span><strong className="text-[#222]">{stats.users}</strong> 会员</span>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {cats.map(c => {
          const cc = CAT_COLORS[c.slug] || ['#eee', '#666']
          return (
            <Link key={c.id} href={`/c/${c.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{ background: cc[0], color: cc[1] }}>
              {c.name}
            </Link>
          )
        })}
        <Link href="/chat"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#e8e8e8] text-[#888] hover:bg-[#ddd]">
          💬 聊天
        </Link>
      </div>

      {/* Topic tabs */}
      <div className="flex items-center gap-2">
        <button onClick={() => setTab('latest')}
          className={`btn ${tab === 'latest' ? 'btn-primary' : 'btn-ghost'}`}>
          <Clock size={14} /> 最新
        </button>
        <button onClick={() => setTab('hot')}
          className={`btn ${tab === 'hot' ? 'btn-primary' : 'btn-ghost'}`}>
          <Flame size={14} /> 热门
        </button>
        <Link href="/new-thread" className="btn btn-primary ml-auto !py-1.5 !text-xs">
          <MessageSquare size={13} /> 发帖
        </Link>
      </div>

      {/* Topic list */}
      <div className="card">
        {threads.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#bbb] text-sm">暂无帖子</p>
            <Link href="/new-thread" className="btn btn-primary mt-3">发第一篇</Link>
          </div>
        ) : (
          threads.map((t, i) => {
            const cc = CAT_COLORS[t.categories?.slug] || ['#eee', '#666']
            return (
              <Link key={t.id} href={`/t/${t.id}`} className="topic-row">
                {/* Avatar */}
                <div className="avatar shrink-0 mt-0.5">
                  {initials(t.profiles)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-medium text-[#222] truncate leading-snug">
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#999]">
                    <span style={{ background: cc[0], color: cc[1] }}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {t.categories?.name}
                    </span>
                    <span>{t.profiles?.display_name || t.profiles?.username}</span>
                    <span>·</span>
                    <span>{timeAgo(t.created_at)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 shrink-0 text-xs text-[#bbb]">
                  <span className="flex items-center gap-1"><MessageSquare size={13} /> {t.reply_count || 0}</span>
                  <span className="flex items-center gap-1"><Eye size={13} /> {t.view_count || 0}</span>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <p className="text-center text-xs text-[#ccc] py-2">以文会友 · 以友辅仁</p>
    </div>
  )
}
