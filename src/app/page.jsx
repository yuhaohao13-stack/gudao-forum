'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Clock, Plus, Pin, FileText, Users, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

const CAT_COLORS = {
  announcements: { bg: '#f1f5f9', text: '#475569' },
  random: { bg: '#f0f9ff', text: '#0369a1' },
  tech: { bg: '#f5f3ff', text: '#6d28d9' },
  life: { bg: '#f0fdf4', text: '#15803d' },
  resources: { bg: '#fefce8', text: '#a16207' },
  fiction: { bg: '#fdf2f8', text: '#be185d' },
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHr < 24) return `${diffHr}小时前`
  if (diffDay < 7) return `${diffDay}天前`

  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  })
}

export default function Home() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState([])
  const [threads, setThreads] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('latest')
  const [stats, setStats] = useState({ posts: 0, views: 0, members: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) {
        const [a] = sorted.splice(annIdx, 1)
        sorted.unshift(a)
      }
      setCategories(sorted)

      const annCat = sorted.find(c => c.slug === 'announcements')
      const aid = annCat?.id

      let rq = supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
      if (aid) rq = rq.neq('category_id', aid)
      const { data: recent } = await rq
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20)
      setThreads(recent || [])

      const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true })
      const { data: v } = await supabase.from('threads').select('view_count')
      const { count: uc } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setStats({
        posts: pc || 0,
        views: (v || []).reduce((s, t) => s + (t.view_count || 0), 0),
        members: uc || 0,
      })

      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredThreads = threads.filter(t => {
    if (activeCategory !== 'all' && t.categories?.slug !== activeCategory) return false
    return true
  })

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
    if (activeTab === 'hot') return (b.reply_count || 0) - (a.reply_count || 0)
    return new Date(b.created_at) - new Date(a.created_at)
  })

  const taglines = [
    '以文会友，以友辅仁',
    '知古鉴今，温故知新',
    '君子和而不同',
    '博学之，审问之，慎思之，明辨之，笃行之',
  ]
  const tagline = taglines[Math.floor(Math.random() * taglines.length)]

  const getAvatarLetter = (thread) => {
    const name = thread.profiles?.display_name || thread.profiles?.username || '?'
    return name[0]
  }

  const getBadgeColor = (slug) => CAT_COLORS[slug] || { bg: '#f1f5f9', text: '#64748b' }

  return (
    <div className="space-y-5">
      {/* Stats Bar */}
      <div className="anim-fade-in">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1e293b]">古道论坛</h1>
            <p className="text-xs text-[#64748b] mt-0.5">{t('home.slogan')}</p>
          </div>
          <Link
            href="/new-thread"
            className="btn-primary"
          >
            <Plus size={15} />
            发帖
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#64748b]">
          <div className="flex items-center gap-1.5">
            <FileText size={13} />
            <span className="stat-num">{stats.posts.toLocaleString()}</span>
            <span>帖子</span>
          </div>
          <span className="text-[#cbd5e1]">|</span>
          <div className="flex items-center gap-1.5">
            <Eye size={13} />
            <span className="stat-num">{stats.views.toLocaleString()}</span>
            <span>浏览</span>
          </div>
          <span className="text-[#cbd5e1]">|</span>
          <div className="flex items-center gap-1.5">
            <Users size={13} />
            <span className="stat-num">{stats.members.toLocaleString()}</span>
            <span>会员</span>
          </div>
        </div>
      </div>

      {/* Announcements */}
      {threads.filter(t => t.is_pinned).length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-[#64748b] tracking-wide uppercase flex items-center gap-1">
              <Pin size={12} />
              置顶
            </span>
          </div>
          <div className="card overflow-hidden">
            {threads.filter(t => t.is_pinned).map((t, i) => (
              <Link
                key={t.id}
                href={`/t/${t.id}`}
                className={`flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors ${
                  i > 0 ? 'border-t border-[#e2e8f0]' : ''
                }`}
              >
                <Pin size={12} className="text-[#94a3b8] shrink-0" />
                <span className="text-sm text-[#1e293b] truncate">{t.title}</span>
                <span className="ml-auto text-xs text-[#94a3b8] shrink-0">
                  {new Date(t.created_at).toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category Pills */}
      <section className="anim-up">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`pill ${activeCategory === 'all' ? 'pill-active' : ''}`}
          >
            全部
          </button>
          {categories
            .filter(c => c.slug !== 'announcements')
            .map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.slug)
                  setActiveTab('latest')
                }}
                className={`pill ${activeCategory === c.slug ? 'pill-active' : ''}`}
              >
                {c.name}
              </button>
            ))}
        </div>
      </section>

      {/* Tab + Topic List */}
      <section className="anim-up">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 bg-[#f8fafc] rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'latest'
                  ? 'bg-white text-[#1e293b] shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#475569]'
              }`}
            >
              <Clock size={14} />
              最新
            </button>
            <button
              onClick={() => setActiveTab('hot')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'hot'
                  ? 'bg-white text-[#1e293b] shadow-sm'
                  : 'text-[#94a3b8] hover:text-[#475569]'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              热门
            </button>
          </div>
          <Link
            href="/search"
            className="text-xs text-[#94a3b8] hover:text-[#475569] transition-colors"
          >
            搜索 →
          </Link>
        </div>

        <div className="card overflow-hidden divide-y divide-[#e2e8f0]">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full skeleton" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-3/4 skeleton" />
                    <div className="h-3 w-1/2 skeleton" />
                  </div>
                  <div className="h-3 w-12 skeleton" />
                </div>
              ))}
            </div>
          ) : sortedThreads.length === 0 ? (
            <div className="py-12 text-center">
              <FileText size={24} className="mx-auto text-[#cbd5e1] mb-2" />
              <p className="text-sm text-[#94a3b8]">暂无帖子</p>
              <Link href="/new-thread" className="btn-primary mt-3">
                发布第一篇帖子
              </Link>
            </div>
          ) : (
            sortedThreads.map(t => {
              const catSlug = t.categories?.slug
              const badgeColor = getBadgeColor(catSlug)
              return (
                <Link
                  key={t.id}
                  href={`/t/${t.id}`}
                  className="topic-row"
                >
                  <div className="avatar">
                    {getAvatarLetter(t)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {t.is_pinned && <Pin size={12} className="text-[#94a3b8] shrink-0" />}
                      <h3 className="text-sm font-medium text-[#1e293b] truncate leading-snug">
                        {t.title}
                      </h3>
                      {t.categories?.name && (
                        <span
                          className="badge shrink-0"
                          style={{ background: badgeColor.bg, color: badgeColor.text }}
                        >
                          {t.categories.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#64748b]">
                        {t.profiles?.display_name || t.profiles?.username || '匿名'}
                      </span>
                      <span className="text-[#cbd5e1]">·</span>
                      <span className="text-xs text-[#64748b]">
                        {formatTime(t.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-[#64748b]">
                    <MessageCircle size={13} />
                    <span className="font-medium text-[#475569]">{t.reply_count || 0}</span>
                  </div>
                </Link>
              )
            })
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-[#cbd5e1] italic">{tagline}</p>
        </div>
      </section>
    </div>
  )
}
