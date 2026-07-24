'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, ChevronLeft } from 'lucide-react'
import { doctorHandbook } from '@/data/books'

export default function DoctorPage() {
  const book = doctorHandbook
  const totalCh = book.chapters.length
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 7
  const totalPages = Math.ceil(totalCh / perPage)
  const startIdx = (currentPage - 1) * perPage
  const pageChapters = book.chapters.slice(startIdx, startIdx + perPage)

  return (
    <div className="space-y-4">
      {/* 书籍标题 */}
      <div className="bg-gradient-to-r from-[#f0faf0] to-[#e8f5e8] border border-[#dce8dc] rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 bg-opacity-10 flex items-center justify-center shrink-0">
            <BookOpen size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1a1a1a]">{book.title}</h1>
            <p className="text-xs text-[#999] mt-0.5">{book.subtitle}</p>
            <p className="text-[11px] text-[#bbb] mt-0.5">全书共 {totalCh} 章 · {book.totalPages} 页</p>
          </div>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="space-y-1.5">
        <h2 className="text-xs font-semibold text-[#999] tracking-wide px-1 mb-2">📖 目录 · 共 {totalCh} 章</h2>
        {pageChapters.map((ch) => (
          <Link
            key={ch.slug}
            href={`/books/doctor/${ch.slug}`}
            className="block bg-white border border-[#ece8e0] rounded-xl px-4 py-3 transition-all hover:border-[#16a34a] hover:shadow-sm hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-[#1a1a1a]">{ch.title}</div>
                <div className="text-[11px] text-[#999] mt-1 line-clamp-1">
                  {ch.sections.join(' · ')}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-[#bbb]">{ch.pages}页</span>
                <ChevronRight size={14} className="text-[#16a34a]" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary text-xs disabled:opacity-30 px-3 py-1.5"
          >
            <ChevronLeft size={14} className="inline-block" /> 上一页
          </button>
          <span className="text-xs text-[#999]">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary text-xs disabled:opacity-30 px-3 py-1.5"
          >
            下一页 <ChevronRight size={14} className="inline-block" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 text-xs">
        {currentPage > 1 ? (
          <button onClick={() => setCurrentPage(p => p - 1)} className="text-[#16a34a] hover:underline inline-flex items-center gap-1">
            <ChevronLeft size={12} /> 上一页章节
          </button>
        ) : <span />}
        {currentPage < totalPages ? (
          <button onClick={() => setCurrentPage(p => p + 1)} className="text-[#16a34a] hover:underline inline-flex items-center gap-1">
            下一页章节 <ChevronRight size={12} />
          </button>
        ) : <span />}
      </div>
    </div>
  )
}
