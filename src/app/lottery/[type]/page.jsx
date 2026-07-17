'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { createClient } from '@/lib/supabase/client'
import {
  Sparkles,
  RotateCcw,
  Star,
  Crown,
  Trophy,
  History,
  Lock,
  User,
  Zap,
  Loader2,
  X,
  AlertTriangle,
  Gift,
  RefreshCw,
  ChevronDown,
  ArrowLeft,
  MessageCircle,
  Copy,
  Heart,
} from 'lucide-react'

// ─── Lottery type configuration ─────────────────────────────────
const TYPE_CONFIG = {
  ssq: {
    name: '福彩双色球',
    emoji: '🔴🔵',
    rule: '6个红球(1-33) + 1个蓝球(1-16)',
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50 border-red-200',
    textColor: 'text-red-600',
    ballColors: { primary: 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c]', secondary: 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]' },
  },
  dlt: {
    name: '体彩大乐透',
    emoji: '🔵🟡',
    rule: '5个前区(1-35) + 2个后区(1-12)',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-600',
    ballColors: { primary: 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c]', secondary: 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]' },
  },
  fc3d: {
    name: '福彩3D',
    emoji: '3️⃣',
    rule: '3位数字(000-999)，直选/组三/组六',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50 border-amber-200',
    textColor: 'text-amber-600',
    ballColors: { primary: 'bg-gradient-to-br from-[#b45309] to-[#d97706]' },
  },
  sg4d: {
    name: '新加坡4D',
    emoji: '4️⃣',
    rule: '4位数字(0000-9999)，含iBet',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50 border-purple-200',
    textColor: 'text-purple-600',
    ballColors: { primary: 'bg-gradient-to-br from-[#7c3aed] to-[#6d28d9]' },
  },
  toto: {
    name: '新加坡TOTO',
    emoji: '🎯',
    rule: '6个数字(1-49)，System7-12',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    textColor: 'text-emerald-600',
    ballColors: { primary: 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c]' },
  },
}

const TYPE_NAMES = {
  ssq: '双色球',
  dlt: '大乐透',
  fc3d: '3D',
  sg4d: '4D',
  toto: 'TOTO',
}

// ─── Format helpers ────────────────────────────────────────────
function formatDrawTime(iso) {
  try {
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return iso
  }
}

// ─── Small selectable number ball ──────────────────────────────
function NumberBall({ num, selected, color, onClick, size = 'sm' }) {
  const sizeClass = size === 'lg' ? 'w-9 h-9 text-sm' : 'w-8 h-8 text-xs'
  const base = 'inline-flex items-center justify-center rounded-full font-bold cursor-pointer select-none transition-all duration-150'
  const selClass = selected
    ? 'ring-2 ring-offset-1 ring-[#b45309] scale-110 shadow-md'
    : 'hover:scale-105 hover:shadow-sm opacity-90 hover:opacity-100'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${sizeClass} ${selClass} ${color}`}
    >
      {String(num).padStart(2, '0')}
    </button>
  )
}

// ─── Large result ball (white bold text, gradient background) ──
function ResultBall({ num, color, size = 'lg', type }) {
  const sizeClass = size === 'xl' ? 'w-20 h-16 text-4xl' : size === 'lg' ? 'w-12 h-12 text-xl' : 'w-10 h-10 text-lg'

  // For fc3d/sg4d we use a block/square styling
  if (type === 'digit') {
    return (
      <span
        className={`inline-flex items-center justify-center w-14 h-16 rounded-xl bg-gradient-to-b from-[#b45309] to-[#d97706] text-white font-bold text-3xl shadow-md`}
        style={{
          animation: 'ballBounceIn 0.45s ease-out forwards',
          opacity: 0,
        }}
      >
        {num}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold text-white ${sizeClass} ${color} shadow-md`}
      style={{
        animation: 'ballBounceIn 0.45s ease-out forwards',
        opacity: 0,
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
      }}
    >
      {String(num).padStart(2, '0')}
    </span>
  )
}

// ─── History record ball (mini) ────────────────────────────────
function MiniResultBall({ num, color }) {
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-bold ${color} shadow-sm`}>
      {String(num).padStart(2, '0')}
    </span>
  )
}

