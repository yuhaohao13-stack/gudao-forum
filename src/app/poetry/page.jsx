'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import POEMS from '@/data/poetry'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 15

export default function PoetryPage() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(POEMS.length / PAGE_SIZE)

  useEffect(() => { document.title = '唐诗三百首 — 古道论坛 | 国际中文社区' }, [])

  const start = (page - 1) * PAGE_SIZE
  const pagePoems = POEMS.slice(start, start + PAGE_SIZE)

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-4">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '唐诗三百首' },
      ]} className="mb-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📜</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">唐诗三百首</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{POEMS.length} 首</span>
        <span className="text-[10px] text-[#b0a898]">第 {page}/{totalPages} 页</span>
      </div>

      {/* 双列列表 */}
      <div className="grid grid-cols-2 gap-x-4">
        {pagePoems.map((poem, i) => (
          <Link
            key={poem.id}
            href={`/poetry/${poem.id}`}
            className="flex items-baseline gap-1.5 py-[2px] hover:bg-[#faf8f5] rounded px-1 -mx-1 transition-colors group"
          >
            <span className="text-[9px] text-[#c5bdb0] font-mono w-[28px] text-right shrink-0">{start + i + 1}</span>
            <span className="text-xs text-[#1a1a1a] truncate group-hover:text-[#b45309] transition-colors">{poem.title}</span>
            <span className="text-[9px] text-[#b0a898] shrink-0">— {poem.author}</span>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> 上一页
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`e-${i}`} className="px-2 text-xs text-[#bbb]">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`min-w-[2rem] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? 'bg-[#b45309] text-white'
                      : 'border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3]'
                  }`}
                >
                  {p}
                </button>
              )
            )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            下一页 <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
