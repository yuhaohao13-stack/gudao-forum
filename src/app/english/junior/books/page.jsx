'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { JUNIOR_BOOKS } from '@/data/english-books'

const PER_PAGE = 50

export default function JuniorBooksPage() {
  const { user, profile } = useAuth()
  const [page, setPage] = useState(1)
  const [showLock, setShowLock] = useState(false)
  const check = canViewGoldContent(user, profile)

  useEffect(() => { document.title = '初中英文书籍 — 古道论坛' }, [])

  const pageItems = JUNIOR_BOOKS
  const goPage = (p) => { if (p >= 1) setPage(p) }

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-6">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习', href: '/english' },
        { label: '英文书籍（初中）' },
      ]} className="mb-3" />

      <Link href="/english" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronRight className="w-3 h-3 rotate-180" />
        返回英语学习
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌱</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">初中英文书籍</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{JUNIOR_BOOKS.length} 本</span>
      </div>

      <p className="text-[11px] text-[#666] mb-4 leading-relaxed bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
        📚 经典英文原著，含原文章节和中文注释，适合初中生阅读
      </p>

      <GoldLock previewLines={5} className="space-y-4">
        {pageItems.map(book => (
          <Link key={book.id} href={`/english/books/${book.id}`} className="block group">
            <div className="bg-white border border-[#ece8e0] rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#b45309]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-2xl shrink-0 border border-green-200">
                  {book.coverEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                    {book.title}<span className="text-[#999] font-normal">（{book.chineseTitle}）</span>
                  </h3>
                  <p className="text-[10px] text-[#b0a898]">{book.author} · {book.year} · {book.difficulty} · {book.wordCount}</p>
                  <p className="text-[10px] text-[#666] mt-1 line-clamp-2">{book.chineseSummary}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">初中</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">{book.chapters}章</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] group-hover:translate-x-0.5 transition-all shrink-0 mt-4" />
              </div>
            </div>
          </Link>
        ))}
      </GoldLock>

      <MemberLockOverlay show={showLock} onClose={() => setShowLock(false)} reason={check.reason} />
    </div>
  )
}
