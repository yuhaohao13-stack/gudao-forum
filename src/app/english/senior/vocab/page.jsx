'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, ChevronLeft, ChevronsLeft, ChevronsRight, UserRound } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { SENIOR_VOCAB } from '@/data/real-senior-vocab'

export default function SeniorVocabPage() {
  const { user, profile } = useAuth()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showLock, setShowLock] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const check = canViewGoldContent(user, profile)

  const cols = isMobile ? 2 : 3
  const perPage = isMobile ? 50 : 75
  const rowsLabel = isMobile ? '50词 · 25行×2列' : '75词 · 25行×3列'

  useEffect(() => {
    document.title = '台湾高中英语词汇3754词 — 古道论坛'
    let m = document.querySelector('meta[name=description]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = '台湾大学学测4000字+指考7000字词汇表，共3754个基础词汇。带中文释义，每页75词三列显示，支持搜索。'
    let k = document.querySelector('meta[name=keywords]')
    if (!k) { k = document.createElement('meta'); k.name = 'keywords'; document.head.appendChild(k) }
    k.content = '台湾学测英文词汇,指考英文词汇,高中英语词汇表,学测4000字,指考7000词,台湾高中英文,大学入学考试英文'
  }, [])

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 640)
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  useEffect(() => { setPage(1) }, [isMobile])

  const filtered = search
    ? SENIOR_VOCAB.filter(v => {
        const q = search.toLowerCase()
        return v.word.toLowerCase().includes(q) || v.meaning.includes(q)
      })
    : SENIOR_VOCAB

  const totalPages = Math.ceil(filtered.length / perPage)
  const startIdx = (page - 1) * perPage
  const pageItems = filtered.slice(startIdx, startIdx + perPage)

  const goPage = (p) => { if (p >= 1 && p <= totalPages) setPage(p) }

  const colIndices = Array.from({ length: cols }, (_, i) => i)

  const renderItem = (item) => {
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
          <span className="text-[10px] text-[#b0a898]">{SENIOR_VOCAB.length} 词</span>
        </div>
      </div>

      {!user ? (
        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-12 sm:px-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <UserRound size={24} className="text-[#b45309]" />
          </div>
          <p className="text-sm text-[#888] mb-4">注册会员即可浏览高中英语词汇全部3754词</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">免费注册</Link>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border border-[#b45309] text-[#b45309] hover:bg-amber-50 transition-colors">登录</Link>
          </div>
        </div>
      ) : (
        <>
          {!check.allowed && (
            <div className="mb-3 px-3 py-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <p className="text-xs text-[#92400e] font-medium mb-1">🔒 高中词汇仅限黄金/钻石会员浏览</p>
              <Link href="/members" className="text-[11px] text-[#b45309] hover:underline">查看会员权益 →</Link>
            </div>
          )}
          <div className="relative mb-3">
            <input type="text" placeholder="搜索单词或中文..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full px-3 py-2 text-xs border border-[#ece8e0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309]" />
          </div>

          {(check.allowed) ? (
            <>
              <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f0ede8]">
                  {colIndices.map(col => (
                    <div key={col} className="divide-y divide-[#f5f5f5]">
                      {pageItems.filter((_, i) => i % cols === col).map(item => renderItem(item))}
                    </div>
                  ))}
                </div>
                {filtered.length === 0 && (<div className="py-10 text-center text-sm text-[#999]">没有找到匹配的单词</div>)}
              </div>
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
                  <span className="px-3 py-1 text-xs text-[#666] whitespace-nowrap">{page}/{totalPages} · {rowsLabel}</span>
                  <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => goPage(totalPages)} disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <GoldLock previewLines={5} className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#f0ede8]">
                  {colIndices.map(col => (
                    <div key={col} className="divide-y divide-[#f5f5f5]">
                      {pageItems.filter((_, i) => i % cols === col).map(item => renderItem(item))}
                    </div>
                  ))}
                </div>
              </GoldLock>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 opacity-50 pointer-events-none">
                  <span className="px-3 py-1 text-xs text-[#666] whitespace-nowrap">{page}/{totalPages}</span>
                </div>
              )}
            </>
          )}
        </>
      )}

      <MemberLockOverlay show={showLock} onClose={() => setShowLock(false)} reason={check.reason} />
    </div>
  )
}
