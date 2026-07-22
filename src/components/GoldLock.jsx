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
  contentId = '',
}) {
  const { user, profile } = useAuth()
  const [showLock, setShowLock] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [spending, setSpending] = useState(false)
  const [spendMsg, setSpendMsg] = useState('')
  const check = canViewGoldContent(user, profile)

  // 钻石/黄金会员直接看全部
  if (check.allowed || unlocked) {
    return <div className={className}>{children}</div>
  }

  // 积分解锁
  const handlePointsUnlock = async () => {
    if (!user) { setShowLock(true); return }
    setSpending(true)
    setSpendMsg('')
    const res = await fetch('/api/points/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'content_view', reference_id: contentId }),
    })
    const data = await res.json()
    if (data.success) {
      setUnlocked(true)
      window.dispatchEvent(new CustomEvent('points-updated'))
    } else {
      setSpendMsg(data.message || '积分不足，查看需500积分')
      setTimeout(() => setSpendMsg(''), 4000)
    }
    setSpending(false)
  }

  // 未登录或普通会员：显示有限预览 + 点击解锁
  const isTextChildren = typeof children === 'string' || typeof children === 'number'

  return (
    <div className={className}>
      {isTextChildren ? (
        /* 文本内容：显示有限行数预览 */
        <div className="relative overflow-hidden">
          <div className="text-sm leading-relaxed text-[#2a2a2a] space-y-3">
            {String(children).trim().split('\n').slice(0, previewLines).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {/* 渐变遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
      ) : (
        /* 组件内容：显示条目数量预览+遮罩 */
        <div className="relative overflow-hidden">
          <div className="opacity-30 pointer-events-none select-none">
            {children}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>
      )}

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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            onClick={handlePointsUnlock}
            disabled={spending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
          >
            {spending ? '处理中...' : '💰 500积分查看'}
          </button>
          <button
            onClick={() => setShowLock(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#b45309] to-[#d97706] text-white text-sm font-semibold hover:from-[#a04407] hover:to-[#c06806] transition-all shadow-sm"
          >
            🔓 升级会员解锁
          </button>
        </div>
        {spendMsg && (
          <p className="text-xs text-amber-600 mt-2">{spendMsg}</p>
        )}
      </div>

      <MemberLockOverlay
        show={showLock}
        onClose={() => setShowLock(false)}
        reason={check.reason}
      />
    </div>
  )
}
