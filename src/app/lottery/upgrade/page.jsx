'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Crown, Shield, Sparkles, ArrowLeft, Check, Heart } from 'lucide-react'

const PLANS = [
  {
    id: 'gold',
    name: '黄金会员',
    price: 9.9,
    icon: <Crown size={24} className="text-[#FFD700]" />,
    color: 'from-[#FFD700] to-[#FFA500]',
    features: [
      '500次摇奖机会',
      '支持所有彩票类型',
      '选号/机选功能',
      '查看历史记录',
    ],
    note: '打赏后联系管理员升级',
  },
  {
    id: 'diamond',
    name: '钻石会员',
    price: 99,
    icon: <Shield size={24} className="text-[#00BFFF]" />,
    color: 'from-[#00BFFF] to-[#1E90FF]',
    features: [
      '无限次摇奖机会 ♾️',
      '支持所有彩票类型',
      '选号/机选功能',
      '查看历史记录',
      '尊贵钻石标识 💎',
    ],
    note: '打赏后联系管理员升级',
    popular: true,
  },
]

const PAYMENT_INFO = {
  contact: '打赏后联系浩哥（飞书）提升等级',
}

export default function UpgradePage() {
  const { user, profile } = useAuth()
  const [copied, setCopied] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('diamond')

  const openDonate = () => {
    window.dispatchEvent(new CustomEvent('open-donate'))
  }

  const currentLevel = profile?.membership_level || 'regular'

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-xs text-[#999] mb-4">
        <Link href="/" className="hover:text-[#b45309]">首页</Link>
        <span>/</span>
        <Link href="/lottery" className="hover:text-[#b45309]">彩票模拟器</Link>
        <span>/</span>
        <span className="text-[#666]">会员升级</span>
      </div>

      <Link href="/lottery" className="inline-flex items-center gap-1 text-sm text-[#b45309] hover:underline mb-4">
        <ArrowLeft size={14} /> 返回彩票模拟器
      </Link>

      <h1 className="text-2xl font-bold text-[#1c1917] mb-2">会员升级</h1>
      <p className="text-sm text-[#888] mb-6">升级会员即可使用彩票模拟器摇奖功能</p>

      {/* 当前等级 */}
      <div className="bg-[#fefaf5] border border-[#eee8dc] rounded-xl p-4 mb-6">
        <div className="text-sm text-[#888] mb-1">当前等级</div>
        <div className="flex items-center gap-3">
          {currentLevel === 'diamond' && <><Shield size={20} className="text-[#00BFFF]" /><span className="font-semibold text-[#1c1917]">钻石会员 💎</span><span className="text-xs text-[#00BFFF]">无限次摇奖</span></>}
          {currentLevel === 'gold' && <><Crown size={20} className="text-[#FFD700]" /><span className="font-semibold text-[#1c1917]">黄金会员 🏆</span><span className="text-xs text-[#888]">{profile?.gold_draws_remaining || 0}次剩余</span></>}
          {currentLevel === 'regular' && <><span className="text-[#999]">普通会员 / 访客</span><span className="text-xs text-[#b45309]">需升级才能摇奖</span></>}
        </div>
      </div>

      {/* 套餐选择 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative text-left bg-white border-2 rounded-xl p-5 transition-all hover:shadow-md ${
              selectedPlan === plan.id 
                ? 'border-[#b45309] shadow-sm' 
                : 'border-[#ece8e0] hover:border-[#ddd]'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2.5 right-3 bg-[#b45309] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                推荐
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                {plan.icon}
              </div>
              <div>
                <div className="font-bold text-[#1c1917]">{plan.name}</div>
                <div className="text-lg font-bold text-[#b45309]">¥{plan.price}</div>
              </div>
            </div>
            <ul className="space-y-1.5 mb-3">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-[#666]">
                  <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="text-[10px] text-[#aaa] italic">{plan.note}</div>
          </button>
        ))}
      </div>

      {/* 打赏升级按钮 */}
      <div className="bg-gradient-to-r from-[#fefaf5] to-[#fdf8f4] border border-[#eee8dc] rounded-xl p-6 mb-6 text-center">
        <div className="text-lg mb-2">💝</div>
        <h2 className="font-bold text-[#1c1917] text-base mb-1">打赏升级会员</h2>
        <p className="text-xs text-[#888] mb-4">点击下方按钮打赏，联系管理员即可升级</p>
        <button
          onClick={openDonate}
          className="inline-flex items-center gap-2 bg-[#b45309] hover:bg-[#92400e] text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Heart size={18} />
          打赏支持
        </button>
        <div className="mt-3 p-3 bg-[#FFD700] bg-opacity-10 border border-[#FFD700] border-opacity-20 rounded-lg">
          <p className="text-xs text-[#666] flex items-center gap-1 justify-center">
            <Sparkles size={14} className="text-[#FFD700]" />
            {PAYMENT_INFO.contact}
          </p>
        </div>
      </div>

      {/* 常见问题 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-5">
        <h2 className="font-semibold text-[#1c1917] text-sm mb-3">❓ 常见问题</h2>
        <div className="space-y-3 text-xs text-[#666]">
          <div>
            <div className="font-medium text-[#444] mb-0.5">如何升级黄金会员？</div>
            <div>点击「打赏支持」按钮，打赏 ¥9.9 后联系浩哥飞书，管理员手动提升会员等级并发放500次摇奖机会。</div>
          </div>
          <div>
            <div className="font-medium text-[#444] mb-0.5">钻石会员有什么额外权益？</div>
            <div>打赏 ¥99 升级钻石会员，无限次摇奖，尊贵钻石标识。</div>
          </div>
          <div>
            <div className="font-medium text-[#444] mb-0.5">黄金会员次数用完了怎么办？</div>
            <div>联系浩哥续费即可补充摇奖次数。</div>
          </div>
          <div>
            <div className="font-medium text-[#444] mb-0.5">升级后立即生效吗？</div>
            <div>管理员确认打赏后立即手动升级，升级后即可使用摇奖功能。</div>
          </div>
        </div>
      </div>
    </div>
  )
}
