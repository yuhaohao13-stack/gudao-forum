'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink, Download } from 'lucide-react'
import { militiaHandbook, doctorHandbook } from '@/data/books'

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const { slug: chapterSlug } = params
  const book = militiaHandbook
  const bookSlug = 'militia'

  const chIndex = book.chapters.findIndex(c => c.slug === chapterSlug)
  const chapter = book.chapters[chIndex]
  const prevCh = chIndex > 0 ? book.chapters[chIndex - 1] : null
  const nextCh = chIndex < book.chapters.length - 1 ? book.chapters[chIndex + 1] : null

  if (!chapter) {
    return (
      <div className="text-center py-12">
        <p className="text-[#999]">章节不存在</p>
        <Link href={`/books/${bookSlug}`} className="text-[#b45309] hover:underline text-sm mt-2 inline-block">
          返回目录
        </Link>
      </div>
    )
  }

  const pdfViewUrl = `${book.pdfUrl}#page=${chapter.pageStart}`

  return (
    <div className="space-y-4">
      {/* 章节头部 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={16} className="text-[#b45309]" />
          <span className="text-[11px] text-[#999]">{book.title}</span>
        </div>
        <h1 className="text-base sm:text-lg font-bold text-[#1a1a1a]">{chapter.title}</h1>
        <p className="text-xs text-[#999] mt-1">第 {chapter.pages} 页 · 共 {book.totalPages} 页</p>

        {/* 小节列表 */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {chapter.sections.map((s, i) => (
            <span key={i} className="text-[10px] bg-[#f5f5f5] text-[#666] px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* PDF 阅读器 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#fafafa] border-b border-[#ece8e0]">
          <span className="text-xs text-[#999]">📄 文档预览（打开至第 {chapter.pageStart} 页）</span>
          <div className="flex items-center gap-2">
            <a
              href={pdfViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#b45309] hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink size={11} /> 新窗口打开
            </a>
            <a
              href={book.pdfUrl}
              download
              className="text-[10px] text-[#b45309] hover:underline inline-flex items-center gap-1"
            >
              <Download size={11} /> 下载PDF
            </a>
          </div>
        </div>
        <div className="w-full" style={{ height: '75vh' }}>
          <iframe
            src={pdfViewUrl}
            className="w-full h-full border-0"
            title={chapter.title}
          />
        </div>
      </div>

      {/* 上一章 / 下一章 */}
      <div className="flex items-center justify-between gap-3">
        {prevCh ? (
          <Link
            href={`/books/${bookSlug}/${prevCh.slug}`}
            className="flex-1 bg-white border border-[#ece8e0] rounded-xl p-3 transition-all hover:border-[#b45309] hover:shadow-sm"
          >
            <div className="text-[10px] text-[#999] mb-1"><ChevronLeft size={12} className="inline-block" /> 上一章</div>
            <div className="text-xs font-semibold text-[#1a1a1a] truncate">{prevCh.title}</div>
          </Link>
        ) : <div className="flex-1" />}
        {nextCh ? (
          <Link
            href={`/books/${bookSlug}/${nextCh.slug}`}
            className="flex-1 bg-white border border-[#ece8e0] rounded-xl p-3 transition-all hover:border-[#b45309] hover:shadow-sm text-right"
          >
            <div className="text-[10px] text-[#999] mb-1">下一章 <ChevronRight size={12} className="inline-block" /></div>
            <div className="text-xs font-semibold text-[#1a1a1a] truncate">{nextCh.title}</div>
          </Link>
        ) : <div className="flex-1" />}
      </div>

      {/* 回目录 */}
      <div className="text-center">
        <Link
          href={`/books/${bookSlug}`}
          className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> 返回目录
        </Link>
      </div>
    </div>
  )
}
