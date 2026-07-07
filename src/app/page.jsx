'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Clock, Flame, Plus, ArrowRight, Pin, FileText, Monitor, Flower2, Package, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/LanguageContext'

const CAT_ICONS = {
  announcements: <MegaphoneIcon />,
  random: <MessageCircle size={16} />,
  tech: <Monitor size={16} />,
  life: <Flower2 size={16} />,
  resources: <Package size={16} />,
  fiction: <BookOpen size={16} />,
}

function MegaphoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
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
  const [announcements, setAnnouncements] = useState([])
  const [threads, setThreads] = useState([])
  const [activeTab, setActiveTab] = useState('latest')
  const [activeCategory, setActiveCategory] = useState('all')
  const [stats, setStats] = useState({ posts: 0, views: 0, members: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Categories
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) {
        const [a] = sorted.splice(annIdx, 1)
        sorted.unshift(a)
      }
      setCategories(sorted)

      // Announcements
      const annCat = sorted.find(c => c.slug === 'announcements')
      if (annCat) {
        const { data: a } = await supabase
          .from('threads')
          .select('*, profiles(username, display_name)')
          .eq('category_id', annCat.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setAnnouncements(a || [])
      }

      // Recent threads (announcements excluded)
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

      // Stats
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

  const filteredThreads = threads.filter((t) => {
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

  return (
    <div className="space-y-6">
      {/* ===== Header Area: Title + Stats Bar ===== */}
      <div className="anim-fade-in">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">古道论坛</h1>
            <p className="text-xs text-slate-400 mt-0.5">{t('home.slogan')}</p>
          </div>
          <Link
            href="/new-thread"
            className="btn-primary !px-4 !py-2 text-sm"
          >
            <Plus size={16} />
            发帖
          </Link>
        </div>
        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <FileText size={13} />
            <span className="stat-num">{stats.posts.toLocaleString()}</span>
            <span>帖子</span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={13} />
            <span className="stat-num">{stats.views.toLocaleString()}</span>
            <span>浏览</span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="stat-num">{stats.members.toLocaleString()}</span>
            <span>会员</span>
          </div>
        </div>
      </div>

      {/* ===== Announcements ===== */}
      {announcements.length > 0 && (
        <section className="anim-up">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              公告
            </span>
          </div>
          <div className="card overflow-hidden">
            {announcements.map((t, i) => (
              <Link
                key={t.id}
                href={`/t/${t.id}`}
                className={`flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                  i > 0 ? 'border-t border-slate-100' : ''
                }`}
              >
                <Pin size={12} className="text-slate-400 shrink-0" />
                <span className="text-sm text-slate-700 truncate">{t.title}</span>
                <span className="ml-auto text-xs text-slate-400 shrink-0">
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

      {/* ===== Category Pills ===== */}
      <section className="anim-up">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`pill ${activeCategory === 'all' ? 'pill-active' : ''}`}
          >
            全部
          </button>
          {categories
            .filter((c) => c.slug !== 'announcements')
            .map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.slug)
                  setActiveTab('latest')
                }}
                className={`pill ${activeCategory === c.slug ? 'pill-active' : ''}`}
              >
                {CAT_ICONS[c.slug] || <FileText size={14} />}
                {c.name}
              </button>
            ))}
        </div>
      </section>

      {/* ===== Tabs + Topic List ===== */}
      <section className="anim-up">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'latest'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Clock size={14} />
              最新
            </button>
            <button
              onClick={() => setActiveTab('hot')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'hot'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Flame size={14} />
              热门
            </button>
          </div>
          <Link
            href="/search"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-0.5"
          >
            搜索
            <ArrowRight size={12} />
          </Link>
        </div>

        {/* Thread list */}
        <div className="card overflow-hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full skeleton" />
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
              <FileText size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">暂无帖子</p>
              <Link href="/new-thread" className="btn-primary mt-3">
                发布第一篇帖子
              </Link>
            </div>
          ) : (
            sortedThreads.map((t, i) => (
              <Link
                key={t.id}
                href={`/t/${t.id}`}
                className="thread-item flex items-center gap-3"
              >
                {/* Avatar */}
                <div className="avatar-placeholder">
                  {getAvatarLetter(t)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {t.is_pinned && <Pin size={12} className="text-slate-400 shrink-0" />}
                    <h3 className="text-sm font-medium text-slate-800 truncate leading-snug">
                      {t.title}
                    </h3>
                    {t.categories?.name && (
                      <span className="badge shrink-0">{t.categories.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      {t.profiles?.display_name || t.profiles?.username || '匿名'}
                    </span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">
                      {formatTime(t.created_at)}
                    </span>
                  </div>
                </div>

                {/* Reply count */}
                <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-400">
                  <MessageCircle size={13} />
                  <span className="font-medium text-slate-500">{t.reply_count || 0}</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-300 italic">{tagline}</p>
        </div>
      </section>
    </div>
  )
}
