'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, GraduationCap, Sparkles, Crown } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { SENIOR_VOCAB } from '@/data/real-senior-vocab'

export default function SeniorOverviewPage() {
  const { user, profile } = useAuth()
  const [showLock, setShowLock] = useState(false)
  const check = canViewGoldContent(user, profile)

  useEffect(() => { document.title = '高中词汇与名著 — 古道论坛';
    // SEO
    let m = document.querySelector('meta[name=description]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = '高中英语学习，台湾学测4000字+指考7000字词汇3754词，高中英文名著阅读。适合高中生英语学习、大学入学考试备考。';
    let k = document.querySelector('meta[name=keywords]');
    if (!k) { k = document.createElement('meta'); k.name = 'keywords'; document.head.appendChild(k); }
    k.content = '高中英语,台湾学测英文,指考英文词汇,高中英文书籍,学测4000字,指考7000词,英文原著阅读,高中英语学习' }, [])

  return (
    <div className="anim-fade-in max-w-2xl mx-auto pb-6">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习', href: '/english' },
        { label: '高中词汇与名著' },
      ]} className="mb-3" />

      <Link href="/english" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronRight className="w-3 h-3 rotate-180" />
        返回英语学习
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌿</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">高中词汇与名著</h1>
      </div>

      <p className="text-[11px] text-[#666] mb-4 leading-relaxed bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        🌿 台湾学测/指考词汇 + 英文原著阅读，适合高中生学习
      </p>

      <div className="space-y-3">
        <Link href="/english/senior/vocab" className="block group">
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:border-amber-400/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center text-lg shrink-0 border border-amber-200">📖</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-[#b45309] transition-colors">台湾高中英文词汇</h3>
                <p className="text-[10px] text-[#999]">大學學測4000字+指考7000字 · 3754词 · 每页50词</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </Link>

        <Link href="/english/senior/books" className="block group">
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:border-blue-400/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-lg shrink-0 border border-blue-200">📚</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-blue-600 transition-colors">高中英文书籍</h3>
                <p className="text-[10px] text-[#999]">傲慢与偏见 · 圣诞颂歌 · 野性的呼唤 · 远大前程 · 白鲸记</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
