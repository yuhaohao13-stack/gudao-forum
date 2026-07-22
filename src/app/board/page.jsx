'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { canViewTech, TECH_CATEGORY_SLUG } from '@/lib/member'
import { Clock, Flame, FileText, MessageCircle, Eye, Megaphone, Monitor, Flower2, Package, BookOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

const PAGE_SIZE = 10

const CAT_ICONS = {
  announcements: <Megaphone size={20} className="inline-block" />,
  random: <MessageCircle size={20} className="inline-block" />,
  tech: <Monitor size={20} className="inline-block" />,
  life: <Flower2 size={20} className="inline-block" />,
  resources: <Package size={20} className="inline-block" />,
  fiction: <BookOpen size={20} className="inline-block" />,
}

export default function BoardPage() {
  const { user, profile } = useAuth()
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({})
  const [activeTab, setActiveTab] = useState('recent')
  const [threads, setThreads] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const supabase = createClient()
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const fetchData = useCallback(async () => {
    // 板块
    const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
    const sorted = cats || []
    const annIdx = sorted.findIndex(c => c.slug === 'announcements')
    if (annIdx > 0) { const [a] = sorted.splice(annIdx, 1); sorted.unshift(a) }
    setCategories(sorted)

    // 统计
    const statMap = {}
    for (const c of sorted) {
      const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true }).eq('category_id', c.id)
      statMap[c.id] = { posts: pc || 0 }
    }
    setStats(statMap)

    // 帖子总数（排除公告板块）
    const aid = sorted.find(c => c.slug === 'announcements')?.id
    let countQ = supabase.from('threads').select('*', { count: 'exact', head: true })
    if (aid) countQ = countQ.neq('category_id', aid)
    const { count } = await countQ
    setTotalCount(count || 0)

    // 当前页
    const from_ = (page - 1) * PAGE_SIZE
    let q = supabase.from('threads').select('*, profiles(username, display_name), categories!inner(name, slug)')
    if (aid) q = q.neq('category_id', aid)
    const { data } = await q
      .order('is_pinned', { ascending: false })
      .order(activeTab === 'hot' ? 'reply_count' : 'created_at', { ascending: false })
      .range(from_, from_ + PAGE_SIZE - 1)
    setThreads(data || [])
  }, [page, activeTab])

  useEffect(() => { fetchData() }, [fetchData])

  // 切换tab时回到第一页
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '板块列表' },
      ]} />

      <h1 className="text-xl font-bold text-[#1a1a1a] mt-2 mb-1">📋 论坛板块</h1>
      <p className="text-xs text-[#aaa] mb-6">选择一个板块浏览讨论</p>

      {/* 板块列表：双列 */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {categories.map(c => {
          const s = stats[c.id] || { posts: 0 }
          return (
            <Link key={c.id} href={`/c/${c.slug}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-4 py-3.5 transition-all hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center text-lg shrink-0">
                  {CAT_ICONS[c.slug] || <FileText size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1a1a1a]">{c.name}</span>
                    {c.slug === 'announcements' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#b8860b]/10 text-[#b8860b] font-medium">公告</span>}
                  </div>
                  <div className="text-xs text-[#888] mt-0.5 truncate">{c.description}</div>
                  <div className="flex items-center gap-3 text-[10px] text-[#aaa] mt-1">
                    <span><MessageCircle size={11} className="inline align-text-bottom" /> {s.posts} 帖</span>
                  </div>
                </div>
                <span className="text-[#b45309] text-xs shrink-0">→</span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 帖子列表 */}
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => handleTabChange('recent')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'recent' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f5] text-[#888] hover:text-[#1a1a1a] hover:bg-[#eee]'
          }`}
        ><Clock size={18} className="inline-block align-text-bottom" /> 最新</button>
        <button onClick={() => handleTabChange('hot')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'hot' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f5] text-[#888] hover:text-[#1a1a1a] hover:bg-[#eee]'
          }`}
        ><Flame size={18} className="inline-block align-text-bottom" /> 热门</button>
        <Link href="/search" className="ml-auto text-xs text-[#bbb] hover:text-[#888] transition-colors">搜索 <ArrowRight size={12} className="inline-block align-text-bottom" /></Link>
      </div>

      <div className="card divide-y divide-[#f5f5f5]">
        {threads.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mb-2"><FileText size={28} className="inline-block text-[#ccc]" /></div>
            <p className="text-[#bbb] text-sm">暂无帖子</p>
            <Link href="/new-thread" className="btn-primary mt-3">发第一条帖子</Link>
          </div>
        ) : (
          threads.map((t, i) => {
            const isTechPost = t.categories?.slug === TECH_CATEGORY_SLUG
            const techViewCheck = isTechPost ? canViewTech(user, profile) : null
            const isTechLocked = techViewCheck && !techViewCheck.allowed

            return (
              <Link key={t.id} href={isTechLocked ? '#' : `/t/${t.id}`}
                className={`thread-item px-3 first:pt-2.5 last:pb-2.5 ${isTechLocked ? 'opacity-60 cursor-default' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-medium text-sm truncate leading-snug ${isTechLocked ? 'text-[#999]' : 'text-[#1a1a1a]'}`}>
                      {isTechPost && <span className="mr-1">🔒</span>}{t.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[11px] text-[#bbb]">
                      <span className="text-[#888]">{t.profiles?.display_name || t.profiles?.username}</span>
                      <span>·</span>
                      <span className="text-[#b45309]/70 font-medium">出自 {t.categories?.name || '闲聊灌水'}</span>
                      <span>·</span>
                      <span>{new Date(t.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</span>
                      <span className="flex items-center gap-1.5 ml-auto">
                        <span className="inline-flex items-center gap-0.5"><MessageCircle size={11} className="inline-block" /> {t.reply_count || 0}</span>
                        <span className="inline-flex items-center gap-0.5"><Eye size={11} className="inline-block" /> {t.view_count || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-4 mb-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> 上一页
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-xs text-[#bbb]">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[2rem] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? 'bg-[#b45309] text-white'
                      : 'border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3]'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            下一页 <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
