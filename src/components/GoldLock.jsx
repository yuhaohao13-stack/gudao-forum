'use client'

import { useAuth } from '@/components/AuthProvider'
import { canViewGoldContent, MemberLockOverlay, getUpgradeInfo } from '@/lib/member'
import { useState } from 'react'

// 黄金会员锁定包裹组件
// 用法：<GoldLock> <fullContent /> </GoldLock>
// 普通会员只显示 previewLines 行内容 + 升级提示
export default function GoldLock({
  children,
  previewLines = 5,
  className = '',
}) {
  const { user, profile } = useAuth()
  const [showLock, setShowLock] = useState(false)
  const check = canViewGoldContent(user, profile)

  // 钻石/黄金会员直接看全部
  if (check.allowed) {
    return <div className={className}>{children}</div>
  }

  // 未登录或普通会员：显示有限行数 + 点击解锁
  const previewContent = String(children).trim()
  const lines = previewContent.split('\n').slice(0, previewLines)

  return (
    <div className={className}>
      {/* 预览内容 */}
      <div className="relative overflow-hidden">
        <div className="text-sm leading-relaxed text-[#2a2a2a] space-y-3">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* 渐变遮罩 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* 升级提示 */}
      <div className="text-center py-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
          <span className="text-xl">💎</span>
        </div>
        <p className="text-sm font-medium text-[#888] mb-1">
          {getUpgradeInfo(check.reason).title}
        </p>
        <p className="text-xs text-[#aaa] mb-4">
          {getUpgradeInfo(check.reason).desc}
        </p>
        <button
          onClick={() => setShowLock(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#b45309] to-[#d97706] text-white text-sm font-semibold hover:from-[#a04407] hover:to-[#c06806] transition-all shadow-sm"
        >
          🔓 解锁完整内容
        </button>
      </div>

      <MemberLockOverlay
        show={showLock}
        onClose={() => setShowLock(false)}
        reason={check.reason}
      />
    </div>
  )
}
