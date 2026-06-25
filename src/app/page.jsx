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
    <div className="space-y-5 sm:space-y-6">
      {/* Hero — 更现代的布局 */}
      <div className="text-center pt-4 sm:pt-6 pb-2 anim-fade-in">
        <p className="text-[#999] text-xs sm:text-sm tracking-wide">以文会友 · 以友辅仁</p>

        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm text-[#999]">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#c23531]">{totalPosts}</div>
            <div className="mt-0.5">帖子</div>
          </div>
          <div className="w-px h-8 bg-[#e0d8c8]" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#c23531]">{totalViews.toLocaleString()}</div>
            <div className="mt-0.5">浏览</div>
          </div>
          <div className="w-px h-8 bg-[#e0d8c8]" />
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#c23531]">{totalUsers}</div>
            <div className="mt-0.5">会员</div>
          </div>
        </div>
      </div>

      {/* 快速入口 — 聊天室 */}
      <div className="anim-up">
        <Link
          href="/chat"
          className="card flex items-center gap-4 p-4 sm:p-5 hover:border-[#c23531]/30 transition-colors group"
        >
          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">💬</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold font-serif text-[#1a1a1a] group-hover:text-[#c23531] transition-colors">
              在线聊天室
            </h3>
            <p className="text-xs text-[#999] mt-0.5">10 个话题房间，会员畅聊，非会员可查看</p>
          </div>
          <div className="text-sm text-[#b0a898] group-hover:text-[#c23531] transition-colors shrink-0">
            进入 →
          </div>
        </Link>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-[#111] font-serif">📢 站务公告</span>
            <span className="meta-tag bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20">置顶</span>
          </div>
          <div className="space-y-1.5">
            {announcements.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`card-announce p-3 sm:p-4 ${i > 0 ? `anim-delay-${i}` : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[#b8860b] shrink-0">📌</span>
                  <h3 className="font-semibold font-serif text-[#1a1a1a] truncate">{t.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Boards */}
      <section className="anim-up">
        <h2 className="text-xs font-semibold text-[#999] uppercase tracking-widest mb-3">版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/c/${c.slug}`}
              className={`card p-3 sm:p-5 anim-scale ${i > 0 ? `anim-delay-${i}` : ''} 
                ${c.slug === 'announcements' ? 'border-[#f0e0c0] bg-gradient-to-br from-white to-[#fffcf5]' : ''}`}>
              <div className="text-2xl mb-2 transition-transform duration-300">{CAT_ICONS[c.slug] || c.icon || '📋'}</div>
              <div className="font-semibold font-serif text-sm text-[#1a1a1a]">
                {c.name}
                {c.slug === 'announcements' && (
                  <span className="ml-1.5 meta-tag bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20 text-[9px]">公告</span>
                )}
              </div>
              <div className="text-xs text-[#999] mt-0.5 line-clamp-1">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Threads */}
      <section className="anim-up">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('recent')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'recent' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white text-[#666] border border-[#ece8e0] hover:border-[#c23531] hover:text-[#c23531]'
            }`}
          >⏱️ 最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'hot' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white text-[#666] border border-[#ece8e0] hover:border-[#c23531] hover:text-[#c23531]'
            }`}
          >🔥 热门</button>
          <Link href="/search" className="ml-auto btn-ghost text-xs">🔍 搜索</Link>
        </div>

        <div className="space-y-1.5">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-3">📝</div>
              <p className="text-[#999] text-sm">还没有帖子</p>
              <Link href="/new-thread" className="btn-primary mt-4">发第一条帖子</Link>
            </div>
          ) : (
            (activeTab === 'recent' ? recentThreads : hotThreads).map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`post-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] truncate leading-snug text-sm sm:text-base">
                    {t.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-[#999] truncate min-w-0">
                      <span className="font-medium text-[#666]">{t.profiles?.display_name || t.profiles?.username}</span>
                      <span className="text-[#d8d0c0] mx-1">/</span>
                      <span>{t.categories?.name}</span>
                      <span className="text-[#d8d0c0] mx-1">/</span>
                      <span>{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs shrink-0 ml-3">
                      <span className="stat">💬 <span className="stat-num">{t.reply_count || 0}</span></span>
                      <span className="stat">👁️ <span className="stat-num">{t.view_count || 0}</span></span>
                    </div>
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
