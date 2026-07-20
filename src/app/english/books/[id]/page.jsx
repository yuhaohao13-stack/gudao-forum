'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ChevronRight, ChevronLeft, BookOpen, FileText, Loader2, ChevronsLeft, ChevronsRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { BOOKS } from '@/data/english-books'
import { JUNIOR_VOCAB } from '@/data/real-junior-vocab'
import { SENIOR_VOCAB } from '@/data/real-senior-vocab'

// 构建词汇快速查找表
const VOCAB_MAP = new Map()
JUNIOR_VOCAB.forEach(v => VOCAB_MAP.set(v.word.toLowerCase(), v.meaning))
SENIOR_VOCAB.forEach(v => VOCAB_MAP.set(v.word.toLowerCase(), v.meaning))

// 从段落中提取重点词汇注释
function extractVocab(para) {
  const words = para.toLowerCase().match(/[a-z]+[a-z\'\-]+[a-z]/g) || []
  const unique = [...new Set(words)]
  const found = []
  for (const w of unique) {
    if (w.length <= 3) continue // 跳过太短的词
    const meaning = VOCAB_MAP.get(w)
    if (meaning) {
      found.push({ word: w, meaning })
      if (found.length >= 5) break // 每段最多5个注释
    }
  }
  return found
}

const CHAPTER_RE = /(^|\n)(CHAPTER|Chapter|STAVE|Chapter I|Stave)\s*/gm

export default function BookDetailPage() {
  const id = Number(useParams().id)
  const { user, profile } = useAuth()
  const [showLock, setShowLock] = useState(false)
  const [fullText, setFullText] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const check = canViewGoldContent(user, profile)
  const goldAllowed = check.allowed

  const book = BOOKS.find(b => b.id === id)
  const levelPath = book?.level === 'junior' ? '/english/junior/books' : '/english/senior/books'

  useEffect(() => {
    if (book) document.title = `${book.title} — 古道论坛`
  }, [book])

  useEffect(() => {
    if (!book) return
    setLoading(true)
    const filename = book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') + '.txt'
    fetch(`/books/${filename}`)
      .then(r => r.ok ? r.text() : Promise.reject('not found'))
      .then(text => {
        // Strip Project Gutenberg header (up to *** START)
        let clean = text.replace(/^.*?\*\*\* START OF (THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*/s, '')
        // Strip footer (from *** END)
        clean = clean.replace(/\*\*\* END OF (THE|THIS) PROJECT GUTENBERG EBOOK.*/s, '').trim()
        setFullText(clean)
      })
      .catch(() => setFullText(book.content || ''))
      .finally(() => setLoading(false))
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

  // Split into paragraphs for display
  const paragraphs = fullText.split('\n').filter(p => p.trim())
  const PER_PAGE = 50
  const totalPages = Math.ceil(paragraphs.length / PER_PAGE)
  const pageParagraphs = paragraphs.slice((page - 1) * PER_PAGE, page * PER_PAGE)

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
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-[#666]">{book.chapters}章</span>
            </div>
            <div className="mt-2 text-[10px] text-green-700 bg-green-50 rounded px-2 py-1 inline-block border border-green-200">
              ✅ 公版正版 · Project Gutenberg
            </div>
            {!loading && (
              <div className="text-[10px] text-[#999] mt-1">
                共 {paragraphs.length} 段 · {totalPages} 页
              </div>
            )}
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

      {/* Full Original Content */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
        <h2 className="text-xs font-bold text-[#1c1917] mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#b45309]" />
          英文原文
          {goldAllowed && !loading && <span className="text-[10px] text-[#999] font-normal ml-auto">第{page}/{totalPages}页</span>}
        </h2>

        {/* 未登录访客：注册引导 */}
        {!user && typeof user !== 'undefined' ? (
          <div className="text-center py-10">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
              <UserRound size={24} className="text-[#b45309]" />
            </div>
            <p className="text-sm text-[#888] mb-3">注册会员即可浏览英文原著全文</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
                免费注册
              </Link>
              <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border border-[#b45309] text-[#b45309] hover:bg-amber-50 transition-colors">
                登录
              </Link>
            </div>
          </div>
        ) : goldAllowed ? (
          /* 黄金/钻石会员：全文 */
          loading ? (
            <div className="py-10 text-center">
              <Loader2 className="w-5 h-5 animate-spin text-[#b45309] mx-auto mb-2" />
              <p className="text-xs text-[#999]">加载原文中...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {pageParagraphs.map((para, i) => {
                  const vocabNotes = extractVocab(para)
                  return (
                    <div key={i}>
                      <p className="text-[12px] leading-relaxed text-[#333] indent-4"
                        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        {para}
                      </p>
                      {vocabNotes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-0.5 ml-4">
                          {vocabNotes.map((v, j) => (
                            <span key={j} className="text-[10px] text-[#999]/60">
                              <span className="font-medium text-[#888]">{v.word}</span>
                              {' '}
                              <span className="text-[#bbb]">{v.meaning}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#f5f5f5]">
                  <button onClick={() => setPage(1)} disabled={page === 1}
                    className="p-1.5 rounded border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-[#666]">{page}/{totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                    className="p-1.5 rounded border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-[#b0a898] ml-2">每页50段</span>
                </div>
              )}
            </>
          )
        ) : (
          /* 已登录非黄金：GoldLock预览 */
          <GoldLock previewLines={5}>
            {loading ? (
              <div className="py-10 text-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#b45309] mx-auto mb-2" />
                <p className="text-xs text-[#999]">加载原文中...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pageParagraphs.slice(0, 5).map((para, i) => (
                  <p key={i} className="text-[12px] leading-relaxed text-[#333] indent-4"
                    style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                    {para}
                  </p>
                ))}
              </div>
            )}
          </GoldLock>
        )}
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
