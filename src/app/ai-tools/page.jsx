'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { canUseAI } from '@/lib/member'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const MODELS = [
  {
    id: 'deepseek',
    name: 'DeepSeek V4',
    icon: '🧠',
    bg: 'from-[#eef2ff] to-[#e0e7ff]',
    border: '#c7d2fe',
    tagline: '擅长深度思考与复杂问题拆解',
    features: ['复杂逻辑推理', '代码生成与调试', '多轮深度对话', '中英文双语精通'],
    speed: '⭐⭐⭐⭐',
  },
  {
    id: 'gemini',
    name: 'Gemini 3.6 Flash',
    icon: '✨',
    bg: 'from-[#ecfdf5] to-[#d1fae5]',
    border: '#a7f3d0',
    tagline: '闪电速度，创意无限',
    features: ['极速响应', '创意写作与文案', '多轮对话', '多模态理解（图片）'],
    speed: '⭐⭐⭐⭐⭐',
  },
]

export default function AiToolsPage() {
  const { user, profile } = useAuth()
  const [quota, setQuota] = useState(null)
  const [modalType, setModalType] = useState(null)

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

        const handleClick = (e) => {
          if (isLocked) {
            e.preventDefault()
            setModalType(access === 'login' ? 'login' : 'upgrade')
          }
        }

        return (
          <div key={model.id}>
            <Link
              href={isLocked ? '#' : `/ai-tools/${model.id}`}
              onClick={handleClick}
              className={`block w-full bg-gradient-to-r ${model.bg} rounded-xl p-4 sm:p-5 transition-all hover:shadow-sm hover:-translate-y-0.5 ${isLocked ? 'opacity-30 cursor-pointer' : ''}`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm text-xl">
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
            </Link>
          </div>
        )
      })}

      {/* 弹窗 */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setModalType(null)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-xl max-w-sm w-[calc(100%-2rem)] text-center">
            <div
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-3xl mb-3">🔒</div>
              <div className="text-sm font-semibold text-[#1a1a1a] mb-2">
                {modalType === 'login' ? '请先登录' : '升级会员才能使用'}
              </div>
              <div className="text-xs text-[#999] mb-5">
                {modalType === 'login' ? '登录后即可免费使用 AI 智能工具箱' : '最低黄金会员可入，打赏升级解锁全部功能'}
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 text-xs rounded-lg border border-[#e0dcd4] text-[#666] hover:bg-[#f5f5f5]"
                  onClick={() => setModalType(null)}
                >
                  取消
                </button>
                <Link
                  href={modalType === 'login' ? '/login?redirect=/ai-tools' : '/lottery/upgrade'}
                  className="flex-1 py-2.5 text-xs rounded-lg bg-[#b45309] text-white text-center font-medium hover:bg-[#92400e]"
                  onClick={() => setModalType(null)}
                >
                  {modalType === 'login' ? '去登录' : '查看会员'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

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
