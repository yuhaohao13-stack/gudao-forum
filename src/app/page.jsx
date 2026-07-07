'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Megaphone, Pin, Eye, Flame, Clock, MessageSquare, ArrowRight, TrendingUp, Sparkles, ChevronRight, PoundSterling } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

const CAT_COLORS = {
  announcements: { bg: '#fef3c7', text: '#b45309' },
  random: { bg: '#dbeafe', text: '#2563eb' },
  tech: { bg: '#e0e7ff', text: '#4338ca' },
  life: { bg: '#fce7f3', text: '#db2777' },
  resources: { bg: '#d1fae5', text: '#059669' },
  fiction: { bg: '#f3e8ff', text: '#7c3aed' },
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
      const { count: tc } = await supabase.from('threads').select('*', { count: 'exact', head: true }).gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString())
      setTodayPosts(tc || 0)
    }
    fetchData()
  }, [])

  const getInitial = (p) => (p?.display_name || p?.username || '?')[0]

  return (
    <div className="space-y-5">

      {/* 统计栏 — 精简 */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 anim-fade-in">
        {[
          { label: '帖子', value: totalPosts },
          { label: '浏览', value: totalViews.toLocaleString() },
          { label: '会员', value: totalUsers },
          { label: '今日', value: todayPosts },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-[#e8e2d8] rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-[#2563eb]">{s.value}</div>
            <div className="text-[10px] sm:text-xs text-[#999] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 公告栏 */}
      {announcements.length > 0 && (
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl overflow-hidden anim-fade-in">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#fde68a] bg-[#fef3c7]/50">
            <Megaphone size={14} className="text-[#b45309]" />
            <span className="text-xs font-semibold text-[#b45309]">公告</span>
          </div>
          {announcements.map((t, i) => (
            <Link key={t.id} href={`/t/${t.id}`}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#fffbeb] transition-colors border-b border-[#fef3c7] last:border-0">
              <Pin size={12} className="text-[#b45309] shrink-0" />
              <span className="text-sm text-[#1c1917] truncate flex-1">{t.title}</span>
              <span className="text-[10px] text-[#bbb] shrink-0">{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
            </Link>
          ))}
        </div>
      )}

      {/* 分类导航 — 紧凑彩色标签 */}
      <div className="flex flex-wrap gap-2 anim-fade-in">
        {categories.map(c => {
          const cc = CAT_COLORS[c.slug] || { bg: '#f3f1ed', text: '#666' }
          return (
            <Link key={c.id} href={`/c/${c.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{ backgroundColor: cc.bg, color: cc.text }}>
              {c.name}
            </Link>
          )
        })}
        <Link href="/chat"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#f0f0f0] text-[#888] hover:bg-[#e8e8e8] transition-all">
          💬 聊天室
        </Link>
      </div>

      {/* 话题列表 */}
      <section className="anim-up">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setActiveTab('recent')}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'recent' ? 'bg-[#2563eb] text-white shadow-sm' : 'bg-[#f3f1ed] text-[#888] hover:text-[#1c1917] hover:bg-[#e8e2d8]'
            }`}>
            <Clock size={15} className="inline-block align-text-bottom mr-1" />最新
          </button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'hot' ? 'bg-[#2563eb] text-white shadow-sm' : 'bg-[#f3f1ed] text-[#888] hover:text-[#1c1917] hover:bg-[#e8e2d8]'
            }`}>
            <Flame size={15} className="inline-block align-text-bottom mr-1" />热门
          </button>
          <Link href="/new-thread" className="ml-auto btn-primary !px-3 !py-1.5 !text-xs">
            <MessageSquare size={14} className="inline-block" /> 发帖
          </Link>
        </div>

        <div className="card">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm text-[#bbb]">还没有帖子</p>
              <Link href="/new-thread" className="btn-primary mt-3">发布第一篇帖子</Link>
            </div>
          ) : (
            (activeTab === 'recent' ? recentThreads : hotThreads).map((t, i) => {
              const cc = CAT_COLORS[t.categories?.slug] || { bg: '#f3f1ed', text: '#666' }
              return (
                <Link key={t.id} href={`/t/${t.id}`}
                  className={`topic-item ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>

                  {/* 头像 — 这是核心视觉元素 */}
                  <div className="avatar avatar-sm shrink-0 mt-0.5">
                    {getInitial(t.profiles)}
                  </div>

                  {/* 内容区域 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#1c1917] truncate leading-snug">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {/* 分类标签 */}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: cc.bg, color: cc.text }}>
                        {t.categories?.name}
                      </span>
                      {/* 作者 */}
                      <span className="text-[11px] text-[#999]">{t.profiles?.display_name || t.profiles?.username}</span>
                      {/* 时间 */}
                      <span className="text-[11px] text-[#bbb]">
                        {(() => {
                          const d = new Date(t.created_at)
                          const now = new Date()
                          const diff = now - d
                          if (diff < 3600000) return Math.floor(diff/60000) + '分钟前'
                          if (diff < 86400000) return Math.floor(diff/3600000) + '小时前'
                          if (diff < 172800000) return '昨天'
                          return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* 回复数 */}
                  <div className="flex flex-col items-center justify-center shrink-0 ml-2 min-w-[2.5rem]">
                    <span className="text-sm font-bold text-[#888]">{t.reply_count || 0}</span>
                    <span className="text-[9px] text-[#bbb]">回复</span>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </section>

      {/* 底部 */}
      <div className="text-center py-4 anim-fade-in">
        <p className="text-xs text-[#ccc] leading-relaxed">以文会友 · 以友辅仁</p>
      </div>
    </div>
  )
}
