'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import PROVERBS from '@/data/proverbs'

const COL1 = PROVERBS.slice(0, 40)
const COL2 = PROVERBS.slice(40, 80)

export default function ProverbsPage() {
  return (
    <div className="anim-fade-in max-w-4xl mx-auto pb-4">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '谚语故事' },
      ]} className="mb-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">💬</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">谚语故事</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{PROVERBS.length} 条</span>
      </div>

      {/* 两列紧凑列表 */}
      <div className="grid grid-cols-2 gap-x-4">
        {/* 第1列: 1-40 */}
        <div>
          {COL1.map((item, i) => (
            <Link
              key={item.id}
              href={`/proverbs/${item.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 1}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{item.proverb}</span>
              <span className="text-[9px] text-[#b0a898] shrink-0 truncate ml-auto max-w-[100px]">{item.meaning}</span>
            </Link>
          ))}
        </div>

        {/* 第2列: 41-80 */}
        <div>
          {COL2.map((item, i) => (
            <Link
              key={item.id}
              href={`/proverbs/${item.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 41}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{item.proverb}</span>
              <span className="text-[9px] text-[#b0a898] shrink-0 truncate ml-auto max-w-[100px]">{item.meaning}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
