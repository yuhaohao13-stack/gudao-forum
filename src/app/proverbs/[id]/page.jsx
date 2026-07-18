'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronLeft, Quote, UserRound } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import PROVERBS from '@/data/proverbs'
import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'

export default function ProverbDetailPage() {
  const { id: paramId } = useParams()
  const { user } = useAuth()
  useEffect(() => { document.title = (proverb ? proverb.proverb + ' - 谚语故事' : '谚语故事') + ' — 古道论坛' }, [proverb])
  const id = Number(paramId)
  const allIds = PROVERBS.map(p => p.id)
  const currentIndex = allIds.indexOf(id)
  const proverb = PROVERBS.find(p => p.id === id)

  const prevProverb = currentIndex > 0 ? PROVERBS[currentIndex - 1] : null
  const nextProverb = currentIndex < PROVERBS.length - 1 ? PROVERBS[currentIndex + 1] : null

  if (!proverb) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3">💬</div>
        <p className="text-sm text-[#999]">未找到该谚语</p>
        <Link href="/proverbs" className="text-[11px] text-[#b45309] hover:underline mt-2 inline-block">
          返回谚语故事
        </Link>
      </div>
    )
  }

  // 访客提示注册
  if (!user) {
    return (
      <div className="anim-fade-in max-w-2xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '谚语故事', href: '/proverbs' },
          { label: proverb.proverb },
        ]} className="mb-3" />

        <Link href="/proverbs" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
          <ChevronLeft size={13} />
          返回列表
        </Link>

        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-12 sm:px-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] tracking-wide mb-2">{proverb.proverb}</h1>
          <div className="border-t border-[#f0ede8] mb-6" />
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <UserRound size={24} className="text-[#b45309]" />
          </div>
          <p className="text-sm text-[#888] mb-4">注册会员即可浏览全部谚语故事</p>
          <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
            免费注册
          </Link>
          <p className="text-[10px] text-[#b0a898] mt-3">已是会员？<Link href="/login" className="text-[#b45309] hover:underline">登录</Link></p>
        </div>

        <div className="text-center mt-4">
          <Link href="/proverbs" className="text-[11px] text-[#b45309] hover:underline">← 返回全部谚语</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '谚语故事', href: '/proverbs' },
        { label: proverb.proverb },
      ]} className="mb-3" />

      {/* Back link */}
      <Link
        href="/proverbs"
        className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3"
      >
        <ChevronLeft size={13} />
        返回列表
      </Link>

      {/* Content card */}
      <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-6 sm:px-8 sm:py-8 mb-4">
        {/* Proverb */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#1a1a1a] tracking-wide mb-3">
          {proverb.proverb}
        </h1>

        {/* Meaning */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-[11px] text-[#b0a898]">释义：</span>
          <p className="text-sm text-[#b45309] font-medium">{proverb.meaning}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f0ede8] mb-5" />

        {/* Story */}
        <div className="relative">
          <Quote size={18} className="text-[#ece8e0] absolute -top-1 -left-1 rotate-180" />
          <p className="text-sm leading-relaxed text-[#2a2a2a] px-6 py-1 indent-0"
            style={{
              fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', 'Songti SC', Georgia, serif",
              letterSpacing: '0.03em',
              lineHeight: '1.8',
            }}
          >
            {proverb.story}
          </p>
          <Quote size={18} className="text-[#ece8e0] absolute -bottom-1 -right-1" />
        </div>

        {/* ID badge */}
        <div className="flex justify-center mt-5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-[10px] text-[#b45309] font-medium">
            第 {proverb.id} 条 / 共 {PROVERBS.length} 条
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {prevProverb ? (
          <Link
            href={`/proverbs/${prevProverb.id}`}
            className="flex items-center gap-1.5 text-[11px] text-[#888] bg-white border border-[#ece8e0]
                       rounded-lg px-3 py-2 hover:border-[#b45309]/30 hover:text-[#b45309] transition-all group flex-1 min-w-0"
          >
            <ArrowLeft size={13} className="shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-[#b0a898]">上一条</div>
              <div className="truncate text-xs font-medium">{prevProverb.proverb}</div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextProverb ? (
          <Link
            href={`/proverbs/${nextProverb.id}`}
            className="flex items-center gap-1.5 text-[11px] text-[#888] bg-white border border-[#ece8e0]
                       rounded-lg px-3 py-2 hover:border-[#b45309]/30 hover:text-[#b45309] transition-all group flex-1 min-w-0 text-right"
          >
            <div className="min-w-0">
              <div className="text-[9px] text-[#b0a898]">下一条</div>
              <div className="truncate text-xs font-medium">{nextProverb.proverb}</div>
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
          href="/proverbs"
          className="inline-flex items-center gap-1 text-[11px] text-[#b45309] hover:underline transition-colors"
        >
          ← 返回全部谚语
        </Link>
      </div>
    </div>
  )
}
