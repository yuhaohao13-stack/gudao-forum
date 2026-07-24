'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { canUseAI } from '@/lib/member'
import { MemberLockOverlay } from '@/lib/member'
import Link from 'next/link'
import { Cpu, Sparkles, Brain, ChevronRight, Zap, BarChart3, Shield, Globe, Bot, MessageSquare } from 'lucide-react'

const MODELS = [
  {
    id: 'deepseek',
    name: 'DeepSeek V4',
    icon: <Brain size={28} className="text-[#4f46e5]" />,
    color: '#4f46e5',
    bg: 'from-[#eef2ff] to-[#e0e7ff]',
    border: '#c7d2fe',
    desc: '深度推理 · 逻辑分析 · 代码编写',
    tagline: '擅长深度思考与复杂问题拆解',
    features: ['复杂逻辑推理', '代码生成与调试', '多轮深度对话', '中英文双语精通'],
    speed: '⭐⭐⭐⭐',
    accuracy: '⭐⭐⭐⭐⭐',
  },
  {
    id: 'gemini',
    name: 'Gemini 3.6 Flash',
    icon: <Sparkles size={28} className="text-[#059669]" />,
    color: '#059669',
    bg: 'from-[#ecfdf5] to-[#d1fae5]',
    border: '#a7f3d0',
    desc: '快速响应 · 多模态 · 创意生成',
    tagline: '闪电速度，创意无限',
    features: ['极速响应', '创意写作与文案', '多轮对话', '多模态理解（图片）'],
    speed: '⭐⭐⭐⭐⭐',
    accuracy: '⭐⭐⭐⭐',
  },
]

export default function AiToolsPage() {
  const { user, profile } = useAuth()
  const [quota, setQuota] = useState(null)

  useEffect(() => {
    if (user && profile) {
      const check = canUseAI(user, profile)
      if (check.allowed) setQuota(check)
    }
  }, [user, profile])

  const checkAccess = (modelId) => {
    if (!user) return 'login'
    const level = profile?.membership_level || 'regular'
    if (level === 'regular') return 'upgrade'
    return 'ok'
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-5">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">🤖 AI 智能工具箱</h1>
        <p className="text-xs text-[#999] mt-1">精选两大顶级AI模型，助力学习与创作</p>
      </div>

      {/* 剩余配额 */}
      {quota && (
        <div className="bg-gradient-to-r from-[#fefaf5] to-[#fdf8f4] border border-[#eee8dc] rounded-xl p-3 text-center">
          <span className="text-xs text-[#999]">本月剩余问答次数：</span>
          <span className="text-sm font-bold text-[#b45309]">{quota.remaining}</span>
          <span className="text-xs text-[#999]"> / {quota.max} 次</span>
        </div>
      )}

      {/* 模型列表 */}
      {MODELS.map((model) => {
        const access = checkAccess(model.id)
        const isLocked = access !== 'ok'

        return (
          <div key={model.id} className="block relative">
            <Link href={isLocked ? '#' : `/ai-tools/${model.id}`} className="block w-full">
            <div className={`bg-gradient-to-r ${model.bg} border border-[${model.border}] rounded-xl p-4 sm:p-5 transition-all hover:shadow-sm hover:-translate-y-0.5 ${isLocked ? 'opacity-30' : ''}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
                  {model.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#1a1a1a]">{model.name}</h2>
                    <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-[#666]">{model.speed}</span>
                  </div>
                  <p className="text-xs text-[#666] mt-0.5">{model.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {model.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full text-[#888]">{f}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#999] shrink-0 mt-2" />
              </div>
            </div>
          </Link>
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center z-10 rounded-xl pointer-events-none">
              <div className="text-center bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs font-semibold text-[#666]">
                  {access === 'login' ? '登录后查看' : '最低黄金会员可入'}
                </div>
              </div>
            </div>
          )}
          </div>
        )
      })}

      {/* 会员说明 */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
        <h3 className="text-xs font-semibold text-[#999] mb-3">📋 会员权益说明</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 px-3 bg-[#fefaf5] rounded-lg">
            <span className="text-[#666]">👤 访客 / 普通会员</span>
            <span className="text-[#bbb]">不可使用</span>
          </div>
          <div className="flex justify-between items-center py-1.5 px-3 bg-[#fefce8] rounded-lg">
            <span className="text-[#92400e] font-semibold">🥇 黄金会员 ¥9.9</span>
            <span className="text-[#b45309] font-bold">100 次问答</span>
          </div>
          <div className="flex justify-between items-center py-1.5 px-3 bg-[#fef2f2] rounded-lg">
            <span className="text-[#991b1b] font-semibold">💎 钻石会员 ¥99</span>
            <span className="text-[#dc2626] font-bold">1000 次问答</span>
          </div>
        </div>
        <div className="mt-3 text-center">
          <Link href="/lottery/upgrade" className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
            打赏升级会员 <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
