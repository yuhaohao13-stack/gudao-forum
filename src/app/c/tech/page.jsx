'use client'
import Seo from '@/components/Seo'
import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { TECH_CATEGORY_SLUG, canViewTech, TechLockOverlay } from '@/lib/member'
import { Smartphone, Apple, Cpu, Wrench, Clock, Flame, Pin, Crown, Lock, MessageCircle, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

// 品牌定义（紧凑展示）
const BRANDS = [
  { key: 'Apple', brand: '苹果 Apple', name: '苹果', icon: <Apple size={20} />, color: '#6e6e73', desc: 'iPhone / iPad / MacBook' },
  { key: 'Samsung', brand: '三星 Samsung', name: '三星', icon: <Smartphone size={20} />, color: '#1428a0', desc: 'Galaxy 手机 / 平板' },
  { key: 'Huawei', brand: '华为 Huawei', name: '华为', icon: <Smartphone size={20} />, color: '#c7000b', desc: 'Mate / P 系列手机' },
  { key: 'Xiaomi', brand: '小米 Xiaomi', name: '小米', icon: <Smartphone size={20} />, color: '#ff6900', desc: '小米 / 红米手机' },
  { key: 'Other Android', brand: '其他安卓 Other', name: '其他安卓', icon: <Smartphone size={20} />, color: '#3ddc84', desc: '华硕 / 努比亚 / Nothing' },
  { key: 'PC', brand: '电脑主板 PC', name: '电脑主板', icon: <Cpu size={20} />, color: '#0078d4', desc: '笔记本 / 台式机 / 主板' },
  { key: 'General', brand: '通用 General', name: '通用', icon: <Wrench size={20} />, color: '#b45309', desc: '通用维修技巧 / 工具' },
]

const PAGE_SIZE = 10

export default function TechBrandsPage() {
  return <Suspense fallback={<div className="flex justify-center py-16"><div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>}><TechBrandsContent /></Suspense>
}

function TechBrandsContent() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [brands, setBrands] = useState([])
  const [total, setTotal] = useState(0)
  const [threads, setThreads] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') === 'hot' ? 'hot' : 'latest')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [lockOverlay, setLockOverlay] = useState({ show: false, reason: 'upgrade' })

  // 关键：URL 变化时同步 query 状态（否则搜索后页面不更新）
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])
  const page = parseInt(searchParams.get('page') || '1', 10)
  const supabase = createClient()
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const techAccess = canViewTech(user, profile)

  // 品牌统计
  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', TECH_CATEGORY_SLUG).single()
      if (!cat || !mounted) return
      const { data: threads } = await supabase.from('threads').select('brand').eq('category_id', cat.id)
      if (!mounted) return
      const list = threads || []
      setTotal(list.length)
      const counts = {}
      for (const b of BRANDS) counts[b.key] = 0
      for (const t of list) {
        for (const b of BRANDS) {
          if (t.brand === b.brand) { counts[b.key]++; break }
        }
      }
      setBrands(BRANDS.map(b => ({ ...b, count: counts[b.key] || 0 })))
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  // 帖子列表（最新/热门 + 搜索）
  const fetchThreads = useCallback(async () => {
    const { data: cat } = await supabase.from('categories').select('*').eq('slug', TECH_CATEGORY_SLUG).single()
    if (!cat) return
    // 总数
    let countQ = supabase.from('threads').select('*', { count: 'exact', head: true }).eq('category_id', cat.id)
    if (query.trim()) countQ = countQ.or(`title.ilike.%${query.trim()}%,content.ilike.%${query.trim()}%`)
    const { count } = await countQ
    setTotalCount(count || 0)

    const from_ = (page - 1) * PAGE_SIZE
    let q = supabase.from('threads').select('id, title, category_id, author_id, created_at, updated_at, reply_count, view_count, is_pinned, brand, fault, profiles!inner(username, display_name, role)').eq('category_id', cat.id)
    if (query.trim()) q = q.or(`title.ilike.%${query.trim()}%,content.ilike.%${query.trim()}%`)
    const { data } = await q
      .order('is_pinned', { ascending: false })
      .order(sortBy === 'hot' ? 'reply_count' : 'created_at', { ascending: false })
      .range(from_, from_ + PAGE_SIZE - 1)
    setThreads(data || [])
  }, [sortBy, page, query, supabase])

  useEffect(() => { fetchThreads() }, [fetchThreads])

  const handleThreadClick = (t) => {
    if (!techAccess.allowed) {
      setLockOverlay({ show: true, reason: techAccess.reason || 'upgrade' })
      return
    }
    router.push(`/t/${t.id}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/c/tech?q=${encodeURIComponent(q)}&page=1` : '/c/tech?page=1')
  }

  return (
    <>
      <Seo title='维修案例 - 品牌分类与案例列表 | 古道论坛' description='古道论坛维修案例板块：按品牌分类的手机/电脑维修案例，最新维修案例、热门维修案例，支持搜索。' keywords='维修案例,手机维修,芯片级维修,苹果维修,三星维修,华为维修,小米维修,主板维修,屏幕维修,不开机维修' />
      <div className="anim-fade-in max-w-3xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '板块列表', href: '/board' },
          { label: '维修案例' },
        ]} />

        <h1 className="text-xl font-bold text-[#1a1a1a] mt-2 mb-1">🔧 维修案例</h1>
        <p className="text-xs text-[#aaa] mb-4">共 {total} 篇案例，按品牌分类或直接浏览全部</p>

        {/* 品牌列表（3列网格卡片） */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {brands.map(b => (
            <Link key={b.key} href={`/c/tech/${encodeURIComponent(b.key)}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-3 py-3 transition-all hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[#f5f0e8] flex items-center justify-center shrink-0" style={{ color: b.color }}>
                  {b.icon}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="font-semibold text-sm text-[#1a1a1a] leading-tight truncate">{b.name}</div>
                  <div className="text-[10px] text-[#999] mt-0.5 truncate">{b.desc}</div>
                </div>
              </div>
              <div className="text-[10px] text-[#b45309] mt-2 font-medium">{b.count} 篇案例 →</div>
            </Link>
          ))}
        </div>

        {/* 最新/热门 + 搜索 */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => { setSortBy('latest'); router.push(`/c/tech${query ? `?q=${encodeURIComponent(query)}` : ''}`) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === 'latest' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>
              <Clock size={14} className="inline-block align-text-bottom" /> 最新
            </button>
            <button onClick={() => { setSortBy('hot'); router.push(`/c/tech?sort=hot${query ? `&q=${encodeURIComponent(query)}` : ''}`) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === 'hot' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}>
              <Flame size={14} className="inline-block align-text-bottom" /> 热门
            </button>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto sm:ml-auto min-w-0">
            <input name="q" value={query} onChange={e => setQuery(e.target.value)} type="text"
              placeholder="搜索维修案例..."
              className="input !text-xs !py-1.5 flex-1 sm:w-44 min-w-0" />
            <button type="submit"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#b45309] hover:bg-[#a04408] transition-colors shrink-0">
              <Search size={12} className="inline-block align-text-bottom" /> 搜索
            </button>
          </form>
        </div>

        {/* 全部帖子列表 */}
        <div className="card divide-y divide-[#f5f5f3] overflow-hidden">
          {threads.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#bbb] text-sm">{query ? '没有找到相关案例' : '这里还没有帖子'}</p>
            </div>
          ) : threads.map((t, i) => (
            <div key={t.id} onClick={() => handleThreadClick(t)}
              className={`thread-item px-4 min-w-0 overflow-hidden ${i === 0 ? 'pt-3' : ''} last:pb-3 cursor-pointer`}>
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    {t.is_pinned && <span className="tag"><Pin size={12} className="inline-block align-text-bottom" /> 置顶</span>}
                    {(t.profiles?.role === 'admin' || t.profiles?.role === 'moderator') && !t.is_pinned && <span className="tag"><Crown size={12} className="inline-block align-text-bottom" /> 管理员</span>}
                    {t.is_locked && <span className="tag"><Lock size={12} className="inline-block align-text-bottom" /> 已锁</span>}
                  </div>
                  <h3 className="font-medium text-sm text-[#1a1a1a] truncate leading-snug">
                    {!techAccess.allowed && <span className="mr-1">🔒</span>}
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#bbb] mt-1">
                    <span>{t.profiles?.display_name || t.profiles?.username}</span>
                    <span>·</span>
                    <span>{new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 mt-1">
                  <span className="text-xs text-[#bbb]"><Eye size={14} className="inline-block align-text-bottom" /> {t.view_count || 0}</span>
                  <span className="text-xs text-[#bbb]"><MessageCircle size={14} className="inline-block align-text-bottom" /> {t.reply_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6 mb-8">
            <button
              onClick={() => router.push(`/c/tech?page=${page - 1}${sortBy === 'hot' ? '&sort=hot' : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`)}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            ><ChevronLeft size={14} /> 上一页</button>
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
                    onClick={() => router.push(`/c/tech?page=${p}${sortBy === 'hot' ? '&sort=hot' : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`)}
                    className={`min-w-[2rem] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      p === page ? 'bg-[#b45309] text-white' : 'border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3]'
                    }`}
                  >{p}</button>
                )
              )}
            <button
              onClick={() => router.push(`/c/tech?page=${page + 1}${sortBy === 'hot' ? '&sort=hot' : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >下一页 <ChevronRight size={14} /></button>
          </div>
        )}

        {!techAccess.allowed && (
          <TechLockOverlay
            show={lockOverlay.show}
            onClose={() => setLockOverlay({ show: false, reason: 'upgrade' })}
            reason={lockOverlay.reason}
          />
        )}
      </div>
    </>
  )
}
