'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronLeft, UserRound } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import IDIOMS from '@/data/idioms'
import { useAuth } from '@/components/AuthProvider'
import GoldLock from '@/components/GoldLock'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'

export default function IdiomDetailPage() {
  const id = Number(useParams().id)
  const { user, profile } = useAuth()
  const goldCheck = canViewGoldContent(user, profile)
  const allIds = IDIOMS.map(p => p.id)
  const currentIndex = allIds.indexOf(id)
  const item = IDIOMS.find(p => p.id === id)

  const prevItem = currentIndex > 0 ? IDIOMS[currentIndex - 1] : null
  const nextItem = currentIndex < IDIOMS.length - 1 ? IDIOMS[currentIndex + 1] : null

  if (!item) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3">📖</div>
        <p className="text-sm text-[#999]">未找到该成语</p>
        <Link href="/idioms" className="text-[11px] text-[#b45309] hover:underline mt-2 inline-block">
          返回成语故事
        </Link>
      </div>
    )
  }

  // 访客提示注册
  if (!user && typeof user !== 'undefined') {
    return (
      <div className="anim-fade-in max-w-2xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '成语故事', href: '/idioms' },
          { label: item.idiom },
        ]} className="mb-3" />

        <Link href="/idioms" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
          <ChevronLeft size={13} />
          返回列表
        </Link>

        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-12 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#b45309] tracking-wide mb-2">{item.idiom}</h1>
          <div className="border-t border-[#f0ede8] mb-6" />
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
            <UserRound size={24} className="text-[#b45309]" />
          </div>
          <p className="text-sm text-[#888] mb-4">注册会员即可浏览全部成语故事</p>
          <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#b45309] text-white hover:bg-[#92400e] transition-colors">
            免费注册
          </Link>
          <p className="text-[10px] text-[#b0a898] mt-3">已是会员？<Link href="/login" className="text-[#b45309] hover:underline">登录</Link></p>
        </div>

        <div className="text-center mt-4">
          <Link href="/idioms" className="text-[11px] text-[#b45309] hover:underline">← 返回全部成语</Link>
        </div>
      </div>
    )
  }

  // 黄金/钻石会员：显示全部内容
  if (goldCheck.allowed) {
    return (
      <div className="anim-fade-in max-w-2xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '成语故事', href: '/idioms' },
          { label: item.idiom },
        ]} className="mb-3" />
        <Link href="/idioms" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
          <ChevronLeft size={13} />
          返回列表
        </Link>
        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-6 sm:px-8 sm:py-8 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#b45309] tracking-wide mb-2">{item.idiom}</h1>
          <p className="text-center text-[10px] text-[#b0a898] mb-3">#{item.id}</p>
          <div className="flex justify-center mb-5">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-[#b45309] text-xs font-medium border border-amber-200">{item.meaning}</span>
          </div>
          <div className="border-t border-[#f0ede8] mb-5" />
          <div className="text-sm sm:text-base leading-relaxed text-[#2a2a2a] space-y-3">
            <p>{item.story}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {prevItem ? (
            <Link href={`/idioms/${prevItem.id}`}
              className="flex items-center gap-1.5 text-[11px] text-[#888] bg-white border border-[#ece8e0] rounded-lg px-3 py-2 hover:border-[#b45309]/30 hover:text-[#b45309] transition-all group flex-1 min-w-0">
              <ArrowLeft size={13} className="shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] text-[#b0a898]">上一个</div>
                <div className="truncate text-xs font-medium">{prevItem.idiom}</div>
              </div>
            </Link>
          ) : (<div className="flex-1" />)}
          {nextItem ? (
            <Link href={`/idioms/${nextItem.id}`}
              className="flex items-center gap-1.5 text-[11px] text-[#888] bg-white border border-[#ece8e0] rounded-lg px-3 py-2 hover:border-[#b45309]/30 hover:text-[#b45309] transition-all group flex-1 min-w-0 text-right">
              <div className="min-w-0">
                <div className="text-[9px] text-[#b0a898]">下一个</div>
                <div className="truncate text-xs font-medium">{nextItem.idiom}</div>
              </div>
              <ArrowRight size={13} className="shrink-0" />
            </Link>
          ) : (<div className="flex-1" />)}
        </div>
        <div className="text-center">
          <Link href="/idioms" className="inline-flex items-center gap-1 text-[11px] text-[#b45309] hover:underline transition-colors">← 返回全部成语</Link>
        </div>
      </div>
    )
  }

  // 普通会员：显示预览+升级提示
  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '成语故事', href: '/idioms' },
        { label: item.idiom },
      ]} className="mb-3" />
      <Link href="/idioms" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronLeft size={13} />
        返回列表
      </Link>
      <GoldLock previewLines={5}>
        <div className="bg-white border border-[#ece8e0] rounded-xl px-5 py-6 sm:px-8 sm:py-8 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#b45309] tracking-wide mb-2">{item.idiom}</h1>
          <div className="flex justify-center mb-5">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-[#b45309] text-xs font-medium border border-amber-200">{item.meaning}</span>
          </div>
          <div className="border-t border-[#f0ede8] mb-5" />
          <div className="text-sm sm:text-base leading-relaxed text-[#2a2a2a] space-y-3">
            <p>{item.story}</p>
          </div>
        </div>
      </GoldLock>
      <div className="text-center">
        <Link href="/idioms" className="inline-flex items-center gap-1 text-[11px] text-[#b45309] hover:underline transition-colors">← 返回全部成语</Link>
      </div>
    </div>
  )
