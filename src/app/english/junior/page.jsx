'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, BookOpen, BookMarked, BookText, Star, Quote, GraduationCap, Crown, Sparkles } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import GoldLock from '@/components/GoldLock'
import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay } from '@/lib/member'
import { JUNIOR_VOCAB } from '@/data/real-junior-vocab'

export default function JuniorOverviewPage() {
  const { user, profile } = useAuth()
  const check = canViewGoldContent(user, profile)

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
        🌱 中考词汇表 + 名师书籍推荐 + 英语学习资源，适合初中生系统学习
      </p>

      {/* Entry Cards */}
      <div className="space-y-3 mb-6">
        {/* 中考英语词汇表 */}
        <Link href="/english/junior/vocab" className="block group">
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:border-green-400/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-lg shrink-0 border border-green-200">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-[#16a34a] transition-colors">
                  中考英语词汇表
                </h3>
                <p className="text-[10px] text-[#999]">教育部《义务教育英语课程标准》 · {JUNIOR_VOCAB.length}词 · 每页50词</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#16a34a] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </Link>

        {/* 初中英文书籍 */}
        <Link href="/english/junior/books" className="block group">
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4 hover:border-blue-400/40 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-lg shrink-0 border border-blue-200">
                📚
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1c1917] group-hover:text-blue-600 transition-colors">
                  初中英文书籍
                </h3>
                <p className="text-[10px] text-[#999]">鲁滨逊·爱丽丝·汤姆索亚·金银岛·绿野仙踪</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </div>
        </Link>
      </div>

      <GoldLock previewLines={5}>
        {/* Resource Table */}
        <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm mb-4">
          <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-[#ece8e0]">
            <h2 className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-green-600" />
              中国英语教育官方标准
            </h2>
          </div>
          <div className="divide-y divide-[#f5f5f5]">
            {[
              { level: '🌱 中考（初中）', count: '1500-1600词', source: '教育部《义务教育英语课程标准》' },
              { level: '🌿 高考（高中）', count: '3500词', source: '教育部《普通高中英语课程标准》' },
              { level: '🎓 大学四级CET-4', count: '4500词', source: '全国大学英语考试大纲' },
              { level: '🎓 大学六级CET-6', count: '6000词', source: '全国大学英语考试大纲' },
              { level: '📖 Oxford 3000', count: '3000词', source: '牛津大学出版社核心词表' },
            ].map((row, i) => (
              <div key={i} className="px-4 py-2.5 text-xs grid grid-cols-3 gap-2 hover:bg-[#faf8f5]">
                <span className="font-medium text-[#1c1917]">{row.level}</span>
                <span className="text-[#b45309] font-semibold">{row.count}</span>
                <span className="text-[#888] text-[10px]">{row.source}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Book Recommendations */}
        <div className="space-y-4">
          <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-[#ece8e0]">
              <h2 className="text-xs font-bold text-[#1c1917] flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-purple-600" />
                权威名师/书籍推荐
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-[11px] font-bold text-[#b45309] mb-2 flex items-center gap-1">
                  <BookText className="w-3.5 h-3.5" />
                  语法方向（3本最经典）
                </h3>
                <div className="space-y-2">
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">1. 《薄冰英语语法》</p>
                    <p className="text-[10px] text-[#888]">薄冰著 · 中国语法教学泰斗，体系最完整，适合初中打基础</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">2. 《张道真实用英语语法》</p>
                    <p className="text-[10px] text-[#888]">张道真著 · 例句丰富，适合高中查漏补缺</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">3. 《赖世雄英语语法》</p>
                    <p className="text-[10px] text-[#888]">赖世雄著 · 通俗易懂，适合自学入门</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0ede8] pt-3">
                <h3 className="text-[11px] font-bold text-[#b45309] mb-2 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  词汇方向（3本最适合中国人）
                </h3>
                <div className="space-y-2">
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">1. 俞敏洪《词根+联想记忆法》</p>
                    <p className="text-[10px] text-[#888]">新东方 · 串记效率最高，适合中考/高考</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">2. 蒋争《英语词汇的奥秘》</p>
                    <p className="text-[10px] text-[#888]">词根词缀大全，理解单词生成规律</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">3. 刘毅《一口气英语/基础词汇》</p>
                    <p className="text-[10px] text-[#888]">分类记忆，适合基础薄弱者</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0ede8] pt-3">
                <h3 className="text-[11px] font-bold text-[#b45309] mb-2 flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5" />
                  名句方向
                </h3>
                <div className="space-y-2">
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">1. 《英语名句背诵手册》</p>
                    <p className="text-[10px] text-[#888]">新东方 · 中考精选100句</p>
                  </div>
                  <div className="bg-[#faf8f5] rounded-lg px-3 py-2">
                    <p className="text-[11px] font-medium text-[#1c1917]">2. 《高考英语名句必背》</p>
                    <p className="text-[10px] text-[#888]">高中必备150句</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Source note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[10px] text-[#666]">
            💡 以上书籍推荐根据中国英语教育名师整理，可在当当/京东等平台购买正版
          </div>
        </div>
      </GoldLock>
    </div>
  )
}
