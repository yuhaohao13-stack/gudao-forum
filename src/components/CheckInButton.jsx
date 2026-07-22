'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function CheckInButton({ className = '' }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)

  // 检查今天是否已签到（每次挂载或用户变化时）
  useEffect(() => {
    if (!user) { setCheckedIn(false); return }
    fetch('/api/checkin/status')
      .then(r => r.json())
      .then(data => { if (data.checked_in) setCheckedIn(true) })
      .catch(() => {})
  }, [user])

  const refreshPoints = () => {
    window.dispatchEvent(new CustomEvent('points-updated'))
  }

  const handleCheckIn = async () => {
    if (!user || checkedIn || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkin', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setCheckedIn(true)
        refreshPoints()
      } else if (data.message === '今日已签到') {
        setCheckedIn(true)
      }
    } catch (e) {}
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
  )
}
