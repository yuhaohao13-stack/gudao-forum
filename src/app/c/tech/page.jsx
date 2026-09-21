import Link from 'next/link'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Breadcrumb from '@/components/Breadcrumb'
import { TECH_BRANDS } from '@/lib/techBrands'
import { Smartphone, Apple, Cpu, Wrench, Gamepad2, Camera, Watch, Headphones, BookOpen, Search, Clock, Flame, MessageCircle, Eye } from 'lucide-react'

// 服务端渲染（SSR）：品牌卡 + 最近案例都直接进 HTML，方便搜索引擎收录
export const dynamic = 'force-dynamic'

const TECH_SLUG = 'tech'
const LIST_SIZE = 30

const BRAND_ICONS = {
  Apple: <Apple size={20} />, Samsung: <Smartphone size={20} />, Huawei: <Smartphone size={20} />,
  Xiaomi: <Smartphone size={20} />, OPPO: <Smartphone size={20} />, vivo: <Smartphone size={20} />,
  OnePlus: <Smartphone size={20} />, Honor: <Smartphone size={20} />, Motorola: <Smartphone size={20} />,
  RedMagic: <Gamepad2 size={20} />, Sharp: <Smartphone size={20} />, ASUS: <Smartphone size={20} />,
  'Other Android': <Smartphone size={20} />, PC: <Cpu size={20} />, Console: <Gamepad2 size={20} />,
  Camera: <Camera size={20} />, Watch: <Watch size={20} />, Headphones: <Headphones size={20} />,
  Kobo: <BookOpen size={20} />, General: <Wrench size={20} />,
}
const BRAND_COLORS = {
  Apple: '#6e6e73', Samsung: '#1428a0', Huawei: '#c7000b', Xiaomi: '#ff6900', OPPO: '#0b8a3f',
  vivo: '#415fff', OnePlus: '#eb0029', Honor: '#0a59f7', Motorola: '#1a1a1a', RedMagic: '#d0021b',
  Sharp: '#c8102e', ASUS: '#00539b', 'Other Android': '#3ddc84', PC: '#0078d4', Console: '#e60012',
  Camera: '#7a5c00', Watch: '#1c1c1e', Headphones: '#8e44ad', Kobo: '#b06a3b', General: '#b45309',
}

function sb() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

async function getData(q, sort) {
  const supabase = sb()
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', TECH_SLUG).maybeSingle()
  if (!cat) return { total: 0, brandCounts: {}, threads: [] }

  const { data: all } = await supabase.from('threads').select('brand').eq('category_id', cat.id)
  const brandCounts = {}
  for (const t of all || []) if (t.brand) brandCounts[t.brand] = (brandCounts[t.brand] || 0) + 1

  let listQ = supabase.from('threads')
    .select('id, title, created_at, reply_count, view_count, brand, fault, profiles(username, display_name)')
    .eq('category_id', cat.id)
  if (q) listQ = listQ.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  const { data } = await listQ
    .order(sort === 'hot' ? 'view_count' : 'created_at', { ascending: false })
    .range(0, LIST_SIZE - 1)

  return { total: (all || []).length, brandCounts, threads: data || [] }
}

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const q = (sp?.q || '').trim()
  return {
    title: q ? `搜索「${q}」- 维修案例 | 古道论坛` : '维修案例_手机电脑芯片级维修实战记录 | 古道论坛',
    description: '古道论坛维修案例板块：iPhone、三星、华为、小米、红魔、摩托罗拉等全品牌维修案例，按品牌与故障分类，含真实维修过程与解决方案。',
    keywords: '维修案例,手机维修案例,电脑维修案例,iPhone维修,三星维修,华为维修,红魔维修,换屏,换电池,主板维修,芯片级维修,古道论坛',
    alternates: { canonical: 'https://www.gudaoforum.com/c/tech' },
  }
}

