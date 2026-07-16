'use client'

import { useState, useEffect, useCallback } from 'react'
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
  ChevronDown
} from 'lucide-react'

// ─── Lottery type config ───────────────────────────────────────
const LOTTERY_TYPES = [
  { id: 'ssq', label: '双色球', emoji: '🟢', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'dlt', label: '大乐透', emoji: '🔵', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'fc3d', label: '3D',    emoji: '🟡', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'sg4d', label: '4D',    emoji: '🟣', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'toto', label: 'TOTO',  emoji: '🔴', color: 'bg-red-100 text-red-800 border-red-300' },
]

const PRIZE_TABLE = {
  ssq: [
    { level: '一等奖', match: '6红 + 1蓝', prize: '约¥500万+' },
    { level: '二等奖', match: '6红', prize: '约¥10万+' },
    { level: '三等奖', match: '5红 + 1蓝', prize: '¥3,000' },
    { level: '四等奖', match: '5红 或 4红+1蓝', prize: '¥200' },
    { level: '五等奖', match: '4红 或 3红+1蓝', prize: '¥10' },
    { level: '六等奖', match: '1蓝', prize: '¥5' },
  ],
  dlt: [
    { level: '一等奖', match: '5+2', prize: '约¥1000万+' },
    { level: '二等奖', match: '5+1', prize: '约¥10万+' },
    { level: '三等奖', match: '5+0', prize: '¥10,000' },
    { level: '四等奖', match: '4+2', prize: '¥3,000' },
    { level: '五等奖', match: '4+1', prize: '¥300' },
    { level: '六等奖', match: '3+2', prize: '¥200' },
    { level: '七等奖', match: '4+0', prize: '¥100' },
    { level: '八等奖', match: '3+1 或 2+2', prize: '¥15' },
    { level: '九等奖', match: '任意其他', prize: '¥5' },
  ],
  fc3d: [
    { level: '直选', match: '顺序完全一致', prize: '¥1,040' },
    { level: '组三', match: '两同号任意顺序', prize: '¥346' },
    { level: '组六', match: '三不同号任意顺序', prize: '¥173' },
  ],
  sg4d: [
    { level: '一等奖', match: '完全匹配', prize: '¥2,000' },
    { level: '二等奖', match: '后3位匹配', prize: '¥500' },
    { level: '三等奖', match: '后3位匹配', prize: '¥250' },
    { level: '入围奖', match: '后2位匹配', prize: '¥10' },
  ],
  toto: [
    { level: '一等奖', match: '6个全中', prize: '累积奖金池' },
    { level: '二等奖', match: '5个+额外号', prize: '固定奖金' },
    { level: '三等奖', match: '5个', prize: '¥800' },
    { level: '四等奖', match: '4个', prize: '¥50' },
    { level: '五等奖', match: '3个', prize: '¥10' },
    { level: '六等奖', match: '2个+额外号', prize: '¥5' },
  ],
}

// ─── Format helpers ────────────────────────────────────────────
function formatDrawTime(iso) {
  try {
    const d = new Date(iso)
    const pad = n => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return iso
  }
}

function formatResultDisplay(type, numbers) {
  if (!numbers) return ''
  switch (type) {
    case 'ssq':
      return `${numbers.red?.join(', ') || ''} + ${numbers.blue || ''}`
    case 'dlt':
      return `${numbers.front?.join(', ') || ''} + ${numbers.back?.join(', ') || ''}`
    case 'fc3d':
    case 'sg4d':
      return String(numbers)
    case 'toto':
      return Array.isArray(numbers) ? numbers.join(', ') : String(numbers)
    default:
      return JSON.stringify(numbers)
  }
}

// ─── Number ball component ─────────────────────────────────────
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

