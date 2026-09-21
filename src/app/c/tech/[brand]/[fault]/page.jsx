import Link from 'next/link'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Breadcrumb from '@/components/Breadcrumb'
import { BRAND_BY_KEY } from '@/lib/techBrands'
import { ChevronLeft, ChevronRight, MessageCircle, Clock, Search } from 'lucide-react'

// 服务端渲染（SSR）：案例列表直接进 HTML，三大引擎都能读到（原来客户端渲染 → 爬虫看到空列表）
export const dynamic = 'force-dynamic'

const TECH_SLUG = 'tech'
const PAGE_SIZE = 30

function sb() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

async function getData(brandVal, faultName, q, sort, page) {
  const supabase = sb()
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', TECH_SLUG).maybeSingle()
  if (!cat) return { total: 0, threads: [] }

  let countQ = supabase.from('threads').select('id', { count: 'exact', head: true })
    .eq('category_id', cat.id).eq('brand', brandVal).eq('fault', faultName)
  if (q) countQ = countQ.or(`title.ilike.%${q}%`)
  const { count } = await countQ

  const from = (page - 1) * PAGE_SIZE
  let listQ = supabase.from('threads')
    .select('id, title, created_at, reply_count, view_count, profiles(username, display_name)')
    .eq('category_id', cat.id).eq('brand', brandVal).eq('fault', faultName)
  if (q) listQ = listQ.or(`title.ilike.%${q}%`)
  const { data } = await listQ
    .order(sort === 'hot' ? 'view_count' : 'created_at', { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  return { total: count || 0, threads: data || [] }
}

export async function generateMetadata({ params }) {
  const { brand, fault } = await params
  const brandKey = decodeURIComponent(brand)
  const faultName = decodeURIComponent(fault)
  const brandVal = BRAND_BY_KEY[brandKey] || brandKey
  const { total } = await getData(brandVal, faultName, '', 'latest', 1)
  return {
    title: `${brandVal} ${faultName}维修案例_${total}篇真实记录 | 古道论坛`,
    description: `古道论坛${brandVal}${faultName}维修案例${total}篇：真实维修过程、故障现象与解决方案。芯片级维修实战记录，持续更新。`,
    keywords: `${brandVal}${faultName}维修,${brandVal}维修案例,${faultName}维修,手机维修案例,芯片级维修,主板维修,古道论坛`,
    alternates: { canonical: `https://www.gudaoforum.com/c/tech/${encodeURIComponent(brandKey)}/${encodeURIComponent(faultName)}` },
  }
}

export default async function TechFaultCasesPage({ params, searchParams }) {
  const { brand, fault } = await params
  const sp = await searchParams
  const brandKey = decodeURIComponent(brand)
  const faultName = decodeURIComponent(fault)
  const brandVal = BRAND_BY_KEY[brandKey] || brandKey
  if (!brandVal || !faultName) notFound()

  const q = (sp.q || '').trim()
  const sort = sp.sort === 'hot' ? 'hot' : 'latest'
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1)

  const { total, threads } = await getData(brandVal, faultName, q, sort, page)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const base = `/c/tech/${encodeURIComponent(brandKey)}/${encodeURIComponent(faultName)}`

  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '板块列表', href: '/board' },
        { label: '维修案例', href: '/c/tech' },
        { label: brandVal, href: `/c/tech/${encodeURIComponent(brandKey)}` },
        { label: faultName },
      ]} />

      <div className="mb-5">
        <Link href={`/c/tech/${encodeURIComponent(brandKey)}`} className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
          <ChevronLeft size={14} /> 返回故障分类
        </Link>
        <h1 className="text-xl font-bold text-[#1a1a1a] mt-1">{brandVal} · {faultName} 维修案例</h1>
        <p className="text-[#aaa] text-xs mt-0.5">共 {total} 篇{q ? `（搜索「${q}」结果）` : ''}</p>
      </div>

      {/* 搜索（普通表单，不依赖 JS，爬虫可跟） */}
      <form method="get" action={base} className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
          <input name="q" defaultValue={q} placeholder={`搜索${faultName}案例...`}
            className="w-full bg-white border border-[#ece8e0] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#b45309]/50" />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}>搜索</button>
        {q && <Link href={base} className="px-3 py-2.5 rounded-xl text-sm text-[#888] bg-[#f5f0e8] shrink-0">清除</Link>}
      </form>

      <div className="flex items-center gap-2 mb-4">
        <Link href={`${base}?sort=latest${q ? `&q=${encodeURIComponent(q)}` : ''}`}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${sort === 'latest' ? 'text-white' : 'text-[#888] bg-white border border-[#ece8e0]'}`}
          style={sort === 'latest' ? { background: 'linear-gradient(135deg, #b45309, #d97706)' } : {}}>
          <Clock size={12} className="inline-block align-text-bottom mr-1" />最新
        </Link>
        <Link href={`${base}?sort=hot${q ? `&q=${encodeURIComponent(q)}` : ''}`}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${sort === 'hot' ? 'text-white' : 'text-[#888] bg-white border border-[#ece8e0]'}`}
          style={sort === 'hot' ? { background: 'linear-gradient(135deg, #b45309, #d97706)' } : {}}>
          🔥 热门
        </Link>
      </div>

      <div className="card divide-y divide-[#f5f5f3]">
        {threads.length === 0 ? (
          <div className="py-12 text-center"><p className="text-[#bbb] text-sm">这里还没有案例</p></div>
        ) : threads.map((t, i) => (
          <Link key={t.id} href={`/t/${t.id}`} className={`thread-item block px-4 ${i === 0 ? 'pt-3' : ''} last:pb-3`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm text-[#1a1a1a] leading-snug">{t.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[#bbb] mt-1">
                  <span>{t.profiles?.display_name || t.profiles?.username || '匿名'}</span>
                  <span>·</span>
                  <span><Clock size={11} className="inline-block align-text-bottom" /> {t.created_at ? new Date(t.created_at).toLocaleDateString('zh-CN') : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-1">
                <span className="text-xs text-[#bbb]"><MessageCircle size={14} className="inline-block align-text-bottom" /> {t.reply_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 mb-8">
          {page > 1 && (
            <Link href={`${base}?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}&sort=${sort}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3]">
              <ChevronLeft size={14} className="inline-block align-text-bottom" /> 上一页
            </Link>
          )}
          <span className="text-xs text-[#666]">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`${base}?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}&sort=${sort}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3]">
              下一页 <ChevronRight size={14} className="inline-block align-text-bottom" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