export default async function TechBoardPage({ searchParams }) {
  const sp = await searchParams
  const q = (sp?.q || '').trim()
  const sort = sp?.sort === 'hot' ? 'hot' : 'latest'
  const { total, brandCounts, threads } = await getData(q, sort)

  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[{ label: '首页', href: '/' }, { label: '板块列表', href: '/board' }, { label: '维修案例' }]} />

      <div className="mb-5">
        <h1 className="text-xl font-bold text-[#1a1a1a]">维修案例</h1>
        <p className="text-[#aaa] text-xs mt-0.5">共 {total} 篇实战维修案例 · 按品牌 / 故障分类查找</p>
      </div>

      {/* 搜索（普通表单，不需要 JS，爬虫可跟） */}
      <form method="get" action="/c/tech" className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]" />
          <input name="q" defaultValue={q} placeholder="搜索维修案例，如：不开机、换屏、进水、红魔…"
            className="w-full bg-white border border-[#ece8e0] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#b45309]/50" />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}>搜索</button>
        {q && <Link href="/c/tech" className="px-3 py-2.5 rounded-xl text-sm text-[#888] bg-[#f5f0e8] shrink-0">清除</Link>}
      </form>

      {/* 品牌卡（SSR，含篇数） */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
        {TECH_BRANDS.map(b => (
          <Link key={b.key} href={`/c/tech/${encodeURIComponent(b.key)}`}
            className="block bg-white border border-[#ece8e0] rounded-xl px-3.5 py-3 transition-all hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: BRAND_COLORS[b.key] || '#666' }}>
                {BRAND_ICONS[b.key] || <Smartphone size={20} />}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-[#1a1a1a] truncate">{b.name}</div>
                <div className="text-[10px] text-[#aaa] mt-0.5">{brandCounts[b.brand] || 0} 篇</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Link href={`/c/tech?sort=latest${q ? `&q=${encodeURIComponent(q)}` : ''}`}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${sort === 'latest' ? 'text-white' : 'text-[#888] bg-white border border-[#ece8e0]'}`}
          style={sort === 'latest' ? { background: 'linear-gradient(135deg, #b45309, #d97706)' } : {}}>
          <Clock size={12} className="inline-block align-text-bottom mr-1" />最新
        </Link>
        <Link href={`/c/tech?sort=hot${q ? `&q=${encodeURIComponent(q)}` : ''}`}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${sort === 'hot' ? 'text-white' : 'text-[#888] bg-white border border-[#ece8e0]'}`}
          style={sort === 'hot' ? { background: 'linear-gradient(135deg, #b45309, #d97706)' } : {}}>
          <Flame size={12} className="inline-block align-text-bottom mr-1" />热门
        </Link>
      </div>

      <div className="card divide-y divide-[#f5f5f3]">
        {threads.length === 0 ? (
          <div className="py-12 text-center"><p className="text-[#bbb] text-sm">没有找到相关案例</p></div>
        ) : threads.map((t, i) => (
          <Link key={t.id} href={`/t/${t.id}`} className={`thread-item block px-4 ${i === 0 ? 'pt-3' : ''} last:pb-3`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm text-[#1a1a1a] leading-snug">{t.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[#bbb] mt-1 flex-wrap">
                  {t.brand && <span className="px-1.5 py-0.5 rounded bg-[#f5f0e8] text-[#b45309]">{t.brand}</span>}
                  {t.fault && <span className="px-1.5 py-0.5 rounded bg-[#f5f5f3] text-[#888]">{t.fault}</span>}
                  <span>{t.profiles?.display_name || t.profiles?.username || '匿名'}</span>
                  <span>·</span>
                  <span><Clock size={11} className="inline-block align-text-bottom" /> {t.created_at ? new Date(t.created_at).toLocaleDateString('zh-CN') : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-1 text-xs text-[#bbb]">
                <span><MessageCircle size={14} className="inline-block align-text-bottom" /> {t.reply_count || 0}</span>
                <span><Eye size={14} className="inline-block align-text-bottom" /> {t.view_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-[#bbb] mt-5">只看最近 {LIST_SIZE} 篇 · 点上方品牌卡按分类查看全部</p>
    </div>
  )
}