// ─── Big result ball ───────────────────────────────────────────
function ResultBall({ num, color, size = 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-10 h-10 text-lg' : 'w-9 h-9 text-sm'
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold text-white ${sizeClass} ${color} shadow-sm`}>
      {String(num).padStart(2, '0')}
    </span>
  )
}

// ─── Main Page ─────────────────────────────────────────────────
export default function LotteryPage() {
  const supabase = createClient()

  // ── State ──
  const [activeType, setActiveType] = useState('ssq')
  const [selected, setSelected] = useState({
    ssq: { red: [], blue: null },
    dlt: { front: [], back: [] },
    fc3d: ['', '', ''],
    sg4d: ['', '', '', ''],
    toto: { numbers: [], system: 6 },
  })
  const [fc3dInput, setFc3dInput] = useState('')
  const [sg4dInput, setSg4dInput] = useState('')
  const [result, setResult] = useState(null)
  const [userLevel, setUserLevel] = useState('regular')
  const [drawsRemaining, setDrawsRemaining] = useState(0)
  const [loading, setLoading] = useState(false)
  const [drawing, setDrawing] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPrizeModal, setShowPrizeModal] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [isAuthLoaded, setIsAuthLoaded] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  // ── Init ──
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
      setHistory(data.records || [])
    } catch {
      // silent
    }
  }, [])

  // ── Generic num toggle ──
  const toggleNum = useCallback((type, field, num, maxSelect) => {
    setSelected(prev => {
      const cur = { ...prev }
      const arr = [...(cur[type]?.[field] || [])]
      const idx = arr.indexOf(num)
      if (idx >= 0) {
        arr.splice(idx, 1)
      } else if (arr.length < maxSelect) {
        arr.push(num)
        arr.sort((a, b) => a - b)
      }
      cur[type] = { ...cur[type], [field]: arr }
      return cur
    })
  }, [])

  // ── Toggle single (for blue / back) ──
  const setSingle = useCallback((type, field, num) => {
    setSelected(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: num },
    }))
  }, [])

  // ── Toggle digit (for 3D/4D) ──
  const setDigit = useCallback((type, pos, num) => {
    setSelected(prev => {
      const cur = { ...prev }
      const arr = [...cur[type]]
      arr[pos] = String(num)
      cur[type] = arr
      return cur
    })
  }, [])

  // ── 3D/4D direct input ──
  const handleFc3dInput = useCallback((val) => {
    const clean = val.replace(/\D/g, '').slice(0, 3)
    setFc3dInput(clean)
    const arr = clean.padEnd(3, ' ').split('').slice(0, 3)
    setSelected(prev => ({ ...prev, fc3d: arr.map(c => c === ' ' ? '' : c) }))
  }, [])

  const handleSg4dInput = useCallback((val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    setSg4dInput(clean)
    const arr = clean.padEnd(4, ' ').split('').slice(0, 4)
    setSelected(prev => ({ ...prev, sg4d: arr.map(c => c === ' ' ? '' : c) }))
  }, [])

  // ── TOTO system ──
  const setTotoSystem = useCallback((val) => {
    const sys = parseInt(val) || 6
    setSelected(prev => ({
      ...prev,
      toto: { numbers: prev.toto.numbers.slice(0, sys), system: sys }
    }))
  }, [])

  const toggleTotoNum = useCallback((num) => {
    setSelected(prev => {
      const cur = { ...prev.toto }
      const idx = cur.numbers.indexOf(num)
      if (idx >= 0) {
        cur.numbers = cur.numbers.filter(n => n !== num)
      } else if (cur.numbers.length < cur.system) {
        cur.numbers = [...cur.numbers, num].sort((a, b) => a - b)
      }
      return { ...prev, toto: cur }
    })
  }, [])

  // ── Quick pick ──
  const quickPick = useCallback(() => {
    switch (activeType) {
      case 'ssq': {
        const pool = Array.from({ length: 33 }, (_, i) => i + 1)
        const red = pool.sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b)
        const blue = Math.floor(Math.random() * 16) + 1
        setSelected(prev => ({ ...prev, ssq: { red, blue } }))
        break
      }
      case 'dlt': {
        const fPool = Array.from({ length: 35 }, (_, i) => i + 1)
        const bPool = Array.from({ length: 12 }, (_, i) => i + 1)
        const front = fPool.sort(() => Math.random() - 0.5).slice(0, 5).sort((a, b) => a - b)
        const back = bPool.sort(() => Math.random() - 0.5).slice(0, 2).sort((a, b) => a - b)
        setSelected(prev => ({ ...prev, dlt: { front, back } }))
        break
      }
      case 'fc3d': {
        const n3 = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
        setFc3dInput(n3)
        setSelected(prev => ({ ...prev, fc3d: n3.split('') }))
        break
      }
      case 'sg4d': {
        const n4 = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
        setSg4dInput(n4)
        setSelected(prev => ({ ...prev, sg4d: n4.split('') }))
        break
      }
      case 'toto': {
        const sys = selected.toto.system || 6
        const pool = Array.from({ length: 49 }, (_, i) => i + 1)
        const nums = pool.sort(() => Math.random() - 0.5).slice(0, sys).sort((a, b) => a - b)
        setSelected(prev => ({ ...prev, toto: { numbers: nums, system: sys } }))
        break
      }
    }
  }, [activeType, selected.toto.system])

  // ── Clear ──
  const clearSelection = useCallback(() => {
    switch (activeType) {
      case 'ssq':
        setSelected(prev => ({ ...prev, ssq: { red: [], blue: null } }))
        break
      case 'dlt':
        setSelected(prev => ({ ...prev, dlt: { front: [], back: [] } }))
        break
      case 'fc3d':
        setFc3dInput('')
        setSelected(prev => ({ ...prev, fc3d: ['', '', ''] }))
        break
      case 'sg4d':
        setSg4dInput('')
        setSelected(prev => ({ ...prev, sg4d: ['', '', '', ''] }))
        break
      case 'toto':
        setSelected(prev => ({ ...prev, toto: { numbers: [], system: prev.toto.system } }))
        break
    }
  }, [activeType])

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
      // Build ticket_numbers payload
      let ticket_numbers = null
      switch (activeType) {
        case 'ssq':
          ticket_numbers = { red: selected.ssq.red, blue: selected.ssq.blue }
          break
        case 'dlt':
          ticket_numbers = { front: selected.dlt.front, back: selected.dlt.back }
          break
        case 'fc3d': {
          const v = selected.fc3d.filter(d => d !== '').join('')
          if (v.length === 3) ticket_numbers = { digits: v }
          break
        }
        case 'sg4d': {
          const v = selected.sg4d.filter(d => d !== '').join('')
          if (v.length === 4) ticket_numbers = { digits: v }
          break
        }
        case 'toto':
          ticket_numbers = { numbers: selected.toto.numbers, systemSize: selected.toto.system }
          break
      }

      const res = await fetch('/api/lottery/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lottery_type: activeType,
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
  }, [user, userLevel, drawsRemaining, activeType, selected, fetchUserStatus])

  // ── Render helpers ──

  const renderNumberGrid = (total, field, maxSelect, ballColor) => {
    if (!ballColor) ballColor = 'bg-[#dc2626] text-white'
    const nums = Array.from({ length: total }, (_, i) => i + 1)
    const currentArr = selected[activeType]?.[field] || []
    return (
      <div className="flex flex-wrap gap-1.5 justify-center">
        {nums.map(n => (
          <NumberBall
            key={n}
            num={n}
            selected={currentArr.includes(n)}
            color={currentArr.includes(n) ? ballColor : 'bg-white border border-gray-300 text-gray-700'}
            onClick={() => toggleNum(activeType, field, n, maxSelect)}
          />
        ))}
      </div>
    )
  }

  const renderSingleGrid = (total, field, ballColor) => {
    const nums = Array.from({ length: total }, (_, i) => i + 1)
    const current = selected[activeType]?.[field]
    return (
      <div className="flex flex-wrap gap-1.5 justify-center">
        {nums.map(n => (
          <NumberBall
            key={n}
            num={n}
            selected={current === n}
            color={current === n ? ballColor : 'bg-white border border-gray-300 text-gray-700'}
            onClick={() => setSingle(activeType, field, n)}
          />
        ))}
      </div>
    )
  }

  const renderDigitGrid = (type, pos, label) => {
    const digits = Array.from({ length: 10 }, (_, i) => i)
    const current = selected[type]?.[pos] ?? ''
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
              onClick={() => setDigit(type, pos, d)}
            />
          ))}
        </div>
      </div>
    )
  }

  // ── Render result ──
  const renderResult = () => {
    if (!result || !result.numbers) return null

    const nums = result.numbers
    const lev = userLevel === 'diamond' ? '钻石' : userLevel === 'gold' ? '黄金' : '普通'

    return (
      <div className="bg-white border border-[#ece8e0] rounded-xl p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#b45309]" />
            <h3 className="text-sm font-bold text-[#1c1917]">开奖结果</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#b0a898]">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-[#b45309]" />
              {lev}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#b45309]" />
              剩余 {drawsRemaining === 99999 ? '∞' : drawsRemaining} 次
            </span>
          </div>
        </div>

        {/* ── Animated result balls ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-4" key={animationKey}>
          {activeType === 'ssq' && (
            <>
              {nums.red?.map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ResultBall num={n} color="bg-[#dc2626]" />
                </span>
              ))}
              <span className="text-[#b0a898] text-lg font-bold px-1">+</span>
              <span className="anim-bounce-in" style={{ animationDelay: '0.6s' }}>
                <ResultBall num={nums.blue} color="bg-[#2563eb]" />
              </span>
            </>
          )}
          {activeType === 'dlt' && (
            <>
              {nums.front?.map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ResultBall num={n} color="bg-[#dc2626]" />
                </span>
              ))}
              <span className="text-[#b0a898] text-lg font-bold px-1">+</span>
              {nums.back?.map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                  <ResultBall num={n} color="bg-[#2563eb]" />
                </span>
              ))}
            </>
          )}
          {(activeType === 'fc3d' || activeType === 'sg4d') && (
            <div className="flex gap-2">
              {String(nums).split('').map((c, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span className="inline-flex items-center justify-center w-12 h-14 rounded-lg bg-gradient-to-b from-[#b45309] to-[#d97706] text-white font-bold text-2xl shadow-md">
                    {c}
                  </span>
                </span>
              ))}
            </div>
          )}
          {activeType === 'toto' && (
            <>
              {(Array.isArray(nums) ? nums : []).map((n, i) => (
                <span key={i} className="anim-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ResultBall num={n} color="bg-[#dc2626]" />
                </span>
              ))}
            </>
          )}
        </div>

        <div className="text-center text-[10px] text-[#b0a898] mt-2">
          开奖时间：{result.time ? formatDrawTime(result.time) : new Date().toLocaleString('zh-CN')}
        </div>
      </div>
    )
  }

  // ── Render lottery picker per type ──
  const renderPicker = () => {
    switch (activeType) {
      // ─── SSQ ───
      case 'ssq':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#dc2626]">红球区（1-33 选6个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  已选 {selected.ssq.red.length}/6
                </span>
              </div>
              {renderNumberGrid(33, 'red', 6, 'bg-[#dc2626] text-white')}
            </div>
            <div className="border-t border-[#ece8e0] pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2563eb]">蓝球区（1-16 选1个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  {selected.ssq.blue ? `已选 ${selected.ssq.blue}` : '未选'}
                </span>
              </div>
              {renderSingleGrid(16, 'blue', 'bg-[#2563eb] text-white')}
            </div>
          </div>
        )

      // ─── DLT ───
      case 'dlt':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#dc2626]">前区（1-35 选5个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  已选 {selected.dlt.front.length}/5
                </span>
              </div>
              {renderNumberGrid(35, 'front', 5, 'bg-[#dc2626] text-white')}
            </div>
            <div className="border-t border-[#ece8e0] pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#2563eb]">后区（1-12 选2个）</span>
                <span className="text-[10px] text-[#b0a898]">
                  已选 {selected.dlt.back.length}/2
                </span>
              </div>
              {renderNumberGrid(12, 'back', 2, 'bg-[#2563eb] text-white')}
            </div>
          </div>
        )

      // ─── 3D ───
      case 'fc3d':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={3}
                value={fc3dInput}
                onChange={e => handleFc3dInput(e.target.value)}
                placeholder="直接输入3位数字"
                className="flex-1 px-3 py-2 text-center text-lg font-bold text-[#1c1917] border border-[#ece8e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
              />
              <span className="text-[10px] text-[#b0a898] whitespace-nowrap">
                直选
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {[0, 1, 2].map(pos => (
                renderDigitGrid('fc3d', pos, `第${pos + 1}位`)
              ))}
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

      // ─── 4D ───
      case 'sg4d':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                value={sg4dInput}
                onChange={e => handleSg4dInput(e.target.value)}
                placeholder="直接输入4位数字"
                className="flex-1 px-3 py-2 text-center text-lg font-bold text-[#1c1917] border border-[#ece8e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b45309]/30 focus:border-[#b45309] bg-white"
              />
              <span className="text-[10px] text-[#b0a898] whitespace-nowrap">
                iBet
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {[0, 1, 2, 3].map(pos => (
                renderDigitGrid('sg4d', pos, `第${pos + 1}位`)
              ))}
            </div>
            <div className="bg-[#faf8f5] rounded-lg p-3 text-xs text-[#666]">
              <p className="font-medium text-[#b45309] mb-1">🎯 iBet 选项</p>
              <p>iBet 包含所有排列组合，任意顺序匹配即可获奖，奖金为标准奖金 ÷ 排列数</p>
            </div>
          </div>
        )

      // ─── TOTO ───
      case 'toto':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#1c1917]">System</span>
              <select
                value={selected.toto.system}
                onChange={e => setTotoSystem(e.target.value)}
                className="px-2 py-1 text-sm border border-[#ece8e0] rounded-lg bg-white text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b45309]/30"
              >
                {[6, 7, 8, 9, 10, 11, 12].map(s => (
                  <option key={s} value={s}>
                    {s === 6 ? '普通 (6个)' : `System ${s} (${s}个)`}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-[#b0a898]">
                已选 {selected.toto.numbers.length}/{selected.toto.system}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#dc2626] mb-2 block">
                号码区（1-49）
              </span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {Array.from({ length: 49 }, (_, i) => i + 1).map(n => (
                  <NumberBall
                    key={n}
                    num={n}
                    selected={selected.toto.numbers.includes(n)}
                    color={selected.toto.numbers.includes(n) ? 'bg-[#dc2626] text-white' : 'bg-white border border-gray-300 text-gray-700'}
                    onClick={() => toggleTotoNum(n)}
                  />
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ── Render history ──
  const renderHistory = () => {
    if (!history.length) return null
    return (
      <div className="bg-white border border-[#ece8e0] rounded-xl p-5 shadow-sm mb-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-[#b0a898]" />
          <h3 className="text-sm font-bold text-[#1c1917]">最近开奖记录</h3>
          <span className="text-[10px] text-[#b0a898] ml-auto">最近 10 次</span>
        </div>
        <div className="space-y-2">
          {history.map((rec, i) => {
            const t = LOTTERY_TYPES.find(lt => lt.id === rec.lottery_type)
            return (
              <div
                key={rec.id || i}
                className="flex items-center gap-3 px-3 py-2 bg-[#faf8f5] rounded-lg text-xs"
              >
                <span className="text-base">{t?.emoji || '🎰'}</span>
                <span className="font-medium text-[#1c1917] w-10">{t?.label || rec.lottery_type}</span>
                <span className="text-[#666] flex-1 truncate">
                  {formatResultDisplay(rec.lottery_type, rec.numbers)}
                </span>
                <span className="text-[#b0a898] whitespace-nowrap">
                  {formatDrawTime(rec.created_at)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Render upgrade modal ──
  const upgradeModal = (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${showUpgradeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowUpgradeModal(false)}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5 pt-2">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-base font-bold text-[#1c1917] mb-1">免费用户无法摇奖</h3>
          <p className="text-xs text-[#666] leading-relaxed">
            需要升级到黄金会员或钻石会员才能使用彩票模拟器
          </p>
        </div>

        <div className="space-y-3 mb-5">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-[#b45309]" />
              <span className="font-bold text-sm text-[#1c1917]">黄金会员</span>
              <span className="text-[#b45309] font-bold text-sm ml-auto">¥9.9</span>
            </div>
            <p className="text-xs text-[#666] pl-6">500次摇奖机会</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-sm text-[#1c1917]">钻石会员</span>
              <span className="text-purple-600 font-bold text-sm ml-auto">¥99</span>
            </div>
            <p className="text-xs text-[#666] pl-6">无限次摇奖机会</p>
          </div>
        </div>

        <p className="text-[10px] text-[#b0a898] text-center mb-4">
          联系管理员（飞书/微信）打赏后即可升级
        </p>

        <Link
          href="/lottery/upgrade"
          className="block w-full py-2.5 bg-gradient-to-r from-[#b45309] to-[#d97706] text-white text-sm font-bold rounded-xl text-center hover:from-[#a04407] hover:to-[#c06806] transition-all duration-200 shadow-sm"
        >
          了解会员权益 →
        </Link>
      </div>
    </div>
  )

  // ── Prize table modal ──
  const prizeModal = (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${showPrizeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPrizeModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
        <button
          onClick={() => setShowPrizeModal(false)}
          className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666]"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-4 pt-2">
          <Trophy className="w-4 h-4 text-[#b45309]" />
          <h3 className="text-sm font-bold text-[#1c1917]">
            {LOTTERY_TYPES.find(t => t.id === activeType)?.label} 奖级
          </h3>
        </div>
        <div className="space-y-1">
          {(PRIZE_TABLE[activeType] || []).map((p, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-[#faf8f5] rounded-lg text-xs">
              <div>
                <span className="font-medium text-[#1c1917]">{p.level}</span>
                <span className="text-[#b0a898] ml-2">{p.match}</span>
              </div>
              <span className="font-bold text-[#b45309]">{p.prize}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Rules modal ──
  const rulesModal = (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${showRulesModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRulesModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
        <button
          onClick={() => setShowRulesModal(false)}
          className="absolute top-3 right-3 text-[#b0a898] hover:text-[#666]"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 mb-4 pt-2">
          <AlertTriangle className="w-4 h-4 text-[#b45309]" />
          <h3 className="text-sm font-bold text-[#1c1917]">彩票规则说明</h3>
        </div>

        <div className="space-y-4 text-xs text-[#666] leading-relaxed">
          {activeType === 'ssq' && (
            <>
              <p><strong className="text-[#1c1917]">双色球</strong> 由中国福利彩票发行</p>
              <p>红球：从1-33中选择6个号码<br/>蓝球：从1-16中选择1个号码</p>
              <p className="font-medium text-[#b45309] mt-2">奖级设定：</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>一等奖：6红+1蓝全中 → 约¥500万+</li>
                <li>二等奖：6红 → 约¥10万+</li>
                <li>三等奖：5红+1蓝 → ¥3,000</li>
                <li>四等奖：5红或4红+1蓝 → ¥200</li>
                <li>五等奖：4红或3红+1蓝 → ¥10</li>
                <li>六等奖：仅蓝球 → ¥5</li>
              </ul>
            </>
          )}
          {activeType === 'dlt' && (
            <>
              <p><strong className="text-[#1c1917]">超级大乐透</strong> 由中国体育彩票发行</p>
              <p>前区：从1-35中选择5个号码<br/>后区：从1-12中选择2个号码</p>
              <p className="font-medium text-[#b45309] mt-2">奖级设定：</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>一等奖：5+2 → 约¥1000万+</li>
                <li>二等奖：5+1 → 约¥10万+</li>
                <li>三等奖：5+0 → ¥10,000</li>
                <li>四等奖：4+2 → ¥3,000</li>
                <li>五等奖：4+1 → ¥300</li>
                <li>六等奖：3+2 → ¥200</li>
                <li>七等奖：4+0 → ¥100</li>
                <li>八等奖：3+1或2+2 → ¥15</li>
                <li>九等奖：其余 → ¥5</li>
              </ul>
            </>
          )}
          {activeType === 'fc3d' && (
            <>
              <p><strong className="text-[#1c1917]">福彩3D</strong> 每注投注号码由3个0-9的数字组成</p>
              <p className="font-medium text-[#b45309] mt-2">玩法：</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>直选：顺序完全一致 → ¥1,040</li>
                <li>组三：三位数有两位相同 → ¥346</li>
                <li>组六：三位数各不相同 → ¥173</li>
              </ul>
            </>
          )}
          {activeType === 'sg4d' && (
            <>
              <p><strong className="text-[#1c1917]">新加坡4D</strong> 从0000-9999中抽取4位数字</p>
              <p className="font-medium text-[#b45309] mt-2">奖级设定：</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>一等奖：完全匹配 → ¥2,000</li>
                <li>二等奖：后3位匹配+前1位移位 → ¥500</li>
                <li>三等奖：后3位匹配 → ¥250</li>
                <li>入围奖：后2位匹配 → ¥10</li>
              </ul>
              <p className="mt-2"><strong>iBet：</strong>包含所有排列组合，任意顺序匹配即可</p>
            </>
          )}
          {activeType === 'toto' && (
            <>
              <p><strong className="text-[#1c1917]">新加坡TOTO</strong> 从1-49中抽取6个号码</p>
              <p>普通：选6个号码<br/>System：选7-12个号码</p>
              <p className="font-medium text-[#b45309] mt-2">奖级设定：</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>一等奖：6个全中 → 累积奖金池</li>
                <li>二等奖：5个+额外号 → 固定奖金</li>
                <li>三等奖：5个 → ¥800</li>
                <li>四等奖：4个 → ¥50</li>
                <li>五等奖：3个 → ¥10</li>
                <li>六等奖：2个+额外号 → ¥5</li>
              </ul>
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[#ece8e0] text-[10px] text-[#b0a898]">
          <p>⚠️ 本站为彩票模拟器，仅供娱乐参考，不涉及真实投注</p>
        </div>
      </div>
    </div>
  )

  // ── Render current selection summary ──
  const renderSelectionSummary = () => {
    switch (activeType) {
      case 'ssq': {
        const r = selected.ssq.red
        const b = selected.ssq.blue
        if (!r.length && !b) return null
        return (
          <div className="flex flex-wrap items-center gap-1 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            {r.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dc2626] text-white text-[10px] font-bold">{n}</span>
            ))}
            {b && (
              <>
                <span className="text-[#b0a898]">+</span>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2563eb] text-white text-[10px] font-bold">{b}</span>
              </>
            )}
          </div>
        )
      }
      case 'dlt': {
        const f = selected.dlt.front
        const b = selected.dlt.back
        if (!f.length && !b.length) return null
        return (
          <div className="flex flex-wrap items-center gap-1 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            {f.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dc2626] text-white text-[10px] font-bold">{n}</span>
            ))}
            <span className="text-[#b0a898]">+</span>
            {b.map(n => (
              <span key={n} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2563eb] text-white text-[10px] font-bold">{n}</span>
            ))}
          </div>
        )
      }
      case 'fc3d': {
        const v = selected.fc3d.filter(d => d !== '').join('')
        if (!v) return null
        return (
          <div className="flex items-center gap-1 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            <span className="inline-flex items-center gap-1">
              {v.split('').map((d, i) => (
                <span key={i} className="inline-flex items-center justify-center w-7 h-8 rounded bg-[#b45309] text-white text-xs font-bold">{d}</span>
              ))}
            </span>
          </div>
        )
      }
      case 'sg4d': {
        const v = selected.sg4d.filter(d => d !== '').join('')
        if (!v) return null
        return (
          <div className="flex items-center gap-1 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            <span className="inline-flex items-center gap-1">
              {v.split('').map((d, i) => (
                <span key={i} className="inline-flex items-center justify-center w-7 h-8 rounded bg-[#7c3aed] text-white text-xs font-bold">{d}</span>
              ))}
            </span>
          </div>
        )
      }
      case 'toto': {
        const n = selected.toto.numbers
        if (!n.length) return null
        return (
          <div className="flex flex-wrap items-center gap-1 text-xs text-[#666]">
            <span className="font-medium text-[#1c1917]">已选：</span>
            {n.map(num => (
              <span key={num} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dc2626] text-white text-[10px] font-bold">{num}</span>
            ))}
          </div>
        )
      }
      default:
        return null
    }
  }

  // ── Check if can draw ──
  const canDraw = () => {
    switch (activeType) {
      case 'ssq':
        return selected.ssq.red.length === 6 && selected.ssq.blue !== null
      case 'dlt':
        return selected.dlt.front.length === 5 && selected.dlt.back.length === 2
      case 'fc3d':
        return selected.fc3d.every(d => d !== '')
      case 'sg4d':
        return selected.sg4d.every(d => d !== '')
      case 'toto':
        return selected.toto.numbers.length === selected.toto.system
      default:
        return false
    }
  }

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐', href: '/music' },
        { label: '🎰 彩票模拟器' },
      ]} className="mb-3" />

      {/* ─── SEO / Description ─── */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🎰</span>
          <h1 className="text-lg font-bold text-[#1c1917]">古道彩票模拟器</h1>
        </div>
        <p className="text-[11px] text-[#b0a898] leading-relaxed">
          福彩双色球 体彩大乐透 福彩3D 新加坡4D 新加坡TOTO 彩票模拟器 彩票开奖模拟 在线摇奖
        </p>
      </div>

      {/* ─── Mobile type selector ─── */}
      <div className="sm:hidden mb-3">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#ece8e0] rounded-xl text-sm font-medium text-[#1c1917]"
        >
          <span className="flex items-center gap-2">
            {LOTTERY_TYPES.find(t => t.id === activeType)?.emoji}
            {LOTTERY_TYPES.find(t => t.id === activeType)?.label}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
        </button>
        {showMobileMenu && (
          <div className="mt-1 bg-white border border-[#ece8e0] rounded-xl overflow-hidden shadow-sm">
            {LOTTERY_TYPES.map(lt => (
              <button
                key={lt.id}
                onClick={() => { setActiveType(lt.id); setShowMobileMenu(false); setResult(null) }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  activeType === lt.id ? 'bg-[#b45309]/5 text-[#b45309] font-medium' : 'text-[#666] hover:bg-gray-50'
                }`}
              >
                <span>{lt.emoji}</span>
                <span>{lt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Desktop tabs ─── */}
      <div className="hidden sm:flex gap-1.5 mb-4">
        {LOTTERY_TYPES.map(lt => (
          <button
            key={lt.id}
            onClick={() => { setActiveType(lt.id); setResult(null) }}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
              activeType === lt.id
                ? lt.color + ' shadow-sm'
                : 'bg-white border-[#ece8e0] text-[#666] hover:border-[#b45309]/30 hover:text-[#1c1917]'
            }`}
          >
            {lt.emoji} {lt.label}
          </button>
        ))}
      </div>

      {/* ─── User status bar ─── */}
      <div className="flex items-center gap-3 mb-4 px-1">
        {isAuthLoaded && !user ? (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#ece8e0] rounded-lg text-xs text-[#666] hover:border-[#b45309]/30 transition-colors"
          >
            <User className="w-3 h-3" />
            登录后摇奖
          </Link>
        ) : (
          <>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#ece8e0] rounded-lg text-xs">
              {userLevel === 'diamond' ? (
                <Crown className="w-3 h-3 text-purple-600" />
              ) : userLevel === 'gold' ? (
                <Star className="w-3 h-3 text-[#b45309]" />
              ) : (
                <User className="w-3 h-3 text-[#b0a898]" />
              )}
              <span className="text-[#1c1917] font-medium">
                {userLevel === 'diamond' ? '钻石会员' : userLevel === 'gold' ? '黄金会员' : '普通用户'}
              </span>
            </span>
            <span className="text-[10px] text-[#b0a898]">
              <Zap className="w-3 h-3 inline mr-0.5" />
              剩余 {drawsRemaining === 99999 ? '∞' : drawsRemaining} 次
            </span>
          </>
        )}
        <button
          onClick={() => setShowPrizeModal(true)}
          className="ml-auto flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-[#b45309] hover:bg-[#b45309]/5 rounded-lg transition-colors"
        >
          <Trophy className="w-3 h-3" />
          奖级
        </button>
        <button
          onClick={() => setShowRulesModal(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-[#b0a898] hover:text-[#666] hover:bg-gray-50 rounded-lg transition-colors"
        >
          <AlertTriangle className="w-3 h-3" />
          规则
        </button>
      </div>

      {/* ─── Main selection card ─── */}
      <div className="bg-white border border-[#ece8e0] rounded-xl p-4 sm:p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1c1917]">
            {LOTTERY_TYPES.find(t => t.id === activeType)?.emoji}{' '}
            {LOTTERY_TYPES.find(t => t.id === activeType)?.label} 选号
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
        disabled={!canDraw() || drawing || !isAuthLoaded}
        className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
          !canDraw() || drawing
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : userLevel === 'regular'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
              : 'bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:from-[#a04407] hover:to-[#c06806]'
        }`}
      >
        {drawing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            摇奖中...
          </>
        ) : !canDraw() ? (
          <>
            <Lock className="w-4 h-4" />
            请完成选号
          </>
        ) : userLevel === 'regular' ? (
          <>
            <Star className="w-4 h-4" />
            升级会员后摇奖 🎰
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

      {/* ─── History ─── */}
      {renderHistory()}

      {/* ─── Modals ─── */}
      {upgradeModal}
      {prizeModal}
      {rulesModal}

      {/* ─── Styles ─── */}
      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.15); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .anim-bounce-in {
          animation: bounceIn 0.45s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
