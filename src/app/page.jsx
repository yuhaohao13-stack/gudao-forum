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
    <div className="space-y-6 sm:space-y-8">
      {/* ===== 站点头部 ===== */}
      <div className="text-center pt-4 sm:pt-6 pb-2 anim-fade-in">
        <p className="text-sm text-[#aaa] tracking-wide">以文会友 · 以友辅仁</p>

        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-4 text-sm text-[#999]">
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1a1a1a]">{totalPosts}</div>
            <div className="text-xs mt-0.5">帖子</div>
          </div>
          <div className="w-px h-7 bg-[#eee]" />
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1a1a1a]">{totalViews.toLocaleString()}</div>
            <div className="text-xs mt-0.5">浏览</div>
          </div>
          <div className="w-px h-7 bg-[#eee]" />
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold font-serif text-[#1a1a1a]">{totalUsers}</div>
            <div className="text-xs mt-0.5">会员</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-5">
          <Link href="/new-thread" className="btn-primary">✏️ 发帖</Link>
          <Link href="/chat" className="btn-secondary">💬 聊天室</Link>
        </div>
      </div>

      {/* ===== 快速入口 — 聊天室 ===== */}
      <div className="anim-up">
        <Link
          href="/chat"
          className="card flex items-center gap-4 p-4 sm:p-5 hover:bg-[#fafafa] group"
        >
          <div className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#1a1a1a]">在线聊天室</h3>
            <p className="text-xs text-[#aaa] mt-0.5">10 个话题房间，与全球华人畅聊</p>
          </div>
          <div className="text-sm text-[#ccc] group-hover:text-[#888] transition-colors shrink-0">→</div>
        </Link>
      </div>

      {/* ===== 公告 ===== */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#999] tracking-wide">📢 站务公告</span>
            <span className="tag">置顶</span>
          </div>
          <div className="card divide-y divide-[#f5f5f5]">
            {announcements.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`flex items-center gap-2 px-4 py-3 hover:bg-[#fafafa] transition-colors ${i > 0 ? `anim-delay-${i}` : ''}`}>
                <span className="text-[#b8860b] shrink-0 text-sm">📌</span>
                <span className="text-sm font-medium text-[#1a1a1a] truncate">{t.title}</span>
                <span className="ml-auto text-xs text-[#bbb]">{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 版块 ===== */}
      <section className="anim-up">
        <h2 className="text-xs font-semibold text-[#bbb] uppercase tracking-widest mb-3">版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/c/${c.slug}`}
              className={`feature-card ${i > 0 ? `anim-delay-${i}` : ''}`}>
              <div className="text-xl mb-2">{CAT_ICONS[c.slug] || c.icon || '📋'}</div>
              <div className="font-semibold text-sm text-[#1a1a1a]">{c.name}</div>
              <div className="text-xs text-[#aaa] mt-1 line-clamp-1 leading-relaxed">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 帖子列表 ===== */}
      <section className="anim-up">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'recent' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f5] text-[#888] hover:text-[#1a1a1a]'
            }`}
          >⏱ 最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'hot' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f5] text-[#888] hover:text-[#1a1a1a]'
            }`}
          >🔥 热门</button>
          <Link href="/search" className="ml-auto text-xs text-[#bbb] hover:text-[#888] transition-colors">搜索 →</Link>
        </div>

        <div className="card divide-y divide-[#f5f5f5]">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-[#bbb] text-sm">还没有帖子</p>
              <Link href="/new-thread" className="btn-primary mt-3">发第一条帖子</Link>
            </div>
          ) : (
            (activeTab === 'recent' ? recentThreads : hotThreads).map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`thread-item px-4 first:pt-3 last:pb-3 ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm text-[#1a1a1a] truncate leading-snug">{t.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#bbb]">
                      <span className="text-[#888]">{t.profiles?.display_name || t.profiles?.username}</span>
                      <span>·</span>
                      <span>{t.categories?.name}</span>
                      <span>·</span>
                      <span>{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#bbb] shrink-0 mt-0.5">
                    <span>💬 {t.reply_count || 0}</span>
                    <span>👁 {t.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
