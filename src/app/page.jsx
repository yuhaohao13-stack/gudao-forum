'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Megaphone, Pin, FileText, Eye, Clock, Flame, ArrowRight, Monitor, Flower2, Package, BookOpen, Sparkles, TrendingUp, Users, BarChart3, ChevronRight, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

const CAT_ICONS = {
  announcements: '📢',
  random: '💬',
  tech: '💻',
  life: '🌸',
  resources: '📦',
  fiction: '📖',
}

export default function Home() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [recentThreads, setRecentThreads] = useState([])
  const [hotThreads, setHotThreads] = useState([])
  const [activeTab, setActiveTab] = useState('recent')
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [todayPosts, setTodayPosts] = useState(0)
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
      const { data: recent } = await rq.order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(15)
      setRecentThreads(recent || [])

      let hq = supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
      if (aid) hq = hq.neq('category_id', aid)
      const { data: hot } = await hq.order('is_pinned', { ascending: false }).order('reply_count', { ascending: false }).limit(15)
      setHotThreads(hot || [])

      const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true })
      setTotalPosts(pc || 0)
      const { data: v } = await supabase.from('threads').select('view_count')
      setTotalViews((v || []).reduce((s, t) => s + (t.view_count || 0), 0))
      const { count: uc } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setTotalUsers(uc || 0)

      // Count today's posts
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: tc } = await supabase.from('threads').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString())
      setTodayPosts(tc || 0)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8 sm:space-y-10">

      {/* ===== 统计栏 ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 anim-fade-in">
        <div className="stat-card">
          <div className="text-2xl sm:text-3xl font-bold text-[#b45309]">{totalPosts}</div>
          <div className="text-xs text-[#999] mt-0.5 tracking-wider">帖子总数</div>
        </div>
        <div className="stat-card">
          <div className="text-2xl sm:text-3xl font-bold text-[#b45309]">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-[#999] mt-0.5 tracking-wider">累计浏览</div>
        </div>
        <div className="stat-card">
          <div className="text-2xl sm:text-3xl font-bold text-[#b45309]">{totalUsers}</div>
          <div className="text-xs text-[#999] mt-0.5 tracking-wider">注册会员</div>
        </div>
        <div className="stat-card">
          <div className="text-2xl sm:text-3xl font-bold text-[#b45309]">{todayPosts}</div>
          <div className="text-xs text-[#999] mt-0.5 tracking-wider">今日发帖</div>
        </div>
      </div>

      {/* ===== 公告 ===== */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="section-title"><Megaphone size={14} /> 站务公告</div>
          <div className="bg-gradient-to-r from-[#fffbeb] to-[#fff] border border-[#fde68a] rounded-2xl divide-y divide-[#fef3c7] overflow-hidden">
            {announcements.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fffbeb]/80 transition-colors">
                <Pin size={14} className="text-[#b45309] shrink-0" />
                <span className="text-sm font-medium text-[#1c1917] truncate">{t.title}</span>
                <span className="ml-auto text-xs text-[#bbb] shrink-0">
                  {new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                </span>
                <ChevronRight size={14} className="text-[#ccc] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== 板块网格 ===== */}
      <section className="anim-up">
        <div className="section-title"><Sparkles size={14} /> 版块分区</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/c/${c.slug}`}
              className={`feature-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
              <div className="text-2xl mb-3">{CAT_ICONS[c.slug] || '📄'}</div>
              <div className="font-semibold text-[#1c1917]">{c.name}</div>
              <div className="text-xs text-[#aaa] mt-1.5 line-clamp-2 leading-relaxed">{c.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== 帖子列表 ===== */}
      <section className="anim-up">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActiveTab('recent')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'recent'
                ? 'bg-[#b45309] text-white shadow-md shadow-[#b45309]/20'
                : 'bg-[#f3f1ed] text-[#888] hover:text-[#1c1917] hover:bg-[#e8e2d8]'
            }`}
          ><Clock size={18} className="inline-block align-text-bottom mr-1" />最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'hot'
                ? 'bg-[#b45309] text-white shadow-md shadow-[#b45309]/20'
                : 'bg-[#f3f1ed] text-[#888] hover:text-[#1c1917] hover:bg-[#e8e2d8]'
            }`}
          ><Flame size={18} className="inline-block align-text-bottom mr-1" />热门</button>
          <Link href="/search" className="ml-auto text-xs text-[#bbb] hover:text-[#b45309] transition-colors">
            搜索 <ArrowRight size={12} className="inline-block align-text-bottom" />
          </Link>
        </div>

        <div className="card overflow-hidden">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-[#bbb] text-sm">还没有帖子，来发第一篇吧</p>
              <Link href="/new-thread" className="btn-primary mt-4">发布第一篇帖子</Link>
            </div>
          ) : (
            <div className="divide-y divide-[#f5f4f0]">
              {(activeTab === 'recent' ? recentThreads : hotThreads).map((t, i) => (
                <Link key={t.id} href={`/t/${t.id}`}
                  className={`thread-item ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-[#1c1917] truncate leading-snug">{t.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[#999]">
                        <span className="text-[#888]">{t.profiles?.display_name || t.profiles?.username}</span>
                        <span className="text-[#ddd]">·</span>
                        <span className="text-[#b45309]/70">{t.categories?.name}</span>
                        <span className="text-[#ddd]">·</span>
                        <span>{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#bbb] shrink-0 mt-0.5">
                      <span className="flex items-center gap-1"><MessageSquare size={13} /> {t.reply_count || 0}</span>
                      <span className="flex items-center gap-1"><Eye size={13} /> {t.view_count || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== 社区氛围 ===== */}
      <section className="text-center py-6 sm:py-8 anim-fade-in">
        <div className="max-w-md mx-auto">
          <div className="text-3xl mb-2">🏮</div>
          <p className="text-sm text-[#888] leading-relaxed">
            以文会友 · 以友辅仁<br />
            古道论坛，一个温暖的华人中文社区
          </p>
        </div>
      </section>
    </div>
  )
}
