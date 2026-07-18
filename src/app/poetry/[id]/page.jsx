'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronLeft, UserRound } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import POEMS from '@/data/poetry'

export default function PoemDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const allIds = POEMS.map(p => p.id)
  const currentIndex = allIds.indexOf(id)
  const poem = POEMS.find(p => p.id === id)

  const prevPoem = currentIndex > 0 ? POEMS[currentIndex - 1] : null
  const nextPoem = currentIndex < POEMS.length - 1 ? POEMS[currentIndex + 1] : null

  if (!poem) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3">📜</div>
        <p className="text-sm text-[#999]">未找到该诗作</p>
        <Link href="/poetry" className="text-[11px] text-[#b45309] hover:underline mt-2 inline-block">
          返回唐诗三百首
        </Link>
      </div>
    )
  }

  const contentLines = poem.content.split('\n')

  // 访客提示注册
  if (!user) {
    return (
      <div className="anim-fade-in max-w-2xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '唐诗三百首', href: '/poetry' },
          { label: poem.title },
        ]} className="mb-3" />

        <Link href="/poetry" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
          <ChevronLeft size={13} />
          返回列表
        </Link>

        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-12 sm:px-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] tracking-wide mb-1">{poem.title}</h1>
          <p className="text-center text-sm text-[#b0a898] mb-6">—— {poem.author} ——</p>
          <div className="border-t border-[#f0ede8] mb-6" />
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <UserRound size={24} className="text-[#b45309]" />
          </div>
          <p className="text-sm text-[#888] mb-4">注册会员即可浏览唐诗三百首全部内容</p>
          <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
            免费注册
          </Link>
          <p className="text-[10px] text-[#b0a898] mt-3">已是会员？<Link href="/login" className="text-[#b45309] hover:underline">登录</Link></p>
        </div>

        <div className="text-center mt-4">
          <Link href="/poetry" className="inline-flex items-center gap-1 text-[11px] text-[#b45309] hover:underline">← 返回全部唐诗</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '唐诗三百首', href: '/poetry' },
        { label: poem.title },
      ]} className="mb-3" />

      {/* Back link */}
      <Link
        href="/poetry"
        className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3"
      >
        <ChevronLeft size={13} />
        返回列表
      </Link>

      {/* Poem header */}
      <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-6 sm:px-8 sm:py-8 mb-4">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] tracking-wide mb-1">
          {poem.title}
        </h1>

        {/* Author */}
        <p className="text-center text-sm text-[#b0a898] mb-3">
          —— {poem.author} ——
        </p>

        {/* Category tag */}
        <div className="flex justify-center mb-5">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium
            ${poem.category === '山水田园' ? 'bg-green-50 text-green-700' :
              poem.category === '边塞征战' ? 'bg-red-50 text-red-700' :
              poem.category === '咏物言志' ? 'bg-blue-50 text-blue-700' :
              poem.category === '送别友情' ? 'bg-purple-50 text-purple-700' :
              poem.category === '思乡怀人' ? 'bg-orange-50 text-orange-700' :
              'bg-amber-50 text-amber-700'}`}
          >
            {poem.category}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f0ede8] mb-5" />

        {/* Poem content */}
        <div className="space-y-2.5 text-center">
          {contentLines.map((line, i) => (
            <p
              key={i}
              className="text-base sm:text-lg leading-relaxed text-[#2a2a2a]"
              style={{
                fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', 'Songti SC', Georgia, serif",
                letterSpacing: '0.05em',
              }}
            >
              {line}
              {/* Add punctuation if line doesn't end with punctuation */}
              {!/[，。！？、；：，．,\.!?;:]$/.test(line) && i < contentLines.length - 1 ? '' : ''}
            </p>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {prevPoem ? (
          <Link
            href={`/poetry/${prevPoem.id}`}
            className="flex items-center gap-1.5 text-[11px] text-[#888] bg-white border border-[#ece8e0]
                       rounded-lg px-3 py-2 hover:border-[#b45309]/30 hover:text-[#b45309] transition-all group flex-1 min-w-0"
          >
            <ArrowLeft size={13} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-[#b0a898]">上一首</div>
              <div className="truncate text-xs font-medium">{prevPoem.title} — {prevPoem.author}</div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextPoem ? (
          <Link
            href={`/poetry/${nextPoem.id}`}
            className="flex items-center gap-1.5 text-[11px] text-[#888] bg-white border border-[#ece8e0]
                       rounded-lg px-3 py-2 hover:border-[#b45309]/30 hover:text-[#b45309] transition-all group flex-1 min-w-0 text-right"
          >
            <div className="min-w-0">
              <div className="text-[9px] text-[#b0a898]">下一首</div>
              <div className="truncate text-xs font-medium">{nextPoem.title} — {nextPoem.author}</div>
            </div>
            <ArrowRight size={13} className="shrink-0" />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      {/* Back to list */}
      <div className="text-center">
        <Link
          href="/poetry"
          className="inline-flex items-center gap-1 text-[11px] text-[#b45309] hover:underline transition-colors"
        >
          ← 返回全部唐诗
        </Link>
      </div>
    </div>
  )
}
