'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import CLASSICS from '@/data/classics'

const PAGE_SIZE = 20

export default function ClassicsBookPage() {
  useEffect(() => { document.title = (book ? book.title + '·四大名著' : '四大名著') + ' — 古道论坛' }, [book])
  const { book: bookId } = useParams()
  const router = useRouter()
  const [page, setPage] = useState(1)

  const book = CLASSICS.find((b) => b.id === bookId)

  if (!book) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><BookOpen size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">该书籍不存在</p>
        <Link href="/classics" className="text-[#b45309] hover:underline mt-2 inline-block">
          返回四大名著
        </Link>
      </div>
    )
  }

  const totalPages = Math.ceil(book.chapters.length / PAGE_SIZE)
  const startIdx = (page - 1) * PAGE_SIZE
  const pageChapters = book.chapters.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-8">
      <Breadcrumb
        crumbs={[
          { label: '首页', href: '/' },
          { label: '四大名著', href: '/classics' },
          { label: book.title },
        ]}
        className="mb-3"
      />

      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/classics"
          className="text-[#b45309]/60 hover:text-[#b45309] transition-colors shrink-0"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="text-2xl shrink-0">{book.icon}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-bold text-[#1a1a1a]">{book.title}</h1>
          <p className="text-[10px] text-[#aaa]">
            {book.author} 著 · 共 {book.totalChapters} 回 · 已收录 {book.chapters.length} 回
          </p>
        </div>
      </div>

      <p className="text-[10px] text-[#888] leading-relaxed mb-4 bg-[#f5f0e8] rounded-lg px-3.5 py-2.5">
        {book.desc}
      </p>

      {/* Chapter list */}
      <div className="space-y-1">
        {pageChapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/classics/${book.id}/${chapter.id}`}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer group bg-white border-[#ece8e0] hover:border-[#b45309]/30 hover:bg-[#fcfaf7]"
          >
            <span className="text-[10px] text-[#b0a898] font-mono shrink-0 w-6 text-right">
              {chapter.id}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-[#1a1a1a]">{chapter.title}</p>
              <p className="text-[10px] text-[#999] leading-relaxed line-clamp-1 mt-0.5">
                {chapter.summary || chapter.content.slice(0, 60) + '……'}
              </p>
            </div>
            <span className="text-[9px] text-[#b45309] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              阅读 →
            </span>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={13} />
            上一页
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum
              if (totalPages <= 7) {
                pageNum = i + 1
              } else if (page <= 4) {
                pageNum = i + 1
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i
              } else {
                pageNum = page - 3 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 text-[11px] rounded-md transition-colors ${
                    pageNum === page
                      ? 'bg-[#b45309] text-white'
                      : 'text-[#666] hover:bg-[#f5f0e8]'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一页
            <ChevronRight size={13} />
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <p className="text-[9px] text-[#b0a898] text-center mt-2">
          第 {page} / {totalPages} 页 · 显示第 {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, book.chapters.length)} 回
        </p>
      )}
    </div>
  )
}
