'use client'

import Link from 'next/link'
import { ChevronRight, Crown, Star, Sparkles } from 'lucide-react'

// ─── Lottery list config ────────────────────────────────────────
const LOTTERY_LIST = [
  {
    id: 'ssq',
    name: '福彩双色球',
    emoji: '🔴🔵',
    desc: '6个红球(1-33) + 1个蓝球(1-16)，每周二四日开奖',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'dlt',
    name: '体彩大乐透',
    emoji: '🔵🟡',
    desc: '5个前区(1-35) + 2个后区(1-12)，每周一三六开奖',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'fc3d',
    name: '福彩3D',
    emoji: '3️⃣',
    desc: '3位数字(000-999)，每天开奖，直选组三组六',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'sg4d',
    name: '新加坡4D',
    emoji: '4️⃣',
    desc: '4位数字(0000-9999)，每周三六日开奖，含iBet',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'toto',
    name: '新加坡TOTO',
    emoji: '🎯',
    desc: '6个数字(1-49)，每周一四开奖，支持System7-12',
    color: 'from-emerald-500 to-teal-600',
  },
]

// ─── Lottery Card ──────────────────────────────────────────────
function LotteryCard({ item }) {
  return (
    <Link href={`/lottery/${item.id}`} className="group block">
      <div className="flex items-center gap-3 py-3 px-4">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-lg shadow-sm`}
        >
          <span className="drop-shadow-sm">{item.emoji}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#1c1917] group-hover:text-[#b45309] transition-colors">
            {item.name}
          </div>
          <div className="text-[11px] text-[#b0a898] leading-relaxed mt-0.5 line-clamp-2">
            {item.desc}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-[#d4cfc7] group-hover:text-[#b45309] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </div>
    </Link>
  )
}

// ─── Page Component ────────────────────────────────────────────
export default function LotteryPage() {
  return (
    <div className="max-w-xl mx-auto pb-12 animate-fade-in">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#b0a898] mb-5 px-1">
        <Link href="/" className="hover:text-[#b45309] transition-colors">
          首页
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1c1917] font-medium">彩票模拟器</span>
      </nav>

      {/* ── Header ── */}
      <div className="mb-5 px-1">
        <h1 className="text-xl font-bold text-[#1c1917] flex items-center gap-2">
          🎰 彩票模拟器
        </h1>
        <p className="text-[12px] text-[#b0a898] mt-1 leading-relaxed">
          双色球·大乐透·3D·4D·TOTO — 在线摇奖模拟
        </p>
      </div>

      {/* ── Lottery List ── */}
      <div className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
        {LOTTERY_LIST.map((item, index) => (
          <div key={item.id}>
            <LotteryCard item={item} />
            {index < LOTTERY_LIST.length - 1 && (
              <div className="mx-4 border-b border-[#ece8e0]" />
            )}
          </div>
        ))}
      </div>

      {/* ── Upgrade Banner ── */}
      <Link href="/lottery/upgrade" className="block mt-6 group">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#b45309]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#1c1917] flex items-center gap-1.5 group-hover:text-[#b45309] transition-colors">
                升级会员解锁摇奖
                <Star className="w-3.5 h-3.5 text-[#b45309]" />
                <Crown className="w-3.5 h-3.5 text-purple-600" />
              </h3>
              <p className="text-[11px] text-[#666] mt-1 leading-relaxed">
                黄金会员 · 500次摇奖 &nbsp;|&nbsp; 钻石会员 · 无限摇奖
              </p>
              <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-[#b45309] group-hover:text-[#a04407] transition-colors">
                了解会员权益 ›
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ── Footer Tip ── */}
      <div className="mt-4 px-1 text-center text-[10px] text-[#b0a898]">
        💎 黄金/钻石会员可摇奖
      </div>

      {/* ── Styles ── */}
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
