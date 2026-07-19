'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, UserRound } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import CLASSICS from '@/data/classics'
import { useAuth } from '@/components/AuthProvider'
import GoldLock from '@/components/GoldLock'
import { canViewGoldContent } from '@/lib/member'
import { useEffect, useState } from 'react'

export default function ClassicsChapterPage() {
  const params = useParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const goldCheck = canViewGoldContent(user, profile)
  const bookId = params.book
  const chapterId = params.chapter
  const [chapters, setChapters] = useState([])

  const book = CLASSICS.find((b) => b.id === bookId)

  // 按需加载章回数据
  useEffect(() => {
    if (!bookId) return
    let cancelled = false
    const load = async () => {
      let mod
      switch (bookId) {
        case 'shuihu': mod = await import('@/data/parts/classics-shuihu'); break
        case 'sanguo': mod = await import('@/data/parts/classics-sanguo'); break
        case 'xiyouji': mod = await import('@/data/parts/classics-xiyouji'); break
        case 'hongloumeng': mod = await import('@/data/parts/classics-honglou'); break
        default: mod = { default: [] }
      }
      if (!cancelled) setChapters(mod.default)
    }
    load()
    return () => { cancelled = true }
  }, [bookId])

  const chapter = chapters.find((c) => c.id === Number(chapterId))

  useEffect(() => {
    const t = chapter ? chapter.title + ' - ' + (book ? book.title : '') : '四大名著'
    document.title = t + ' — 古道论坛'
  }, [book, chapter])

  if (!book || !chapter) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><BookOpen size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">该章节不存在</p>
        <Link href={book ? `/classics/${book.id}` : '/classics'} className="text-[#b45309] hover:underline mt-2 inline-block">
          {book ? `返回《${book.title}》` : '返回四大名著'}
        </Link>
      </div>
    )
  }

  const currentIndex = chapters.findIndex((c) => c.id === Number(chapterId))
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  // 访客提示注册
  if (!user) {
    return (
      <div className="anim-fade-in max-w-3xl mx-auto pb-12">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '四大名著', href: '/classics' },
          { label: book.title, href: `/classics/${book.id}` },
          { label: chapter.title },
        ]} className="mb-3" />

        <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
          <ChevronLeft size={13} />
          返回目录
        </Link>

        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-12 text-center">
          <h1 className="text-lg font-bold text-[#1a1a1a] mb-4">{chapter.title}</h1>
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <UserRound size={24} className="text-[#b45309]" />
          </div>
          <p className="text-sm text-[#888] mb-4">注册会员即可浏览四大名著全部章节</p>
          <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">免费注册</Link>
          <p className="text-[10px] text-[#b0a898] mt-3">已是会员？<Link href="/login" className="text-[#b45309] hover:underline">登录</Link></p>
        </div>
        <div className="text-center mt-4">
          <Link href={`/classics/${book.id}`} className="text-[11px] text-[#b45309] hover:underline">← 返回《{book.title}》目录</Link>
        </div>
      </div>
    )
  }

  // 黄金/钻石会员：显示全部内容
  if (goldCheck.allowed) {
    return (
      <div className="anim-fade-in max-w-3xl mx-auto pb-12">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '四大名著', href: '/classics' },
          { label: book.title, href: `/classics/${book.id}` },
          { label: chapter.title },
        ]} className="mb-3" />
        <div className="mb-4">
          <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors mb-2">
            <ArrowLeft size={12} />
            返回目录
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{book.icon}</span>
            <h1 className="text-sm font-bold text-[#1a1a1a] leading-tight">{chapter.title}</h1>
          </div>
          <p className="text-[10px] text-[#b0a898]">《{book.title}》 · {book.author} · 第 {chapter.id} 回</p>
        </div>
        <div className="bg-white border border-[#ece8e0] rounded-lg px-4 py-5 sm:px-6 sm:py-6">
          <div className="leading-7 sm:leading-8 text-[13px] sm:text-[14px] text-[#2a2a2a] space-y-3"
            style={{ fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'SimSun', 'STSong', serif" }}>
            {chapter.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-justify indent-8">{paragraph.trim()}</p>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 gap-3">
          {prevChapter ? (
            <Link href={`/classics/${book.id}/${prevChapter.id}`} className="flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] transition-colors max-w-[45%] group">
              <ChevronLeft size={14} className="shrink-0" />
              <span className="truncate">{prevChapter.title}</span>
            </Link>
          ) : <div />}
          {nextChapter ? (
            <Link href={`/classics/${book.id}/${nextChapter.id}`} className="flex items-center gap-1.5 text-[11px] px-3.5 py-2 rounded-lg border border-[#ece8e0] bg-white text-[#666] hover:border-[#b45309]/40 hover:text-[#b45309] transition-colors max-w-[45%] group">
              <span className="truncate">{nextChapter.title}</span>
              <ChevronRight size={14} className="shrink-0" />
            </Link>
          ) : <div />}
        </div>
        <div className="mt-4 text-center">
          <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors">
            <BookOpen size={12} />
            返回《{book.title}》目录
          </Link>
        </div>
      </div>
    )
  }

  // 普通会员：显示预览+升级提示
  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '四大名著', href: '/classics' },
        { label: book.title, href: `/classics/${book.id}` },
        { label: chapter.title },
      ]} className="mb-3" />
      <div className="mb-4">
        <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors mb-2">
          <ArrowLeft size={12} />
          返回目录
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{book.icon}</span>
          <h1 className="text-sm font-bold text-[#1a1a1a] leading-tight">{chapter.title}</h1>
        </div>
        <p className="text-[10px] text-[#b0a898]">《{book.title}》 · {book.author} · 第 {chapter.id} 回</p>
      </div>
      <GoldLock previewLines={5}>
        <div className="bg-white border border-[#ece8e0] rounded-lg px-4 py-5 sm:px-6 sm:py-6">
          <div className="leading-7 sm:leading-8 text-[13px] sm:text-[14px] text-[#2a2a2a] space-y-3">
            {chapter.content.split('\n').slice(0, 5).map((paragraph, idx) => (
              <p key={idx} className="text-justify indent-8">{paragraph.trim()}</p>
            ))}
          </div>
        </div>
      </GoldLock>
      <div className="mt-4 text-center">
        <Link href={`/classics/${book.id}`} className="inline-flex items-center gap-1 text-[10px] text-[#b45309]/60 hover:text-[#b45309] transition-colors">
          <BookOpen size={12} />
          返回《{book.title}》目录
        </Link>
      </div>
    </div>
  )
}
