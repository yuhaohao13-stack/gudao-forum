'use client'

import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import IDIOMS from '@/data/idioms'

// 分三列，每列100个
const COL1 = IDIOMS.slice(0, 100)
const COL2 = IDIOMS.slice(100, 200)
const COL3 = IDIOMS.slice(200, 300)

export default function IdiomsPage() {
  return (
    <div className="anim-fade-in max-w-4xl mx-auto pb-4">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '成语故事' },
      ]} className="mb-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📖</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">成语故事</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{IDIOMS.length} 条</span>
      </div>

      {/* 三列紧凑列表 */}
      <div className="grid grid-cols-3 gap-x-4">
        {/* 第1列: 1-100 */}
        <div>
          {COL1.map((item, i) => (
            <Link
              key={item.id}
              href={`/idioms/${item.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 1}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{item.idiom}</span>
              <span className="text-[9px] text-[#b0a898] truncate">— {item.meaning}</span>
            </Link>
          ))}
        </div>

        {/* 第2列: 101-200 */}
        <div>
          {COL2.map((item, i) => (
            <Link
              key={item.id}
              href={`/idioms/${item.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 101}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{item.idiom}</span>
              <span className="text-[9px] text-[#b0a898] truncate">— {item.meaning}</span>
            </Link>
          ))}
        </div>

        {/* 第3列: 201-300 */}
        <div>
          {COL3.map((item, i) => (
            <Link
              key={item.id}
              href={`/idioms/${item.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 201}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{item.idiom}</span>
              <span className="text-[9px] text-[#b0a898] truncate">— {item.meaning}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
