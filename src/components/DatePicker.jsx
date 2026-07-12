'use client'
import { useState, useRef, useEffect } from 'react'

const MONTHS_ZH = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

/**
 * 日期选择组件 - 年/月/日 分开滑动选择，不用日历
 *
 * Props:
 * - value: string (YYYY-MM-DD 格式)
 * - onChange: (dateStr: string) => void
 * - lang: 'zh' | 'en'
 * - max: string (YYYY-MM-DD)
 * - required: boolean
 */
export default function DatePicker({ value, onChange, lang, max, required }) {
  const t = (zh, en) => lang === 'en' ? en : zh

  const [showYear, setShowYear] = useState(false)
  const [showMonth, setShowMonth] = useState(false)
  const [showDay, setShowDay] = useState(false)

  const yearRef = useRef(null)
  const monthRef = useRef(null)
  const dayRef = useRef(null)

  // 解析当前值
  const parts = value ? value.split('-') : []
  const curYear = parts[0] ? parseInt(parts[0]) : ''
  const curMonth = parts[1] ? parseInt(parts[1]) : ''
  const curDay = parts[2] ? parseInt(parts[2]) : ''

  const maxDate = max ? new Date(max) : new Date()
  const maxYear = maxDate.getFullYear()
  const minYear = 1900

  const selectedYear = curYear || maxYear - 20
  const selectedMonth = curMonth || 1
  const daysInMonth = selectedYear ? getDaysInMonth(selectedYear, selectedMonth) : 31

  const handleYearSelect = (y) => {
    const maxD = getDaysInMonth(y, selectedMonth)
    const d = curDay > maxD ? maxD : curDay
    onChange(`${y}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    setShowYear(false)
  }

  const handleMonthSelect = (m) => {
    const maxD = getDaysInMonth(selectedYear, m)
    const d = curDay > maxD ? maxD : curDay
    const val = curYear
      ? `${curYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      : `${maxYear - 20}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onChange(val)
    setShowMonth(false)
  }

  const handleDaySelect = (d) => {
    if (curYear && curMonth) {
      onChange(`${curYear}-${String(curMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
    }
    setShowDay(false)
  }

  // 关闭弹出层
  useEffect(() => {
    const handler = (e) => {
      if (yearRef.current && !yearRef.current.contains(e.target)) setShowYear(false)
      if (monthRef.current && !monthRef.current.contains(e.target)) setShowMonth(false)
      if (dayRef.current && !dayRef.current.contains(e.target)) setShowDay(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 滚动到当前值
  useEffect(() => {
    if (showYear && curYear) {
      const el = yearRef.current?.querySelector(`[data-year="${curYear}"]`)
      el?.scrollIntoView({ block: 'center' })
    }
  }, [showYear, curYear])

  useEffect(() => {
    if (showMonth && curMonth) {
      const el = monthRef.current?.querySelector(`[data-month="${curMonth}"]`)
      el?.scrollIntoView({ block: 'center' })
    }
  }, [showMonth, curMonth])

  useEffect(() => {
    if (showDay && curDay) {
      const el = dayRef.current?.querySelector(`[data-day="${curDay}"]`)
      el?.scrollIntoView({ block: 'center' })
    }
  }, [showDay, curDay])

  const months = lang === 'en' ? MONTHS_EN : MONTHS_ZH

  return (
    <div>
      <div className="flex gap-2">
        {/* 年 */}
        <div className="relative flex-1" ref={yearRef}>
          <button type="button" onClick={() => { setShowYear(!showYear); setShowMonth(false); setShowDay(false) }}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between">
            <span className={curYear ? 'text-gray-900' : 'text-gray-400'}>{curYear || t('年', 'Year')}</span>
            <span className="text-gray-300 text-xs">▾</span>
          </button>
          {showYear && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[70vh] overflow-y-auto">
              {Array.from({length: maxYear - minYear + 1}, (_, i) => minYear + i).map(y => (
                <button key={y} type="button" data-year={y}
                  onClick={() => handleYearSelect(y)}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-blue-50 transition-colors ${
                    y === curYear ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                  }`}>
                  {y}{t('年', '')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 月 */}
        <div className="relative flex-1" ref={monthRef}>
          <button type="button" onClick={() => { setShowMonth(!showMonth); setShowYear(false); setShowDay(false) }}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between">
            <span className={curMonth ? 'text-gray-900' : 'text-gray-400'}>{curMonth ? months[curMonth - 1] : t('月', 'Month')}</span>
            <span className="text-gray-300 text-xs">▾</span>
          </button>
          {showMonth && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
              {months.map((m, i) => (
                <button key={i + 1} type="button" data-month={i + 1}
                  onClick={() => handleMonthSelect(i + 1)}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-blue-50 transition-colors ${
                    i + 1 === curMonth ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 日 */}
        <div className="relative flex-1" ref={dayRef}>
          <button type="button" onClick={() => { setShowDay(!showDay); setShowYear(false); setShowMonth(false) }}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-left bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-between">
            <span className={curDay ? 'text-gray-900' : 'text-gray-400'}>{curDay || t('日', 'Day')}</span>
            <span className="text-gray-300 text-xs">▾</span>
          </button>
          {showDay && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
              {Array.from({length: daysInMonth}, (_, i) => i + 1).map(d => (
                <button key={d} type="button" data-day={d}
                  onClick={() => handleDaySelect(d)}
                  className={`w-full px-3 py-1.5 text-sm text-left hover:bg-blue-50 transition-colors ${
                    d === curDay ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'
                  }`}>
                  {d}{t('日', '')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
