'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function CheckInButton({ className = '' }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [message, setMessage] = useState('')

  // 检查今天是否已签到
  useEffect(() => {
    if (!user) return
    const check = async () => {
      try {
        const res = await fetch('/api/checkin/status')
        const data = await res.json()
        if (data.checked_in) setCheckedIn(true)
      } catch (e) {}
    }
    check()
  }, [user])

  // 获取最新积分
  const refreshPoints = () => {
    // 全局事件让其他组件重新加载
    window.dispatchEvent(new CustomEvent('points-updated'))
  }

  const handleCheckIn = async () => {
    if (!user || checkedIn || loading) return
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/checkin', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setCheckedIn(true)
        let msg = `✅ 签到成功 +${data.points_earned}积分`
        if (data.bonus > 0) msg += ` 月签到奖励 +${data.bonus}积分 🎉`
        setMessage(msg)
        refreshPoints()
        setTimeout(() => setMessage(''), 5000)
      } else {
        if (data.message === '今日已签到') {
          setCheckedIn(true)
        }
        setMessage(data.message)
      }
    } catch (e) {
      setMessage('签到失败，请稍后再试')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <Link href="/login" className={`inline-flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e8e8e8] transition-colors ${className}`}>
        <CheckCircle size={14} />
        <span>签到</span>
      </Link>
    )
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleCheckIn}
        disabled={checkedIn || loading}
        className={`inline-flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${className} ${
          checkedIn
            ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
            : 'bg-[#f5f5f5] text-[#1a1a1a] hover:bg-[#e8e8e8]'
        }`}
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : checkedIn ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : (
          <CheckCircle size={14} />
        )}
        <span>{checkedIn ? '已签到' : '签到'}</span>
      </button>
      {message && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-green-200 rounded-lg px-3 py-1.5 text-xs text-green-700 shadow-lg whitespace-nowrap z-50 anim-fade-in">
          {message}
        </div>
      )}
    </div>
  )
}
