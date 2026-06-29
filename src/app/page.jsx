'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const CAT_ICONS = {
  announcements: '📢', random: '💬', tech: '💻', life: '🌸', resources: '📦', fiction: '📖',
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [recentThreads, setRecentThreads] = useState([])
  const [hotThreads, setHotThreads] = useState([])
  const [activeTab, setActiveTab] = useState('recent')
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) { const [a] = sorted.splice(annIdx, 1); sorted.unshift(a) }
      setCategories(sorted)

      const annCat = sorted.find(c => c.slug === 'announcements')
      if (annCat) {
        const { data: a } = await supabase.from('threads').select('*, profiles(username, display_name)').eq('category_id', annCat.id).order('created_at', { ascending: false }).limit(5)
        setAnnouncements(a || [])
      }

      const aid = annCat?.id
      let rq = supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
      if (aid) rq = rq.neq('category_id', aid)
      const { data: recent } = await rq.order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(20)
      setRecentThreads(recent || [])

      let hq = supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
      if (aid) hq = hq.neq('category_id', aid)
      const { data: hot } = await hq.order('is_pinned', { ascending: false }).order('reply_count', { ascending: false }).limit(20)
      setHotThreads(hot || [])

      const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true })
      setTotalPosts(pc || 0)
      const { data: v } = await supabase.from('threads').select('view_count')
      setTotalViews((v || []).reduce((s, t) => s + (t.view_count || 0), 0))
      const { count: uc } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setTotalUsers(uc || 0)
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* ===== Hero ===== */}
      <div className="hero-section anim-fade-in">
        <h1>古道论坛</h1>
        <p className="tagline">以文会友 · 以友辅仁</p>
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6 text-sm text-[#999]">
          <div>
            <div className="text-2xl font-bold font-serif text-[#1a1a1a]">{totalPosts}</div>
            <div className="mt-0.5">帖子</div>
          </div>
          <div className="w-px h-8 bg-[#eee]" />
          <div>
            <div className="text-2xl font-bold font-serif text-[#1a1a1a]">{totalViews.toLocaleString()}</div>
            <div className="mt-0.5">浏览</div>
          </div>
          <div className="w-px h-8 bg-[#eee]" />
          <div>
            <div className="text-2xl font-bold font-serif text-[#1a1a1a]">{totalUsers}</div>
            <div className="mt-0.5">会员</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link href="/new-thread" className="btn-primary">✏️ 发帖</Link>
          <Link href="/chat" className="btn-secondary">💬 聊天室</Link>
        </div>
      </div>

      {/* ===== 公告 ===== */}
      {announcements.length > 0 && (
        <section className="mb-8 anim-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#999] tracking-wide">📢 公告</span>
          </div>
          <div className="space-y-1.5">
            {announcements.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`card p-3 flex items-center gap-2 hover:bg-[#fafafa] ${i > 0 ? `anim-delay-${i}` : ''}`}>
                <span className="text-[#b8860b] shrink-0 text-sm">📌</span>
                <span className="text-sm font-medium text-[#1a1a1a] truncate">{t.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 版块卡片网格 ===== */}
      <section className="mb-8 anim-up">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/c/${c.slug}`}
              className={`feature-card ${i > 0 ? `anim-delay-${i}` : ''}`}>
              <div className="text-2xl mb-2">{CAT_ICONS[c.slug] || c.icon || '📋'}</div>
              <div className="font-semibold text-sm text-[#1a1a1a]">{c.name}</div>
              <div className="text-xs text-[#aaa] mt-1 line-clamp-1 leading-relaxed">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 最新 / 热门帖子 ===== */}
      <section className="anim-up">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recent' ? 'bg-[#1a1a1a] text-white' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
            }`}
          >最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'hot' ? 'bg-[#1a1a1a] text-white' : 'text-[#999] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
            }`}
          >热门</button>
          <Link href="/search" className="ml-auto text-xs text-[#bbb] hover:text-[#888] transition-colors">搜索 →</Link>
        </div>

        {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#eee] rounded-xl">
            <p className="text-[#bbb] text-sm">还没有帖子</p>
            <Link href="/new-thread" className="btn-primary mt-3">发第一条帖子</Link>
          </div>
        ) : (
          <div className="card divide-y divide-[#f5f5f5]">
            {(activeTab === 'recent' ? recentThreads : hotThreads).map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`} className="thread-item px-4 first:pt-4 last:pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-[#1a1a1a] truncate text-sm">{t.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#bbb]">
                      <span>{t.profiles?.display_name || t.profiles?.username}</span>
                      <span>·</span>
                      <span>{t.categories?.name}</span>
                      <span>·</span>
                      <span>{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#bbb] shrink-0">
                    <span>💬 {t.reply_count || 0}</span>
                    <span>👁 {t.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
