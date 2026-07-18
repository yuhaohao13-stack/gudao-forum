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
  const { book: bookId } = useParams()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  const book = CLASSICS.find((b) => b.id === bookId)

  useEffect(() => {
    document.title = book ? book.title + '·四大名著 — 古道论坛' : '四大名著 — 古道论坛'
  }, [book])

  // 按需加载章回数据：只加载当前书
  useEffect(() => {
    if (!bookId) return
    let cancelled = false
    setLoading(true)
    const load = async () => {
      let mod
      switch (bookId) {
        case 'shuihu': mod = await import('@/data/parts/classics-shuihu'); break
        case 'sanguo': mod = await import('@/data/parts/classics-sanguo'); break
        case 'xiyouji': mod = await import('@/data/parts/classics-xiyouji'); break
        case 'hongloumeng': mod = await import('@/data/parts/classics-honglou'); break
        default: mod = { default: [] }
      }
      if (!cancelled) { setChapters(mod.default); setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [bookId])

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

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>
  }

  const totalPages = Math.ceil(chapters.length / PAGE_SIZE)
  const startIdx = (page - 1) * PAGE_SIZE
  const pageChapters = chapters.slice(startIdx, startIdx + PAGE_SIZE)

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
        <Link href="/classics"
          className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors shrink-0">
          <ArrowLeft size={12} />
          返回
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg">{book.icon}</span>
          <h1 className="text-sm font-bold text-[#1a1a1a]">{book.title}</h1>
        </div>
        <span className="text-[10px] text-[#b0a898] ml-auto">
          {chapters.length} 回
        </span>
      </div>

      {book.desc && (
        <p className="text-[10px] text-[#b0a898] mb-3 leading-relaxed">{book.desc}</p>
      )}

      {/* 章节列表 */}
      <div className="space-y-0.5">
        {pageChapters.map((ch) => (
          <Link
            key={ch.id}
            href={`/classics/${book.id}/${ch.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#faf8f5] transition-colors group"
          >
            <span className="text-[10px] text-[#c5bdb0] font-mono w-8 shrink-0 text-right">
              #{ch.id}
            </span>
            <span className="text-xs text-[#444] leading-snug truncate group-hover:text-[#b45309] transition-colors">
              {ch.title}
            </span>
            <ChevronRight size={12} className="text-[#ddd6c8] shrink-0 ml-auto" />
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="text-[10px] px-2 py-1 rounded border border-[#ece8e0] bg-white text-[#666] disabled:opacity-30 hover:border-[#b45309]/30 transition-colors"
          >
            上一页
          </button>
          <span className="text-[10px] text-[#999]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="text-[10px] px-2 py-1 rounded border border-[#ece8e0] bg-white text-[#666] disabled:opacity-30 hover:border-[#b45309]/30 transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
