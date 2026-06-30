'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Megaphone, Pin, FileText, Eye, Clock, Flame, ArrowRight, Monitor, Flower2, Package, BookOpen, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CAT_ICONS = {
  announcements: <Megaphone size={20} className="inline-block" />,
  random: <MessageCircle size={20} className="inline-block" />,
  tech: <Monitor size={20} className="inline-block" />,
  life: <Flower2 size={20} className="inline-block" />,
  resources: <Package size={20} className="inline-block" />,
  fiction: <BookOpen size={20} className="inline-block" />,
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
      {/* ===== 站点头部（一排） ===== */}
      <div className="flex items-center justify-between gap-4 py-4 sm:py-5 flex-wrap anim-fade-in">
        <div className="flex items-center gap-3 sm:gap-5 text-sm flex-wrap">
          <span className="text-sm text-[#aaa] tracking-wide whitespace-nowrap">以文会友 · 以友辅仁</span>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-[#999]">
            <span><strong className="text-sm font-semibold text-[#1a1a1a]">{totalPosts}</strong> 帖子</span>
            <span className="text-[#ddd]">|</span>
            <span><strong className="text-sm font-semibold text-[#1a1a1a]">{totalViews.toLocaleString()}</strong> 浏览</span>
            <span className="text-[#ddd]">|</span>
            <span><strong className="text-sm font-semibold text-[#1a1a1a]">{totalUsers}</strong> 会员</span>
          </div>
        </div>
        <Link href="/chat" className="btn-secondary text-xs whitespace-nowrap"><MessageCircle size={14} className="inline-block align-text-bottom" /> 聊天室</Link>
      </div>

      {/* ===== 公告 ===== */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#999] tracking-wide"><Megaphone size={14} className="inline-block align-text-bottom" /> 站务公告</span>
            <span className="tag">置顶</span>
          </div>
          <div className="card divide-y divide-[#f5f5f5]">
            {announcements.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`flex items-center gap-2 px-4 py-3 hover:bg-[#fafafa] transition-colors ${i > 0 ? `anim-delay-${i}` : ''}`}>
                <Pin size={14} className="text-[#b8860b] shrink-0 inline-block" />
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
              <div className="text-xl mb-2">{CAT_ICONS[c.slug] || c.icon || <FileText size={20} className="inline-block" />}</div>
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
            className={`px-5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              activeTab === 'recent' ? 'bg-[#1a1a1a] text-white shadow-md' : 'bg-[#f5f5f5] text-[#888] hover:text-[#1a1a1a] hover:bg-[#eee]'
            }`}
          ><Clock size={22} className="inline-block align-text-bottom" /> 最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
              activeTab === 'hot' ? 'bg-[#1a1a1a] text-white shadow-md' : 'bg-[#f5f5f5] text-[#888] hover:text-[#1a1a1a] hover:bg-[#eee]'
            }`}
          ><Flame size={22} className="inline-block align-text-bottom" /> 热门</button>
          <Link href="/search" className="ml-auto text-xs text-[#bbb] hover:text-[#888] transition-colors">搜索 <ArrowRight size={12} className="inline-block align-text-bottom" /></Link>
        </div>

        <div className="card divide-y divide-[#f5f5f5]">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-2"><FileText size={28} className="inline-block text-[#ccc]" /></div>
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
                    <span><MessageCircle size={14} className="inline-block align-text-bottom" /> {t.reply_count || 0}</span>
                    <span><Eye size={14} className="inline-block align-text-bottom" /> {t.view_count || 0}</span>
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
