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
      {/* Hero */}
      <div className="text-center pt-6 sm:pt-8 pb-2 anim-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1a1a1a]">古道论坛</h1>
        <p className="text-sm text-[#aaa] mt-1.5 tracking-wide">以文会友 · 以友辅仁</p>

        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-5 text-xs text-[#999]">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#1a1a1a]">{totalPosts}</div>
            <div className="mt-0.5">帖子</div>
          </div>
          <div className="w-px h-8 bg-[#eee]" />
          <div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#1a1a1a]">{totalViews.toLocaleString()}</div>
            <div className="mt-0.5">浏览</div>
          </div>
          <div className="w-px h-8 bg-[#eee]" />
          <div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-[#1a1a1a]">{totalUsers}</div>
            <div className="mt-0.5">会员</div>
          </div>
        </div>
      </div>

      {/* 聊天室入口 */}
      <div className="anim-up">
        <Link
          href="/chat"
          className="card flex items-center gap-4 p-4 sm:p-5 hover:bg-[#fafaf8] group"
        >
          <div className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-[#1a1a1a] group-hover:text-[#c23531] transition-colors">
              在线聊天室
            </h3>
            <p className="text-xs text-[#aaa] mt-0.5">10 个话题房间，与全球华人畅聊</p>
          </div>
          <div className="text-sm text-[#ccc] group-hover:text-[#888] transition-colors shrink-0">
            →
          </div>
        </Link>
      </div>

      {/* 公告 */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#888] tracking-wide">📢 站务公告</span>
            <span className="meta-tag bg-[#f5f0e8] text-[#8b6914] border border-[#e8e0d0]">置顶</span>
          </div>
          <div className="space-y-1.5">
            {announcements.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`card-announce p-3 sm:p-3.5 block ${i > 0 ? `anim-delay-${i}` : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[#b8860b] shrink-0">📌</span>
                  <h3 className="text-sm font-semibold text-[#1a1a1a] truncate">{t.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 版块 */}
      <section className="anim-up">
        <h2 className="text-xs font-semibold text-[#bbb] uppercase tracking-widest mb-3">版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/c/${c.slug}`}
              className={`card p-4 sm:p-5 anim-scale ${i > 0 ? `anim-delay-${i}` : ''}
                ${c.slug === 'announcements' ? 'bg-gradient-to-br from-[#fefefc] to-[#fdf8f0]' : ''}`}>
              <div className="text-xl mb-2">{CAT_ICONS[c.slug] || c.icon || '📋'}</div>
              <div className="font-semibold text-sm text-[#1a1a1a]">
                {c.name}
              </div>
              <div className="text-xs text-[#aaa] mt-0.5 line-clamp-1">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 帖子列表 */}
      <section className="anim-up">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'recent' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'
            }`}
          >⏱ 最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'hot' ? 'bg-[#1a1a1a] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'
            }`}
          >🔥 热门</button>
          <Link href="/search" className="ml-auto text-xs text-[#bbb] hover:text-[#888] transition-colors">搜索 →</Link>
        </div>

        <div className="space-y-1.5">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-2xl mb-3">📝</div>
              <p className="text-[#999] text-sm">还没有帖子</p>
              <Link href="/new-thread" className="btn-primary mt-4">发第一条帖子</Link>
            </div>
          ) : (
            (activeTab === 'recent' ? recentThreads : hotThreads).map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`post-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a] truncate leading-snug text-sm">
                    {t.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-[#aaa] truncate min-w-0">
                      <span className="font-medium text-[#888]">{t.profiles?.display_name || t.profiles?.username}</span>
                      <span className="text-[#ddd8d0] mx-1.5">/</span>
                      <span>{t.categories?.name}</span>
                      <span className="text-[#ddd8d0] mx-1.5">/</span>
                      <span>{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs shrink-0 ml-3">
                      <span className="stat">💬 <span className="stat-num">{t.reply_count || 0}</span></span>
                      <span className="stat">👁 <span className="stat-num">{t.view_count || 0}</span></span>
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
