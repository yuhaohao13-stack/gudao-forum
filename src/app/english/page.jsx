'use client'

import Link from 'next/link'
import { ChevronRight, BookOpen, GraduationCap, Sparkles, Crown, BookMarked, BookText } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

export default function EnglishPage() {
  return (
    <div className="max-w-xl mx-auto pb-12 animate-fade-in">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '英语学习' },
      ]} className="mb-3" />

      <div className="mb-6 px-1">
        <h1 className="text-xl font-bold text-[#1c1917] flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-[#b45309]" />
          英语学习
        </h1>
        <p className="text-[12px] text-[#b0a898] mt-1 leading-relaxed">
          中考词汇 · 高中词汇 · 英文书籍
        </p>
        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-full text-[10px] text-[#b45309] border border-amber-200">
          <Crown className="w-3 h-3" />
          黄金会员 · 全部解锁
        </div>
      </div>

      <div className="space-y-3">
        {/* 初中英语 */}
        <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-[#ece8e0]">
            <span className="text-xl">🌱</span>
            <div>
              <h2 className="text-sm font-bold text-[#1c1917]">初中英语</h2>
              <p className="text-[10px] text-[#b0a898]">Junior High School English</p>
            </div>
          </div>

          <Link href="/english/junior" className="block group">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f5f5f5] hover:bg-[#fafaf5] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-sm shrink-0">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                  初中词汇与语法
                </div>
                <div className="text-[10px] text-[#999]">中考词汇 · 名师推荐 · 学习资源</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] transition-all" />
            </div>
          </Link>

          <Link href="/english/junior/books" className="block group">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#fafaf5] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-sm shrink-0">
                <BookText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                  英文书籍（初中）
                </div>
                <div className="text-[10px] text-[#999]">5本经典 · 鲁滨逊·汤姆索亚·绿野仙踪</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] transition-all" />
            </div>
          </Link>
        </div>

        {/* 高中英语 */}
        <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-[#ece8e0]">
            <span className="text-xl">🌿</span>
            <div>
              <h2 className="text-sm font-bold text-[#1c1917]">高中英语</h2>
              <p className="text-[10px] text-[#b0a898]">Senior High School English</p>
            </div>
          </div>

          <Link href="/english/senior" className="block group">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f5f5f5] hover:bg-[#fafaf5] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-sm shrink-0">
                <BookOpen className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                  高中词汇与语法
                </div>
                <div className="text-[10px] text-[#999]">台湾学测词汇 · 名师推荐 · 学习资源</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] transition-all" />
            </div>
          </Link>

          <Link href="/english/senior/books" className="block group">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#fafaf5] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-sm shrink-0">
                <BookMarked className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                  英文书籍（高中）
                </div>
                <div className="text-[10px] text-[#999]">5本经典 · 傲慢与偏见·白鲸记·圣诞颂歌</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#b45309] transition-all" />
            </div>
          </Link>
        </div>
      </div>

      <Link href="/lottery/upgrade" className="block mt-6 group">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#b45309]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#1c1917] flex items-center gap-1.5 group-hover:text-[#b45309] transition-colors">
                升级会员解锁全部内容
                <Crown className="w-3.5 h-3.5 text-purple-600" />
              </h3>
              <p className="text-[11px] text-[#666] mt-1 leading-relaxed">
                黄金会员 · 解锁全部英语学习内容
              </p>
              <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[#b45309] group-hover:text-[#a04407] transition-colors">
                了解会员权益 ›
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 px-1 text-center text-[10px] text-[#b0a898]">
        💎 黄金/钻石会员可查看全部英语学习内容
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
