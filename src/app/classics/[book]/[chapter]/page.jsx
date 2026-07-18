'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import CLASSICS from '@/data/classics'

export default function ClassicsChapterPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.book
  const chapterId = params.chapter

  const book = CLASSICS.find((b) => b.id === bookId)
  const chapter = book?.chapters.find((c) => c.id === Number(chapterId))

  if (!book || !chapter) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><BookOpen size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">该章节不存在</p>
        <Link
          href={book ? `/classics/${book.id}` : '/classics'}
          className="text-[#b45309] hover:underline mt-2 inline-block"
        >
          {book ? `返回《${book.title}》` : '返回四大名著'}
        </Link>
      </div>
    )
  }

  const currentIndex = book.chapters.findIndex((c) => c.id === Number(chapterId))
  const prevChapter = currentIndex > 0 ? book.chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < book.chapters.length - 1 ? book.chapters[currentIndex + 1] : null

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      <Breadcrumb
        crumbs={[
          { label: '首页', href: '/' },
          { label: '四大名著', href: '/classics' },
          { label: book.title, href: `/classics/${book.id}` },
          { label: chapter.title },
        ]}
        className="mb-3"
      />

      {/* Header */}
      <div className="mb-4">
        <Link
          href={`/classics/${book.id}`}
          className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors mb-2"
        >
          <ArrowLeft size={12} />
          返回目录
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{book.icon}</span>
          <h1 className="text-sm font-bold text-[#1a1a1a] leading-tight">{chapter.title}</h1>
        </div>
        <p className="text-[10px] text-[#b0a898]">
          《{book.title}》 · {book.author} · 第 {chapter.id} 回
        </p>
      </div>

      {/* Chapter content */}
      <div className="bg-white border border-[#ece8e0] rounded-lg px-4 py-5 sm:px-6 sm:py-6">
        <div
          className="leading-7 sm:leading-8 text-[13px] sm:text-[14px] text-[#2a2a2a] space-y-3"
          style={{ fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', 'STSong', serif" }}
        >
          {chapter.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="text-justify indent-8">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-4 gap-3">
        {prevChapter ? (
          <Link
            href={`/classics/${book.id}/${prevChapter.id}`}
            className="flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] transition-colors max-w-[45%] group"
          >
            <ChevronLeft size={14} className="shrink-0" />
            <span className="truncate">{prevChapter.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link
            href={`/classics/${book.id}/${nextChapter.id}`}
            className="flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] transition-colors max-w-[45%] group"
          >
            <span className="truncate">{nextChapter.title}</span>
            <ChevronRight size={14} className="shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Back to chapter list */}
      <div className="mt-4 text-center">
        <Link
          href={`/classics/${book.id}`}
          className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors"
        >
          <BookOpen size={12} />
          返回《{book.title}》目录
        </Link>
      </div>
    </div>
  )
}
