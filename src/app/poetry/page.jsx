'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import POEMS from '@/data/poetry'

// 分三列，每列100首
const COL1 = POEMS.slice(0, 100)
const COL2 = POEMS.slice(100, 200)
const COL3 = POEMS.slice(200, 300)

export default function PoetryPage() {
  useEffect(() => { document.title = '唐诗三百首 — 古道论坛 | 国际中文社区' }, [])
  return (
    <div className="anim-fade-in max-w-4xl mx-auto pb-4">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '唐诗三百首' },
      ]} className="mb-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📜</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">唐诗三百首</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{POEMS.length} 首</span>
      </div>

      {/* 三列紧凑列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        {/* 第1列: 1-100首 */}
        <div>
          {COL1.map((poem, i) => (
            <Link
              key={poem.id}
              href={`/poetry/${poem.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 1}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{poem.title}</span>
              <span className="text-[9px] text-[#b0a898] shrink-0">— {poem.author}</span>
            </Link>
          ))}
        </div>

        {/* 第2列: 101-200首 */}
        <div>
          {COL2.map((poem, i) => (
            <Link
              key={poem.id}
              href={`/poetry/${poem.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 101}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{poem.title}</span>
              <span className="text-[9px] text-[#b0a898] shrink-0">— {poem.author}</span>
            </Link>
          ))}
        </div>

        {/* 第3列: 201-300首 */}
        <div>
          {COL3.map((poem, i) => (
            <Link
              key={poem.id}
              href={`/poetry/${poem.id}`}
              className="flex items-baseline gap-1.5 py-[1.5px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
            >
              <span className="text-[9px] text-[#c5bdb0] font-mono w-[22px] text-right shrink-0">{i + 201}</span>
              <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{poem.title}</span>
              <span className="text-[9px] text-[#b0a898] shrink-0">— {poem.author}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
