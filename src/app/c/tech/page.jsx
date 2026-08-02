'use client'
import Seo from '@/components/Seo'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TECH_CATEGORY_SLUG } from '@/lib/member'
import { Smartphone, Monitor, Apple, Cpu, Wrench, Shield, Laptop, ChevronRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

// 品牌定义：key = URL 标识，brand = 数据库 brand 字段值
const BRANDS = [
  { key: 'Apple', brand: '苹果 Apple', name: '苹果 Apple', icon: <Apple size={22} />, desc: 'iPhone / iPad / MacBook 维修案例', color: '#6e6e73' },
  { key: 'Samsung', brand: '三星 Samsung', name: '三星 Samsung', icon: <Smartphone size={22} />, desc: 'Galaxy 系列手机 / 平板维修案例', color: '#1428a0' },
  { key: 'Huawei', brand: '华为 Huawei', name: '华为 Huawei', icon: <Smartphone size={22} />, desc: 'Mate / P 系列手机维修案例', color: '#c7000b' },
  { key: 'Xiaomi', brand: '小米 Xiaomi', name: '小米 Xiaomi', icon: <Smartphone size={22} />, desc: '小米 / 红米手机维修案例', color: '#ff6900' },
  { key: 'Other Android', brand: '其他安卓 Other', name: '其他安卓 Other', icon: <Smartphone size={22} />, desc: '华硕 / 努比亚 / Nothing 等安卓维修', color: '#3ddc84' },
  { key: 'PC', brand: '电脑主板 PC', name: '电脑主板 PC', icon: <Cpu size={22} />, desc: '笔记本 / 台式机 / 主板维修案例', color: '#0078d4' },
  { key: 'General', brand: '通用 General', name: '通用 General', icon: <Wrench size={22} />, desc: '通用维修技巧与工具案例', color: '#b45309' },
]

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
        .select('brand')
        .eq('category_id', cat.id)
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

  return (
    <>
      <Seo title='维修案例 - 维修案例品牌分类 | 古道论坛' description='古道论坛维修案例板块，按品牌分类的手机/电脑维修案例库：苹果、三星、华为、小米、其他安卓、电脑主板、通用。' />
      <div className="anim-fade-in max-w-3xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '板块列表', href: '/board' },
          { label: '维修案例' },
        ]} />

        <h1 className="text-xl font-bold text-[#1a1a1a] mt-2 mb-1">🔧 维修案例 · 维修案例库</h1>
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
