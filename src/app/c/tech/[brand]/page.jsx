'use client'
import Seo from '@/components/Seo'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TECH_CATEGORY_SLUG } from '@/lib/member'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

const BRAND_NAMES = {
  'Apple': '苹果 Apple', 'Samsung': '三星 Samsung', 'Huawei': '华为 Huawei',
  'Xiaomi': '小米 Xiaomi', 'Other Android': '其他安卓 Other',
  'PC': '电脑主板 PC', 'General': '通用 General',
}

// 故障类型（中文名 → 标题关键词）
const FAULTS = [
  { name: '不开机-死机', kw: "Won't Turn On Repair", emoji: '📴' },
  { name: '屏幕-显示-触摸', kw: 'Screen Display Touch Repair', emoji: '📱' },
  { name: '主板-芯片', kw: 'Motherboard Chip Repair', emoji: '🛠️' },
  { name: '电池-耗电', kw: 'Battery Repair', emoji: '🔋' },
  { name: '充电-尾插', kw: 'Charging Port Repair', emoji: '🔌' },
  { name: '信号-无服务', kw: 'No Signal Repair', emoji: '📡' },
  { name: '扩容-存储', kw: 'Storage Upgrade', emoji: '💾' },
  { name: '功能故障', kw: 'Function Fault Repair', emoji: '🔘' },
  { name: '摄像头', kw: 'Camera Repair', emoji: '📷' },
  { name: '解锁-激活', kw: 'Unlock Activation', emoji: '🔓' },
  { name: '进水', kw: 'Water Damage Repair', emoji: '💧' },
  { name: '音频', kw: 'Audio Repair', emoji: '🔊' },
  { name: '其他', kw: 'Other Repair', emoji: '📦' },
]

export default function TechFaultsPage() {
  const { brand } = useParams()
  const brandKey = decodeURIComponent(brand)
  const [faults, setFaults] = useState([])
  const [total, setTotal] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', TECH_CATEGORY_SLUG).single()
      if (!cat || !mounted) return
      const { data: threads } = await supabase.from('threads')
        .select('id,title')
        .eq('category_id', cat.id)
      if (!mounted) return
      const list = (threads || []).filter(t => t.title.startsWith(brandKey + ' ') || t.title.startsWith(brandKey + '　'))
      setTotal(list.length)
      const counts = {}
      for (const f of FAULTS) counts[f.name] = 0
      for (const t of list) {
        for (const f of FAULTS) {
          if (t.title.includes(f.kw)) { counts[f.name]++; break }
        }
      }
      setFaults(FAULTS.map(f => ({ ...f, count: counts[f.name] || 0 })).filter(f => f.count > 0))
    }
    load()
    return () => { mounted = false }
  }, [brandKey, supabase])

  const brandName = BRAND_NAMES[brandKey] || brandKey

  return (
    <>
      <Seo title={`${brandName} - 故障分类 | 古道论坛技术讨论`} description={`古道论坛技术讨论 ${brandName} 维修案例故障分类`} />
      <div className="anim-fade-in max-w-3xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '板块列表', href: '/board' },
          { label: '技术讨论', href: '/c/tech' },
          { label: brandName },
        ]} />

        <div className="mb-5">
          <Link href="/c/tech" className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
            <ChevronLeft size={14} /> 返回品牌列表
          </Link>
          <h1 className="text-xl font-bold text-[#1a1a1a] mt-1">{brandName} · 故障分类</h1>
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