// ─── Main Page ─────────────────────────────────────────────────
export default function LotteryTypePage() {
  const params = useParams()
  const router = useRouter()
  const type = params?.type
  const config = TYPE_CONFIG[type]
  const typeName = TYPE_NAMES[type] || '彩票'

  const supabase = createClient()

  // ── State ──
  const [selected, setSelected] = useState({})
  const [result, setResult] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const [drawsRemaining, setDrawsRemaining] = useState(0)
  const [userLevel, setUserLevel] = useState('regular')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showDonateInfo, setShowDonateInfo] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [copied, setCopied] = useState('')
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [isAuthLoaded, setIsAuthLoaded] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  // Direct input for fc3d/sg4d
  const [directInput, setDirectInput] = useState('')

  // ── Initialize selections per type ──
  const initSelection = useCallback(() => {
    switch (type) {
      case 'ssq':
        setSelected({ red: [], blue: null })
        break
      case 'dlt':
        setSelected({ front: [], back: [] })
        break
      case 'fc3d':
        setSelected(['', '', ''])
        setDirectInput('')
        break
      case 'sg4d':
        setSelected(['', '', '', ''])
        setDirectInput('')
        break
      case 'toto':
        setSelected({ numbers: [], system: 6 })
        break
      default:
        setSelected({})
    }
  }, [type])

  // ── Init ──
  useEffect(() => {
    initSelection()
    setResult(null)
    setError('')
    setDrawing(false)
  }, [type, initSelection])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)
      setIsAuthLoaded(true)
      if (user) await fetchUserStatus()
    }
    init()
  }, [])

  // ── Fetch user status & history ──
  const fetchUserStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/lottery/draw')
      if (!res.ok) return
      const data = await res.json()
      setUserLevel(data.level || 'regular')
      setDrawsRemaining(data.draws_remaining || 0)
      // Filter history for current type only
      const typeHistory = (data.records || []).filter(r => r.lottery_type === type)
      setHistory(typeHistory)
    } catch {
      // silent
    }
  }, [type])

  // Re-fetch when type changes
  useEffect(() => {
    if (user) fetchUserStatus()
  }, [type, user, fetchUserStatus])

  // ── Num toggle (SSQ red, DLT front/back) ──
  const toggleNum = useCallback((field, num, maxSelect) => {
    setSelected(prev => {
      const arr = [...(prev[field] || [])]
      const idx = arr.indexOf(num)
      if (idx >= 0) {
        arr.splice(idx, 1)
      } else if (arr.length < maxSelect) {
        arr.push(num)
        arr.sort((a, b) => a - b)
      }
      return { ...prev, [field]: arr }
    })
  }, [])

  // ── Single select (SSQ blue) ──
  const setSingle = useCallback((field, num) => {
    setSelected(prev => ({ ...prev, [field]: num }))
  }, [])

  // ── Digit toggle (3D/4D) ──
  const setDigit = useCallback((pos, num) => {
    setSelected(prev => {
      const arr = [...prev]
      arr[pos] = String(num)
      return arr
    })
  }, [])

  // ── Direct input (3D/4D) ──
  const handleDirectInput = useCallback((val) => {
    const maxLen = type === 'fc3d' ? 3 : 4
    const clean = val.replace(/\D/g, '').slice(0, maxLen)
    setDirectInput(clean)
    const arr = clean.padEnd(maxLen, ' ').split('').slice(0, maxLen)
    setSelected(arr.map(c => (c === ' ' ? '' : c)))
  }, [type])

  // ── TOTO system change ──
  const setTotoSystem = useCallback((val) => {
    const sys = parseInt(val) || 6
    setSelected(prev => ({
      numbers: prev.numbers.slice(0, sys),
      system: sys,
    }))
  }, [])

  const toggleTotoNum = useCallback((num) => {
    setSelected(prev => {
      const idx = prev.numbers.indexOf(num)
      let nums
      if (idx >= 0) {
        nums = prev.numbers.filter(n => n !== num)
      } else if (prev.numbers.length < prev.system) {
        nums = [...prev.numbers, num].sort((a, b) => a - b)
      } else {
        nums = prev.numbers
      }
      return { ...prev, numbers: nums }
    })
  }, [])

  // ── Quick pick ──
  const quickPick = useCallback(() => {
    switch (type) {
      case 'ssq': {
        const pool = Array.from({ length: 33 }, (_, i) => i + 1)
        const red = pool.sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b)
        const blue = Math.floor(Math.random() * 16) + 1
        setSelected({ red, blue })
        break
      }
      case 'dlt': {
        const fPool = Array.from({ length: 35 }, (_, i) => i + 1)
        const bPool = Array.from({ length: 12 }, (_, i) => i + 1)
        const front = fPool.sort(() => Math.random() - 0.5).slice(0, 5).sort((a, b) => a - b)
        const back = bPool.sort(() => Math.random() - 0.5).slice(0, 2).sort((a, b) => a - b)
        setSelected({ front, back })
        break
      }
      case 'fc3d': {
        const n3 = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
        setDirectInput(n3)
        setSelected(n3.split(''))
        break
      }
      case 'sg4d': {
        const n4 = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
        setDirectInput(n4)
        setSelected(n4.split(''))
        break
      }
      case 'toto': {
        const sys = selected.system || 6
        const pool = Array.from({ length: 49 }, (_, i) => i + 1)
        const nums = pool.sort(() => Math.random() - 0.5).slice(0, sys).sort((a, b) => a - b)
        setSelected(prev => ({ ...prev, numbers: nums }))
        break
      }
    }
  }, [type, selected.system])

  // ── Clear ──
  const clearSelection = useCallback(() => {
    switch (type) {
      case 'ssq':
        setSelected({ red: [], blue: null })
        break
      case 'dlt':
        setSelected({ front: [], back: [] })
        break
      case 'fc3d':
        setDirectInput('')
        setSelected(['', '', ''])
        break
      case 'sg4d':
        setDirectInput('')
        setSelected(['', '', '', ''])
        break
      case 'toto':
        setSelected(prev => ({ numbers: [], system: prev.system }))
        break
    }
  }, [type])

  // ── Draw ──
  const handleDraw = useCallback(async () => {
    setError('')

    if (!user) {
      setError('请先登录后使用彩票模拟器')
      return
    }

    if (userLevel === 'regular') {
      setShowUpgradeModal(true)
      return
    }

    if (userLevel === 'gold' && drawsRemaining <= 0) {
      setShowUpgradeModal(true)
      return
    }

    setDrawing(true)
    setResult(null)
    setAnimationKey(prev => prev + 1)

    try {
      let ticket_numbers = null
      switch (type) {
        case 'ssq':
          ticket_numbers = { red: selected.red, blue: selected.blue }
          break
        case 'dlt':
          ticket_numbers = { front: selected.front, back: selected.back }
          break
        case 'fc3d': {
          const v = selected.filter(d => d !== '').join('')
          if (v.length === 3) ticket_numbers = { digits: v }
          break
        }
        case 'sg4d': {
          const v = selected.filter(d => d !== '').join('')
          if (v.length === 4) ticket_numbers = { digits: v }
          break
        }
        case 'toto':
          ticket_numbers = { numbers: selected.numbers, systemSize: selected.system }
          break
      }

      const res = await fetch('/api/lottery/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lottery_type: type,
          ticket_numbers,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.needUpgrade) {
          setShowUpgradeModal(true)
        } else {
          setError(data.error || '摇奖失败')
        }
        return
      }

      setResult(data)
      setDrawsRemaining(data.draws_remaining)
      setUserLevel(data.level)
      await fetchUserStatus()
    } catch (e) {
      setError('网络错误，请稍后重试')
    } finally {
      setTimeout(() => setDrawing(false), 800)
    }
  }, [user, userLevel, drawsRemaining, type, selected, fetchUserStatus])

  // ── Check if selection is valid ──
  const canDraw = useCallback(() => true, [])

  // ── Render helpers ──

  const renderNumberGrid = (total, field, maxSelect, ballColor) => {
    const nums = Array.from({ length: total }, (_, i) => i + 1)
    const currentArr = selected[field] || []
    return (
      <div className="flex flex-wrap gap-1.5 justify-center">
        {nums.map(n => (
          <NumberBall
            key={n}
            num={n}
            selected={currentArr.includes(n)}
            color={currentArr.includes(n) ? ballColor : 'bg-white border border-gray-300 text-gray-700'}
            onClick={() => toggleNum(field, n, maxSelect)}
          />
        ))}
      </div>
    )
  }

  const renderSingleGrid = (total, field, ballColor) => {
    const nums = Array.from({ length: total }, (_, i) => i + 1)
    const current = selected[field]
    return (
      <div className="flex flex-wrap gap-1.5 justify-center">
        {nums.map(n => (
          <NumberBall
            key={n}
            num={n}
            selected={current === n}
            color={current === n ? ballColor : 'bg-white border border-gray-300 text-gray-700'}
            onClick={() => setSingle(field, n)}
          />
        ))}
      </div>
    )
  }

  const renderDigitGrid = (pos, label) => {
    const digits = Array.from({ length: 10 }, (_, i) => i)
    const current = Array.isArray(selected) ? selected[pos] : ''
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-[#b0a898] font-medium">{label}</span>
        <div className="flex flex-wrap gap-1 justify-center">
          {digits.map(d => (
            <NumberBall
              key={d}
              num={d}
              selected={current === String(d)}
              color={current === String(d) ? 'bg-[#b45309] text-white' : 'bg-white border border-gray-300 text-gray-700'}
              onClick={() => setDigit(pos, d)}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Render selection area ──
  const renderPicker = () => {
    switch (type) {
      case 'ssq':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#dc2626]">红球区（1-33 选6个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  已选 {selected.red?.length || 0}/6
                </span>
              </div>
              {renderNumberGrid(33, 'red', 6, 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white')}
            </div>
            <div className="border-t border-[#ece8e0] pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2563eb]">蓝球区（1-16 选1个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  {selected.blue ? `已选 ${selected.blue}` : '未选'}
                </span>
              </div>
              {renderSingleGrid(16, 'blue', 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white')}
            </div>
          </div>
        )

      case 'dlt':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#dc2626]">前区（1-35 选5个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  已选 {selected.front?.length || 0}/5
                </span>
              </div>
              {renderNumberGrid(35, 'front', 5, 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white')}
            </div>
            <div className="border-t border-[#ece8e0] pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2563eb]">后区（1-12 选2个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  已选 {selected.back?.length || 0}/2
                </span>
              </div>
              {renderNumberGrid(12, 'back', 2, 'bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white')}
            </div>
          </div>
        )

      case 'fc3d':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={3}
                value={directInput}
                onChange={e => handleDirectInput(e.target.value)}
                placeholder="直接输入3位数字"
                className="flex-1 px-3 py-2 text-center text-lg font-bold text-[#1c1917] border border-[#ece8e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
              />
              <span className="text-[10px] text-[#b0a898] whitespace-nowrap">
                直选
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {[0, 1, 2].map(pos => renderDigitGrid(pos, `第${pos + 1}位`))}
            </div>
            <details className="text-xs text-[#b0a898]">
              <summary className="cursor-pointer hover:text-[#b45309]">组选说明</summary>
              <div className="mt-2 space-y-1 text-[#666]">
                <p>• 组三：三位数中有两位相同（如 112），任意顺序</p>
                <p>• 组六：三位数各不相同（如 123），任意顺序</p>
                <p>• 直选：顺序完全一致</p>
              </div>
            </details>
          </div>
        )

      case 'sg4d':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={directInput}
                onChange={e => handleDirectInput(e.target.value)}
                placeholder="直接输入4位数字"
                className="flex-1 px-3 py-2 text-center text-lg font-bold text-[#1c1917] border border-[#ece8e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
              />
              <span className="text-[10px] text-[#b0a898] whitespace-nowrap">
                iBet
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {[0, 1, 2, 3].map(pos => renderDigitGrid(pos, `第${pos + 1}位`))}
            </div>
            <div className="bg-[#faf8f5] rounded-lg p-3 text-xs text-[#666]">
              <p className="font-medium text-[#b45309] mb-1">🎯 iBet 选项</p>
              <p>iBet 包含所有排列组合，任意顺序匹配即可获奖，奖金为标准奖金 ÷ 排列数</p>
            </div>
          </div>
        )

      case 'toto':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#1c1917]">System</span>
              <select
                value={selected.system || 6}
                onChange={e => setTotoSystem(e.target.value)}
                className="px-3 py-1.5 text-sm border border-[#ece8e0] rounded-lg bg-white text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
              >
                {[6, 7, 8, 9, 10, 11, 12].map(s => (
                  <option key={s} value={s}>
                    {s === 6 ? '普通 (6个)' : `System ${s} (${s}个)`}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[#b0a898]">
                已选 {selected.numbers?.length || 0}/{selected.system || 6}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#dc2626] mb-2 block">
                号码区（1-49 选{selected.system || 6}个）
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {Array.from({ length: 49 }, (_, i) => i + 1).map(n => (
                  <NumberBall
                    key={n}
                    num={n}
                    selected={selected.numbers?.includes(n)}
                    color={selected.numbers?.includes(n) ? 'bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white' : 'bg-white border border-gray-300 text-gray-700'}
                    onClick={() => toggleTotoNum(n)}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return <p className="text-xs text-red-500">未知彩票类型</p>
    }
  }

  // ── Render selection summary ──
  const renderSelectionSummary = () => {
    switch (type) {
      case 'ssq': {
        const r = selected.red || []
        const b = selected.blue
        if (!r.length && !b) return null
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            {r.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white text-[10px] font-bold shadow-sm">{n}</span>
            ))}
            {b && (
              <>
                <span className="text-[#b0a898] text-sm font-bold">+</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white text-[10px] font-bold shadow-sm">{b}</span>
              </>
            )}
          </div>
        )
      }
      case 'dlt': {
        const f = selected.front || []
        const b = selected.back || []
        if (!f.length && !b.length) return null
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            {f.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white text-[10px] font-bold shadow-sm">{n}</span>
            ))}
            <span className="text-[#b0a898] text-sm font-bold">+</span>
            {b.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white text-[10px] font-bold shadow-sm">{n}</span>
            ))}
          </div>
        )
      }
      case 'fc3d': {
        const v = Array.isArray(selected) ? selected.filter(d => d !== '').join('') : ''
        if (!v) return null
        return (
          <div className="flex items-center gap-1.5 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            <span className="inline-flex items-center gap-1">
              {v.split('').map((d, i) => (
                <span key={i} className="inline-flex items-center justify-center w-7 h-8 rounded-lg bg-gradient-to-b from-[#b45309] to-[#d97706] text-white text-xs font-bold shadow-sm">{d}</span>
              ))}
            </span>
          </div>
        )
      }
      case 'sg4d': {
        const v = Array.isArray(selected) ? selected.filter(d => d !== '').join('') : ''
        if (!v) return null
        return (
          <div className="flex items-center gap-1.5 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            <span className="inline-flex items-center gap-1">
              {v.split('').map((d, i) => (
                <span key={i} className="inline-flex items-center justify-center w-7 h-8 rounded-lg bg-gradient-to-b from-[#7c3aed] to-[#6d28d9] text-white text-xs font-bold shadow-sm">{d}</span>
              ))}
            </span>
          </div>
        )
      }
      case 'toto': {
        const n = selected.numbers || []
        if (!n.length) return null
        return (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            {n.map(num => (
              <span key={num} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white text-[10px] font-bold shadow-sm">{num}</span>
            ))}
          </div>
        )
      }
      default:
        return null
    }
  }

  // ── Render result ──
  const renderResult = () => {
    if (!result || !result.numbers) return null

    const nums = result.numbers
    const levLabel = userLevel === 'diamond' ? '钻石会员' : userLevel === 'gold' ? '黄金会员' : '普通用户'
    const remainingLabel = drawsRemaining === 99999 ? '∞' : drawsRemaining

    return (
      <div className="bg-white border border-[#ece8e0] rounded-xl p-5 shadow-sm mb-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#b45309]" />
            <h3 className="text-sm font-bold text-[#1c1917]">🎉 开奖结果</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#b0a898]">
            <span className="flex items-center gap-1">
              {userLevel === 'diamond' ? (
                <Crown className="w-3 h-3 text-purple-500" />
              ) : userLevel === 'gold' ? (
                <Star className="w-3 h-3 text-[#b45309]" />
              ) : (
                <User className="w-3 h-3" />
              )}
              {levLabel}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#b45309]" />
              剩余 {remainingLabel} 次
            </span>
          </div>
        </div>

        {/* ── Large result balls with animation ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-6" key={animationKey}>
          {/* SSQ: 6 red + 1 blue */}
          {type === 'ssq' && (
            <>
              {nums.red?.map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ResultBall num={n} color={config.ballColors.primary} size="xl" />
                </span>
              ))}
              <span className="text-[#b0a898] text-2xl font-bold px-2">+</span>
              <span className="anim-bounce-in" style={{ animationDelay: '0.65s' }}>
                <ResultBall num={nums.blue} color={config.ballColors.secondary} size="xl" />
              </span>
            </>
          )}

          {/* DLT: 5 front red + 2 back blue */}
          {type === 'dlt' && (
            <>
              {nums.front?.map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ResultBall num={n} color={config.ballColors.primary} size="xl" />
                </span>
              ))}
              <span className="text-[#b0a898] text-2xl font-bold px-2">+</span>
              {nums.back?.map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${0.55 + i * 0.1}s` }}>
                  <ResultBall num={n} color={config.ballColors.secondary} size="xl" />
                </span>
              ))}
            </>
          )}

          {/* fc3d / sg4d: block digits */}
          {(type === 'fc3d' || type === 'sg4d') && (
            <div className="flex gap-3">
              {String(nums).split('').map((c, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.12}s` }}>
                  <ResultBall num={c} type="digit" />
                </span>
              ))}
            </div>
          )}

          {/* TOTO: 6 balls */}
          {type === 'toto' && (
            <>
              {(Array.isArray(nums) ? nums : []).map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ResultBall num={n} color={config.ballColors.primary} size="xl" />
                </span>
              ))}
            </>
          )}
        </div>

        {/* Time */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-[#b0a898] mt-2">
          <span>🕐</span>
          <span>开奖时间：{result.time ? formatDrawTime(result.time) : new Date().toLocaleString('zh-CN')}</span>
        </div>
      </div>
    )
  }

  // ── Render history ──
  const renderHistory = () => {
    if (!history || history.length === 0) return null

    const renderHistoryNumbers = (rec) => {
      const n = rec.numbers
      if (!n) return <span className="text-[#b0a898]">-</span>

      switch (rec.lottery_type) {
        case 'ssq':
          return (
            <span className="flex items-center gap-1">
              {n.red?.map(r => (
                <MiniResultBall key={r} num={r} color="bg-[#dc2626]" />
              ))}
              <span className="text-[#b0a898] text-xs font-bold">+</span>
              <MiniResultBall num={n.blue} color="bg-[#2563eb]" />
            </span>
          )
        case 'dlt':
          return (
            <span className="flex items-center gap-1">
              {n.front?.map(r => (
                <MiniResultBall key={r} num={r} color="bg-[#dc2626]" />
              ))}
              <span className="text-[#b0a898] text-xs font-bold">+</span>
              {n.back?.map(r => (
                <MiniResultBall key={r} num={r} color="bg-[#2563eb]" />
              ))}
            </span>
          )
        case 'fc3d':
        case 'sg4d':
          return (
            <span className="inline-flex items-center gap-1">
              {String(n).split('').map((c, i) => (
                <span key={i} className="inline-flex items-center justify-center w-5 h-6 rounded bg-gradient-to-b from-[#b45309] to-[#d97706] text-white text-[10px] font-bold">{c}</span>
              ))}
            </span>
          )
        case 'toto':
          return (
            <span className="flex items-center gap-1">
              {(Array.isArray(n) ? n : []).map(r => (
                <MiniResultBall key={r} num={r} color="bg-[#dc2626]" />
              ))}
            </span>
          )
        default:
          return <span className="text-[#b0a898] text-xs">{JSON.stringify(n)}</span>
      }
    }

    return (
      <div className="bg-white border border-[#ece8e0] rounded-xl p-5 shadow-sm mb-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-[#b0a898]" />
          <h3 className="text-sm font-bold text-[#1c1917]">最近开奖记录</h3>
          <span className="text-[10px] text-[#b0a898] ml-auto">最近 {Math.min(history.length, 10)} 次</span>
        </div>
        <div className="space-y-2">
          {history.slice(0, 10).map((rec, i) => (
            <div
              key={rec.id || i}
              className="flex items-center gap-3 px-3 py-2 bg-[#faf8f5] rounded-lg text-xs"
            >
              <span className="text-base">{config?.emoji || '🎰'}</span>
              <div className="flex-1">
                {renderHistoryNumbers(rec)}
              </div>
              <span className="text-[#b0a898] whitespace-nowrap text-[10px]">
                {formatDrawTime(rec.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Upgrade modal ──
  const upgradeModal = (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      transition: 'all 0.2s',
      opacity: showUpgradeModal ? 1 : 0,
      pointerEvents: showUpgradeModal ? 'auto' : 'none',
    }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fafaf9' }}
        onClick={() => setShowUpgradeModal(false)}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5 pt-2">
          <div className="text-5xl mb-3">🎯</div>
          <h3 className="text-base font-bold text-[#1c1917] mb-1">免费用户无法摇奖</h3>
          <p className="text-xs text-[#666] leading-relaxed">
            需要升级到黄金会员或钻石会员才能使用彩票模拟器
          </p>
        </div>

        {/* Gold */}
        <div className="space-y-3 mb-5">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-[#b45309]" />
              <span className="font-bold text-sm text-[#1c1917]">黄金会员</span>
              <span className="text-[#b45309] font-bold text-sm ml-auto">¥9.9</span>
            </div>
            <p className="text-xs text-[#666] pl-6">500次摇奖机会</p>
          </div>

          {/* Diamond */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-sm text-[#1c1917]">钻石会员</span>
              <span className="text-purple-600 font-bold text-sm ml-auto">¥99</span>
            </div>
            <p className="text-xs text-[#666] pl-6">无限次摇奖机会</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2.5 mb-4">
          <button
            onClick={() => { setShowUpgradeModal(false); setTimeout(() => setShowDonateInfo(true), 200) }}
            className="w-full py-3 bg-gradient-to-r from-[#b45309] to-[#d97706] text-white text-sm font-bold rounded-xl hover:from-[#a04407] hover:to-[#c06806] transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            打赏升级
          </button>
          <button
            onClick={() => { setShowUpgradeModal(false); setTimeout(() => setShowContactInfo(true), 200) }}
            className="w-full py-3 bg-white border-2 border-[#ece8e0] text-[#1c1917] text-sm font-bold rounded-xl hover:border-[#b45309] hover:text-[#b45309] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            联系管理员升级
          </button>
        </div>

        <Link
          href="/lottery/upgrade"
          className="block text-center text-xs text-[#b0a898] hover:text-[#b45309] transition-colors"
        >
          了解会员权益详情 →
        </Link>
      </div>
    </div>
  )

  // ── Donate info modal ──
  const [showDonateQR, setShowDonateQR] = useState('') // 'wechat' | 'alipay' | 'paynow'

  const donateInfoModal = (
    <>
      {/* 打赏主弹窗 */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        transition: 'all 0.2s',
        opacity: showDonateInfo ? 1 : 0,
        pointerEvents: showDonateInfo ? 'auto' : 'none',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fafaf9' }} onClick={() => { setShowDonateInfo(false); setShowDonateQR('') }} />
        <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem' }}>
          <button
            onClick={() => { setShowDonateInfo(false); setShowDonateQR('') }}
            className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center mb-5 pt-2">
            <div className="text-5xl mb-3">☕</div>
            <h3 className="text-base font-bold text-[#1c1917] mb-1">打赏升级</h3>
            <p className="text-xs text-[#666] leading-relaxed">
              黄金 ¥9.9 / 钻石 ¥99，打赏后联系管理员升级
            </p>
          </div>

          <div className="space-y-3 mb-4">
            {/* 微信 */}
            <button
              onClick={() => { setShowDonateInfo(false); setTimeout(() => setShowDonateQR('wechat'), 200) }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#eee8dc] hover:border-[#07c160] hover:bg-[#f0faf0] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#07c160] flex items-center justify-center text-xl shrink-0">💚</div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#1c1917]">微信</div>
                <div className="text-xs text-[#999]">扫描二维码支付</div>
              </div>
              <span className="text-green-500 text-sm font-bold">→</span>
            </button>

            {/* 支付宝 */}
            <button
              onClick={() => { setShowDonateInfo(false); setTimeout(() => setShowDonateQR('alipay'), 200) }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#eee8dc] hover:border-[#1677ff] hover:bg-[#f0f7ff] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#1677ff] flex items-center justify-center text-xl shrink-0">💰</div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#1c1917]">支付宝</div>
                <div className="text-xs text-[#999]">扫描二维码支付</div>
              </div>
              <span className="text-blue-500 text-sm font-bold">→</span>
            </button>

            {/* PayNow */}
            <button
              onClick={() => { setShowDonateInfo(false); setTimeout(() => setShowDonateQR('paynow'), 200) }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#eee8dc] hover:border-[#16a34a] hover:bg-[#f0fdf0] transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#16a34a] flex items-center justify-center text-xl shrink-0">🇸🇬</div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#1c1917]">PayNow</div>
                <div className="text-xs text-[#999]">扫描二维码支付</div>
              </div>
              <span className="text-green-600 text-sm font-bold">→</span>
            </button>
          </div>

          <button
            onClick={() => { setShowDonateInfo(false); setTimeout(() => setShowContactInfo(true), 200) }}
            className="text-xs text-[#b45309] hover:underline block mx-auto"
          >
            打赏后点此联系管理员 →
          </button>
        </div>
      </div>

      {/* 微信二维码弹窗 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99997,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        transition: 'all 0.2s',
        opacity: showDonateQR === 'wechat' ? 1 : 0,
        pointerEvents: showDonateQR === 'wechat' ? 'auto' : 'none',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fafaf9' }} onClick={() => setShowDonateQR('')} />
        <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowDonateQR('')}
            className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-lg font-bold text-[#1c1917] mb-1 mt-2">💚 微信</div>
          <p className="text-xs text-[#999] mb-4">打开微信扫描二维码支付</p>
          <img src="/images/wechat-pay-qr.jpg" alt="微信收款码" className="w-full max-w-[15rem] mx-auto rounded-xl border border-[#eee8dc]" />
          <p className="text-[10px] text-[#ccc] mt-3">截图保存到相册，在微信中扫码</p>
        </div>
      </div>

      {/* 支付宝二维码弹窗 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99997,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        transition: 'all 0.2s',
        opacity: showDonateQR === 'alipay' ? 1 : 0,
        pointerEvents: showDonateQR === 'alipay' ? 'auto' : 'none',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fafaf9' }} onClick={() => setShowDonateQR('')} />
        <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowDonateQR('')}
            className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-lg font-bold text-[#1c1917] mb-1 mt-2">💰 支付宝</div>
          <p className="text-xs text-[#999] mb-4">打开支付宝扫描二维码支付</p>
          <img src="/images/alipay.jpg" alt="支付宝收款码" className="w-full max-w-[15rem] mx-auto rounded-xl border border-[#eee8dc]" />
          <p className="text-[10px] text-[#ccc] mt-3">截图保存到相册，在支付宝中扫码</p>
        </div>
      </div>

      {/* PayNow 二维码弹窗 */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 99997,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        transition: 'all 0.2s',
        opacity: showDonateQR === 'paynow' ? 1 : 0,
        pointerEvents: showDonateQR === 'paynow' ? 'auto' : 'none',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fafaf9' }} onClick={() => setShowDonateQR('')} />
        <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowDonateQR('')}
            className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-lg font-bold text-[#1c1917] mb-1 mt-2">🇸🇬 PayNow</div>
          <p className="text-xs text-[#999] mb-4">打开银行 App 扫描二维码支付</p>
          <img src="/images/paynow-qr.jpg" alt="PayNow 收款码" className="w-full max-w-[15rem] mx-auto rounded-xl border border-[#eee8dc]" />
          <p className="text-[10px] text-[#ccc] mt-3">截图保存到相册，在银行 App 中扫码</p>
        </div>
      </div>
    </>
  )

  // ── Contact info modal ──
  const contactInfoModal = (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 99996,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      transition: 'all 0.2s',
      opacity: showContactInfo ? 1 : 0,
      pointerEvents: showContactInfo ? 'auto' : 'none',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fafaf9' }} onClick={() => setShowContactInfo(false)} />
      <div style={{ position: 'relative', backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '24rem', width: '100%', padding: '1.5rem' }}>
        <button
          onClick={() => setShowContactInfo(false)}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: '#b0a898', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5 pt-2">
          <div className="text-5xl mb-3">📞</div>
          <h3 className="text-base font-bold text-[#1c1917] mb-1">联系管理员</h3>
          <p className="text-xs text-[#666] leading-relaxed">
            打赏后联系管理员，立即为您升级
          </p>
        </div>

        <div className="space-y-3 mb-4">
          {/* 微信 — 微信号: crazy-repair */}
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="font-bold text-sm text-[#1c1917]">微信</span>
            </div>
            <p className="text-[10px] text-[#999] mb-1">点击复制微信号，打开微信 → 添加朋友 → 粘贴搜索</p>
            <div className="flex items-center justify-between bg-[#f9f9f9] rounded-lg px-3 py-2">
              <span className="text-sm text-[#555]">crazy-repair</span>
              <button
                onClick={() => { navigator.clipboard.writeText('crazy-repair'); setCopied('contact-wechat'); setTimeout(() => setCopied(''), 2000) }}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${copied === 'contact-wechat' ? 'bg-green-50 text-green-600' : 'bg-[#f5f5f5] text-[#888] hover:bg-[#eee]'}`}
              >
                <Copy className="w-3 h-3" />
                {copied === 'contact-wechat' ? '已复制' : '复制'}
              </button>
            </div>
          </div>

          {/* QQ邮箱 */}
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-4 flex items-center justify-center">📧</span>
              <span className="font-bold text-sm text-[#1c1917]">QQ邮箱</span>
            </div>
            <div className="flex items-center justify-between bg-[#f9f9f9] rounded-lg px-3 py-2 mt-1">
              <span className="text-sm text-[#555]">994730969@qq.com</span>
              <button
                onClick={() => { navigator.clipboard.writeText('994730969@qq.com'); setCopied('contact-qq'); setTimeout(() => setCopied(''), 2000) }}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${copied === 'contact-qq' ? 'bg-green-50 text-green-600' : 'bg-[#f5f5f5] text-[#888] hover:bg-[#eee]'}`}
              >
                <Copy className="w-3 h-3" />
                {copied === 'contact-qq' ? '已复制' : '复制'}
              </button>
            </div>
          </div>

          {/* 谷歌邮箱 */}
          <div className="bg-white border border-[#ece8e0] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-4 flex items-center justify-center">📧</span>
              <span className="font-bold text-sm text-[#1c1917]">谷歌邮箱</span>
            </div>
            <div className="flex items-center justify-between bg-[#f9f9f9] rounded-lg px-3 py-2 mt-1">
              <span className="text-sm text-[#555]">yuhaohao13@gmail.com</span>
              <button
                onClick={() => { navigator.clipboard.writeText('yuhaohao13@gmail.com'); setCopied('contact-gmail'); setTimeout(() => setCopied(''), 2000) }}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${copied === 'contact-gmail' ? 'bg-green-50 text-green-600' : 'bg-[#f5f5f5] text-[#888] hover:bg-[#eee]'}`}
              >
                <Copy className="w-3 h-3" />
                {copied === 'contact-gmail' ? '已复制' : '复制'}
              </button>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-[#b0a898] text-center">
          打赏后直接联系管理员，核实后立即升级
        </p>
      </div>
    </div>
  )

  // ── Redirect if invalid type ──
  if (!type || !TYPE_CONFIG[type]) {
    return (
      <div className="max-w-3xl mx-auto pb-12 p-4 text-center">
        <p className="text-[#b0a898] text-sm">未知彩票类型</p>
        <Link href="/lottery" className="text-[#b45309] hover:underline text-sm mt-2 inline-block">
          ← 返回彩票列表
        </Link>
      </div>
    )
  }

  // ── Main render ──
  const levIcon = userLevel === 'diamond' ? <Crown className="w-3 h-3 text-purple-500" />
    : userLevel === 'gold' ? <Star className="w-3 h-3 text-[#b45309]" />
    : <User className="w-3 h-3 text-[#b0a898]" />
  const levLabel = userLevel === 'diamond' ? '钻石会员' : userLevel === 'gold' ? '黄金会员' : '普通用户'
  const remainingLabel = drawsRemaining === 99999 ? '∞' : drawsRemaining

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      {/* ─── Breadcrumb ─── */}
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '🎰 彩票模拟器', href: '/lottery' },
        { label: config.name },
      ]} className="mb-3" />

      {/* ─── Back button ─── */}
      <Link
        href="/lottery"
        className="inline-flex items-center gap-1 text-xs text-[#b0a898] hover:text-[#b45309] transition-colors mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        返回彩票列表
      </Link>

      {/* ─── Type header ─── */}
      <div className={`bg-gradient-to-r ${config.color} rounded-xl p-5 shadow-sm mb-5 text-white`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <h1 className="text-lg font-bold">{config.name}</h1>
            <p className="text-[11px] text-white/80">{config.rule}</p>
          </div>
        </div>
        {/* Member status */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
          {isAuthLoaded && !user ? (
            <Link
              href={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-[11px] text-white hover:bg-white/30 transition-colors"
            >
              <User className="w-3 h-3" />
              登录后摇奖
            </Link>
          ) : (
            <>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-[11px]">
                {levIcon}
                <span className="font-medium">{levLabel}</span>
              </span>
              <span className="text-[11px] text-white/80">
                <Zap className="w-3 h-3 inline mr-0.5" />
                剩余 {remainingLabel} 次
              </span>
            </>
          )}
        </div>
      </div>

      {/* ─── Selection card ─── */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4 sm:p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1c1917]">
            {config.emoji} {config.name} 选号
          </h2>
          <div className="flex gap-2">
            <button
              onClick={quickPick}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium text-[#b45309] bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              机选
            </button>
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium text-[#666] bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              清空
            </button>
          </div>
        </div>

        {renderPicker()}

        {/* Selection summary */}
        {renderSelectionSummary()}
      </div>

      {/* ─── Draw button ─── */}
      <button
        onClick={handleDraw}
        disabled={drawing || !isAuthLoaded}
        className={"w-full py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-sm flex items-center justify-center gap-2 " + (
          drawing || !isAuthLoaded
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : userLevel === "regular"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-md active:scale-[0.98]"
              : "bg-gradient-to-r " + config.color + " text-white hover:brightness-110 hover:shadow-md active:scale-[0.98]"
        )}
      >
        {drawing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            摇奖中...
          </>
        ) : userLevel === "regular" ? (
          <>
            <Star className="w-4 h-4" />
            💎 升级会员摇奖
          </>
        ) : (
          <>
            <span className="text-lg">🎰</span>
            开始摇奖
          </>
        )}
      </button>

      {/* ── Error message ── */}
      {error && (
        <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
          {!user && (
            <Link href="/login" className="ml-auto font-medium text-red-700 hover:underline">
              去登录
            </Link>
          )}
        </div>
      )}

      {/* ─── Result area ─── */}
      {result && renderResult()}

      {/* ─── History (current type only) ─── */}
      {renderHistory()}

      {/* ─── Upgrade modal ─── */}
      {upgradeModal}
      {donateInfoModal}
      {contactInfoModal}

      {/* ─── Keyframe animations ─── */}
      <style jsx>{`
        @keyframes ballBounceIn {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(3deg); }
          70% { transform: scale(0.92); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .anim-bounce-in {
          display: inline-flex;
          animation: ballBounceIn 0.45s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
