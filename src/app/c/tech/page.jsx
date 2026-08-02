'use client'
import Seo from '@/components/Seo'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TECH_CATEGORY_SLUG } from '@/lib/member'
import { Smartphone, Monitor, Apple, Cpu, Wrench, Shield, Laptop, ChevronRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

// 品牌定义：key = 标题前缀，value = 显示信息
const BRANDS = [
  { key: 'Apple', name: '苹果 Apple', icon: <Apple size={22} />, desc: 'iPhone / iPad / MacBook 维修案例', color: '#6e6e73' },
  { key: 'Samsung', name: '三星 Samsung', icon: <Smartphone size={22} />, desc: 'Galaxy 系列手机 / 平板维修案例', color: '#1428a0' },
  { key: 'Huawei', name: '华为 Huawei', icon: <Smartphone size={22} />, desc: 'Mate / P 系列手机维修案例', color: '#c7000b' },
  { key: 'Xiaomi', name: '小米 Xiaomi', icon: <Smartphone size={22} />, desc: '小米 / 红米手机维修案例', color: '#ff6900' },
  { key: 'Other Android', name: '其他安卓 Other', icon: <Smartphone size={22} />, desc: '华硕 / 努比亚 / Nothing 等安卓维修', color: '#3ddc84' },
  { key: 'PC', name: '电脑主板 PC', icon: <Cpu size={22} />, desc: '笔记本 / 台式机 / 主板维修案例', color: '#0078d4' },
  { key: 'General', name: '通用 General', icon: <Wrench size={22} />, desc: '通用维修技巧与工具案例', color: '#b45309' },
]

// 故障类型映射（标题关键词 → 中文名）
const FAULTS = [
  { kw: "Won't Turn On Repair", name: '不开机-死机' },
  { kw: 'Screen Display Touch Repair', name: '屏幕-显示-触摸' },
  { kw: 'Motherboard Chip Repair', name: '主板-芯片' },
  { kw: 'Battery Repair', name: '电池-耗电' },
  { kw: 'Charging Port Repair', name: '充电-尾插' },
  { kw: 'No Signal Repair', name: '信号-无服务' },
  { kw: 'Storage Upgrade', name: '扩容-存储' },
  { kw: 'Function Fault Repair', name: '功能故障' },
  { kw: 'Camera Repair', name: '摄像头' },
  { kw: 'Unlock Activation', name: '解锁-激活' },
  { kw: 'Water Damage Repair', name: '进水' },
  { kw: 'Audio Repair', name: '音频' },
  { kw: 'Other Repair', name: '其他' },
]

export function parseBrand(title) {
  if (!title) return null
  for (const b of BRANDS) {
    if (title.startsWith(b.key + ' ') || title.startsWith(b.key + '　')) return b.key
  }
  return null
}

export function parseFault(title) {
  if (!title) return null
  for (const f of FAULTS) {
    if (title.includes(f.kw)) return f.name
  }
  return null
}

export default function TechBrandsPage() {
  const [brands, setBrands] = useState([])
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
      const list = threads || []
      setTotal(list.length)
      const counts = {}
      for (const b of BRANDS) counts[b.key] = 0
      for (const t of list) {
        const bk = parseBrand(t.title)
        if (bk) counts[bk] = (counts[bk] || 0) + 1
      }
      setBrands(BRANDS.map(b => ({ ...b, count: counts[b.key] || 0 })))
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  return (
    <>
      <Seo title='技术讨论 - 维修案例品牌分类 | 古道论坛' description='古道论坛技术讨论板块，按品牌分类的手机/电脑维修案例库：苹果、三星、华为、小米、其他安卓、电脑主板、通用。' />
      <div className="anim-fade-in max-w-3xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '板块列表', href: '/board' },
          { label: '技术讨论' },
        ]} />

        <h1 className="text-xl font-bold text-[#1a1a1a] mt-2 mb-1">🔧 技术讨论 · 维修案例库</h1>
        <p className="text-xs text-[#aaa] mb-6">选择品牌查看对应的维修案例（共 {total} 篇）</p>

        <div className="grid grid-cols-2 gap-2 mb-8">
          {brands.map(b => (
            <Link key={b.key} href={`/c/tech/${encodeURIComponent(b.key)}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-4 py-3.5 transition-all hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center text-lg shrink-0" style={{ color: b.color }}>
                  {b.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-[#1a1a1a]">{b.name}</div>
                  <div className="text-xs text-[#888] mt-0.5 truncate">{b.desc}</div>
                  <div className="text-[10px] text-[#aaa] mt-1">{b.count} 篇案例</div>
                </div>
                <ChevronRight size={16} className="text-[#b45309] shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <div className="card p-4">
          <div className="text-sm font-semibold text-[#1a1a1a] mb-2">📋 品牌说明</div>
          <p className="text-xs text-[#888] leading-relaxed">
            这里收录了 Crazy维修（新加坡）发布的技术维修案例，按品牌和故障类型分类整理。
            点击品牌进入故障分类，再点击故障查看具体维修案例。
          </p>
        </div>
      </div>
    </>
  )
}
