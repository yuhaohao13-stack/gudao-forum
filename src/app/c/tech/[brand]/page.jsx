'use client'
import Seo from '@/components/Seo'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TECH_CATEGORY_SLUG } from '@/lib/member'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

// URL key → 数据库 brand 字段值
const BRAND_MAP = {
  'Apple': '苹果 Apple', 'Samsung': '三星 Samsung', 'Huawei': '华为 Huawei',
  'Xiaomi': '小米 Xiaomi', 'Other Android': '其他安卓 Other',
  'PC': '电脑主板 PC', 'General': '通用 General',
}

// 故障类型（数据库 fault 字段值）
const FAULTS = [
  { name: '不开机-死机', emoji: '📴' },
  { name: '屏幕-显示-触摸', emoji: '📱' },
  { name: '主板-芯片', emoji: '🛠️' },
  { name: '电池-耗电', emoji: '🔋' },
  { name: '充电-尾插', emoji: '🔌' },
  { name: '信号-无服务', emoji: '📡' },
  { name: '扩容-存储', emoji: '💾' },
  { name: '功能故障', emoji: '🔘' },
  { name: '摄像头', emoji: '📷' },
  { name: '解锁-激活', emoji: '🔓' },
  { name: '进水', emoji: '💧' },
  { name: '音频', emoji: '🔊' },
  { name: '其他', emoji: '📦' },
]

export default function TechFaultsPage() {
  const { brand } = useParams()
  const brandKey = decodeURIComponent(brand)
  const brandVal = BRAND_MAP[brandKey] || brandKey
  const [faults, setFaults] = useState([])
  const [total, setTotal] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', TECH_CATEGORY_SLUG).single()
      if (!cat || !mounted) return
      const { data: threads } = await supabase.from('threads')
        .select('fault')
        .eq('category_id', cat.id)
        .eq('brand', brandVal)
      if (!mounted) return
      const list = threads || []
      setTotal(list.length)
      const counts = {}
      for (const f of FAULTS) counts[f.name] = 0
      for (const t of list) {
        if (t.fault && counts[t.fault] !== undefined) counts[t.fault]++
      }
      setFaults(FAULTS.map(f => ({ ...f, count: counts[f.name] || 0 })).filter(f => f.count > 0))
    }
    load()
    return () => { mounted = false }
  }, [brandVal, supabase])

  return (
    <>
      <Seo title={`${brandVal} - 故障分类 | 古道论坛维修案例`} description={`古道论坛维修案例 ${brandVal} 维修案例故障分类`} keywords={`${brandVal}维修,${brandVal}故障,手机维修,芯片级维修,不开机维修,屏幕维修,主板维修`} />
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
                <ChevronRight size={16} className="text-[#b45309] shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {faults.length === 0 && (
          <div className="card py-12 text-center">
            <p className="text-[#bbb] text-sm">该品牌下暂无分类案例</p>
            <Link href="/c/tech" className="btn-primary mt-3">返回品牌列表</Link>
          </div>
        )}
      </div>
    </>
  )
}
