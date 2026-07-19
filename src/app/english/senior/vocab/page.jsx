'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { SENIOR_VOCAB } from '@/data/real-senior-vocab'

const PER_PAGE = 50

export default function SeniorVocabPage() {
  const { user, profile } = useAuth()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showLock, setShowLock] = useState(false)
  const check = canViewGoldContent(user, profile)

  useEffect(() => { document.title = '高中英语词汇 — 古道论坛' }, [])

  const filtered = search
    ? SENIOR_VOCAB.filter(v => {
        const q = search.toLowerCase()
        return v.word.toLowerCase().includes(q) || v.meaning.includes(q)
      })
    : SENIOR_VOCAB

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const startIdx = (page - 1) * PER_PAGE
  const pageItems = filtered.slice(startIdx, startIdx + PER_PAGE)

  const goPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p)
  }

  return (
    <div className="anim-fade-in max-w-5xl mx-auto pb-6">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习', href: '/english' },
        { label: '高中词汇' },
      ]} className="mb-3" />

      <Link href="/english" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronRight className="w-3 h-3 rotate-180" />
        返回英语学习
      </Link>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <h1 className="text-base font-bold text-[#1a1a1a]">高中英语词汇</h1>
          <span className="text-[10px] text-[#b0a898]">{SENIOR_VOCAB.length} 词 / 共 {totalPages} 页</span>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b0a898]" />
        <input type="text" placeholder="搜索单词或中文..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-8 pr-3 py-2 text-xs border border-[#ece8e0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]" />
      </div>

      <GoldLock previewLines={5} className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f0ede8]">
          {[0, 1, 2].map(col => (
            <div key={col} className="divide-y divide-[#f5f5f5]">
              {pageItems.filter((_, i) => i % 3 === col).map(item => {
                const realIdx = SENIOR_VOCAB.findIndex(it => it.id === item.id)
                return (
                  <div key={item.id} className="px-3 py-2 hover:bg-[#faf8f5] transition-colors">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[9px] text-[#c5bdb0] font-mono w-[28px] text-right shrink-0">{realIdx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-[#1c1917]">{item.word}</span>
                          {item.category && <span className="text-[8px] text-[#b0a898] bg-[#f5f5f5] px-1 py-0.5 rounded">{item.category}</span>}
                        </div>
                        <div className="text-[11px] text-[#b45309] mt-0.5">{item.meaning}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-[#999]">没有找到匹配的单词</div>
        )}
      </GoldLock>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => goPage(1)} disabled={page === 1}
            className="p-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => goPage(page - 1)} disabled={page === 1}
            className="p-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 text-xs text-[#666]">{page} / {totalPages}</span>
          <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => goPage(totalPages)} disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-[#b0a898] ml-2">每页50词</span>
        </div>
      )}

      <MemberLockOverlay show={showLock} onClose={() => setShowLock(false)} reason={check.reason} />
    </div>
  )
}
