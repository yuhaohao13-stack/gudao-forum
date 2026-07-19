'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, GraduationCap, Sparkles, Crown } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { JUNIOR_VOCAB } from '@/data/real-junior-vocab'

export default function JuniorOverviewPage() {
  const { user, profile } = useAuth()
  const check = canViewGoldContent(user, profile)
  const [showLock, setShowLock] = useState(false)

  useEffect(() => { document.title = '初中词汇与语法 — 古道论坛' }, [])

  return (
    <div className="anim-fade-in max-w-2xl mx-auto pb-6">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习', href: '/english' },
        { label: '初中词汇与语法' },
      ]} className="mb-3" />

      <Link href="/english" className="inline-flex items-center gap-1 text-[11px] text-[#b0a898] hover:text-[#b45309] transition-colors mb-3">
        <ChevronRight className="w-3 h-3 rotate-180" />
        返回英语学习
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌱</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">初中词汇与语法</h1>
      </div>

      <p className="text-[11px] text-[#666] mb-4 leading-relaxed bg-green-50 border border-green-200 rounded-lg px-3 py-2">
        🌱 中考词汇表 + 英文原著阅读，适合初中生学习
      </p>

      {/* Entry Cards */}
      <div className="space-y-3">
        <Link href="/english/junior/vocab" className="block group">
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:border-green-400/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-lg shrink-0 border border-green-200">📖</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-[#16a34a] transition-colors">中考英语词汇表</h3>
                <p className="text-[10px] text-[#999]">教育部《义务教育英语课程标准》 · 1815词 · 每页50词</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#16a34a] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </Link>

        <Link href="/english/junior/books" className="block group">
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:border-blue-400/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-lg shrink-0 border border-blue-200">📚</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-blue-600 transition-colors">初中英文书籍</h3>
                <p className="text-[10px] text-[#999]">鲁滨逊 · 爱丽丝 · 汤姆索亚 · 金银岛 · 绿野仙踪</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
