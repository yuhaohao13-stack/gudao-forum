'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, ChevronLeft, BookOpen, Clock, FileText } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { BOOKS } from '@/data/english-books'

export default function BookDetailPage() {
  const id = Number(useParams().id)
  const { user, profile } = useAuth()
  const [showLock, setShowLock] = useState(false)
  const check = canViewGoldContent(user, profile)
  
  const book = BOOKS.find(b => b.id === id)
  const levelPath = book?.level === 'junior' ? '/english/junior/books' : '/english/senior/books'

  useEffect(() => {
    if (book) document.title = `${book.title} — 古道论坛`
  }, [book])

  if (!book) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3">📚</div>
        <p className="text-sm text-[#999]">未找到该书籍</p>
        <Link href="/english" className="text-[11px] text-[#b45309] hover:underline mt-2 inline-block">返回英语学习</Link>
      </div>
    )
  }

  const contentChunks = book.content.split('\n\n')
  const previewContent = contentChunks.slice(0, 3).join('\n\n')

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习', href: '/english' },
        { label: book.level === 'junior' ? '初中书籍' : '高中书籍', href: levelPath },
        { label: book.title },
      ]} className="mb-3" />

      <Link href={levelPath} className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronRight className="w-3 h-3 rotate-180" />
        返回书单
      </Link>

      {/* Book Header */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-amber-200 shrink-0">
            {book.coverEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#1c1917]">{book.title}</h1>
            <p className="text-xs text-[#888]">{book.chineseTitle}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-[#666]">{book.author}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-[#666]">{book.year}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-[#666]">{book.difficulty}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-[#666]">{book.wordCount}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-[#666]">{book.chapters}章</span>
            </div>
            <div className="mt-2 text-[10px] text-green-700 bg-green-50 rounded px-2 py-1 inline-block border border-green-200">
              ✅ 公版正版 · {book.source}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4 mb-5">
        <h2 className="text-xs font-bold text-[#1c1917] mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#b45309]" />
          内容简介
        </h2>
        <p className="text-xs text-[#555] leading-relaxed mb-3">{book.summary}</p>
        <div className="border-t border-[#f5f5f5] pt-3">
          <h3 className="text-[11px] font-bold text-[#b45309] mb-1">中文简介</h3>
          <p className="text-xs text-[#666] leading-relaxed">{book.chineseSummary}</p>
        </div>
      </div>

      {/* Original Content */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
        <h2 className="text-xs font-bold text-[#1c1917] mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#b45309]" />
          英文原文节选
        </h2>

        <GoldLock previewLines={5}>
          <div className="text-[12px] leading-relaxed text-[#333] space-y-2"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            {contentChunks.map((chunk, i) => (
              <p key={i} className="indent-4">{chunk}</p>
            ))}
          </div>
        </GoldLock>
      </div>

      <div className="mt-4 text-center">
        <Link href={levelPath}
          className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors">
          <ArrowLeft size={12} />
          返回{book.level === 'junior' ? '初中' : '高中'}书单
        </Link>
      </div>

      <MemberLockOverlay show={showLock} onClose={() => setShowLock(false)} reason={check.reason} />
    </div>
  )
}
