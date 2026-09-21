import Link from 'next/link'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import Breadcrumb from '@/components/Breadcrumb'
import { BRAND_BY_KEY, TECH_FAULTS } from '@/lib/techBrands'
import { ChevronLeft } from 'lucide-react'

// 服务端渲染（SSR）：故障分类与篇数直接进 HTML
export const dynamic = 'force-dynamic'

const TECH_SLUG = 'tech'

function sb() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

async function getFaults(brandVal) {
  const supabase = sb()
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', TECH_SLUG).maybeSingle()
  if (!cat) return { total: 0, faults: [] }
  const { data } = await supabase.from('threads').select('fault').eq('category_id', cat.id).eq('brand', brandVal)
  const list = data || []
  const counts = {}
  for (const t of list) if (t.fault) counts[t.fault] = (counts[t.fault] || 0) + 1
  const faults = TECH_FAULTS
    .map(f => ({ ...f, count: counts[f.name] || 0 }))
    .filter(f => f.count > 0)
  return { total: list.length, faults }
}

export async function generateMetadata({ params }) {
  const { brand } = await params
  const brandKey = decodeURIComponent(brand)
  const brandVal = BRAND_BY_KEY[brandKey] || brandKey
  if (!brandVal) return { title: '维修案例 - 古道论坛' }
  const { total } = await getFaults(brandVal)
  return {
    title: `${brandVal}维修案例_${total}篇故障分类 | 古道论坛`,
    description: `古道论坛${brandVal}维修案例${total}篇，按故障分类：不开机、屏幕、主板、电池、充电、信号、进水等。真实维修过程与解决方案。`,
    keywords: `${brandVal}维修,${brandVal}维修案例,${brandVal}不开机,${brandVal}换屏,手机维修案例,芯片级维修,古道论坛`,
    alternates: { canonical: `https://www.gudaoforum.com/c/tech/${encodeURIComponent(brandKey)}` },
  }
}

export default async function TechBrandPage({ params }) {
  const { brand } = await params
  const brandKey = decodeURIComponent(brand)
  const brandVal = BRAND_BY_KEY[brandKey] || brandKey
  const { total, faults } = await getFaults(brandVal)

  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '板块列表', href: '/board' },
        { label: '维修案例', href: '/c/tech' },
        { label: brandVal },
      ]} />

      <div className="mb-5">
        <Link href="/c/tech" className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
          <ChevronLeft size={14} /> 返回品牌列表
        </Link>
        <h1 className="text-xl font-bold text-[#1a1a1a] mt-1">{brandVal} · 故障分类</h1>
        <p className="text-[#aaa] text-xs mt-0.5">共 {total} 篇维修案例，选择故障类型查看</p>
      </div>

      {faults.length === 0 ? (
        <div className="card py-12 text-center"><p className="text-[#bbb] text-sm">该品牌暂无案例</p></div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {faults.map(f => (
            <Link key={f.name} href={`/c/tech/${encodeURIComponent(brandKey)}/${encodeURIComponent(f.name)}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-4 py-3.5 transition-all hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center text-lg shrink-0">{f.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-[#1a1a1a]">{f.name}</div>
                  <div className="text-[10px] text-[#aaa] mt-1">{f.count} 篇案例</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
