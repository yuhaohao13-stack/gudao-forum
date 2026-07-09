'use client'
import { useState, useRef, useEffect } from 'react'

// 常用国家/地区代码列表（按使用频率排序）
const COUNTRIES = [
  { code: '86', name: '中国', flag: '🇨🇳', len: 11 },
  { code: '65', name: '新加坡', flag: '🇸🇬', len: 8 },
  { code: '852', name: '香港', flag: '🇭🇰', len: 8 },
  { code: '1', name: '美国/加拿大', flag: '🇺🇸', len: 10 },
  { code: '44', name: '英国', flag: '🇬🇧', len: 10 },
  { code: '81', name: '日本', flag: '🇯🇵', len: [10, 11] },
  { code: '82', name: '韩国', flag: '🇰🇷', len: [9, 10] },
  { code: '886', name: '台湾', flag: '🇹🇼', len: 9 },
  { code: '91', name: '印度', flag: '🇮🇳', len: 10 },
  { code: '60', name: '马来西亚', flag: '🇲🇾', len: [9, 10] },
  { code: '62', name: '印度尼西亚', flag: '🇮🇩', len: [10, 12] },
  { code: '63', name: '菲律宾', flag: '🇵🇭', len: 10 },
  { code: '66', name: '泰国', flag: '🇹🇭', len: 9 },
  { code: '84', name: '越南', flag: '🇻🇳', len: [9, 10] },
  { code: '853', name: '澳门', flag: '🇲🇴', len: 8 },
  { code: '61', name: '澳大利亚', flag: '🇦🇺', len: 9 },
  { code: '64', name: '新西兰', flag: '🇳🇿', len: [8, 10] },
  { code: '49', name: '德国', flag: '🇩🇪', len: [10, 11] },
  { code: '33', name: '法国', flag: '🇫🇷', len: 9 },
  { code: '39', name: '意大利', flag: '🇮🇹', len: [9, 10] },
  { code: '34', name: '西班牙', flag: '🇪🇸', len: 9 },
  { code: '31', name: '荷兰', flag: '🇳🇱', len: 9 },
  { code: '41', name: '瑞士', flag: '🇨🇭', len: 9 },
  { code: '46', name: '瑞典', flag: '🇸🇪', len: [7, 10] },
  { code: '47', name: '挪威', flag: '🇳🇴', len: 8 },
  { code: '45', name: '丹麦', flag: '🇩🇰', len: 8 },
  { code: '358', name: '芬兰', flag: '🇫🇮', len: [9, 10] },
  { code: '7', name: '俄罗斯', flag: '🇷🇺', len: 10 },
  { code: '55', name: '巴西', flag: '🇧🇷', len: [10, 11] },
  { code: '52', name: '墨西哥', flag: '🇲🇽', len: 10 },
  { code: '27', name: '南非', flag: '🇿🇦', len: 9 },
  { code: '971', name: '阿联酋', flag: '🇦🇪', len: 9 },
  { code: '966', name: '沙特', flag: '🇸🇦', len: 9 },
  { code: '90', name: '土耳其', flag: '🇹🇷', len: 10 },
  { code: '20', name: '埃及', flag: '🇪🇬', len: 10 },
  { code: '234', name: '尼日利亚', flag: '🇳🇬', len: 10 },
  { code: '254', name: '肯尼亚', flag: '🇰🇪', len: [9, 10] },
].sort((a, b) => {
  // 中国排第一个
  if (a.code === '86') return -1
  if (b.code === '86') return 1
  return 0
})

/**
 * 国际手机号输入组件
 *
 * Props:
 * - value: { code: string, number: string } — 当前值
 * - onChange: ({ code, number }) => void
 * - placeholder?: string
 * - required?: boolean
 * - disabled?: boolean
 * - label?: string (不传则不显示label)
 * - lang?: string ('zh' | 'en')
 */
export default function PhoneInput({ value, onChange, placeholder, required, disabled, label, lang }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  const t = (zh, en) => lang === 'en' ? en : zh

  const selected = COUNTRIES.find(c => c.code === value?.code) || COUNTRIES[0]

  // 过滤国家列表
  const filtered = search
    ? COUNTRIES.filter(c =>
        c.name.includes(search) ||
        c.code.includes(search) ||
        c.flag.includes(search)
      )
    : COUNTRIES

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // 打开时聚焦搜索框
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  const handleSelect = (country) => {
    onChange({ code: country.code, number: value?.number || '' })
    setOpen(false)
    setSearch('')
  }

  const handleNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    onChange({ code: value?.code || '86', number: raw })
  }

  const displayValue = value?.number || ''
  const fullNumber = value?.code ? `+${value.code}${value?.number || ''}` : ''

  return (
    <div>
      {label && (
        <label className={`block text-xs font-medium mb-1 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-0">
        {/* 国家代码选择器 */}
        <div className="relative" ref={dropdownRef}>
          <button type="button" onClick={() => !disabled && setOpen(!open)}
            className={`
              flex items-center gap-1.5 px-2.5 py-2.5 text-sm border border-r-0 rounded-l-xl
              ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 hover:border-gray-400 cursor-pointer'}
              ${open ? 'border-blue-500 ring-2 ring-blue-200 z-10' : 'border-gray-300'}
              transition-all min-w-[5.5rem]
            `}
          >
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="font-medium text-xs whitespace-nowrap">+{selected.code}</span>
            <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* 下拉列表 */}
          {open && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-hidden">
              {/* 搜索框 */}
              <div className="p-2 border-b border-gray-100">
                <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder={t('搜索国家/地区代码...', 'Search country code...')}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* 国家列表 */}
              <div className="overflow-y-auto max-h-60">
                {filtered.length === 0 ? (
                  <div className="text-center py-4 text-xs text-gray-400">{t('无匹配结果', 'No results')}</div>
                ) : (
                  filtered.map(country => (
                    <button key={country.code} type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-blue-50 transition-colors text-left ${
                        country.code === value?.code ? 'bg-blue-50 font-medium' : ''
                      }`}
                    >
                      <span className="text-base">{country.flag}</span>
                      <span className="text-gray-900 min-w-[3rem]">+{country.code}</span>
                      <span className="text-gray-500 text-xs truncate">{country.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 手机号输入框 */}
        <input type="tel" value={displayValue} onChange={handleNumberChange}
          placeholder={placeholder || t('请输入手机号', 'Enter phone number')}
          required={required} disabled={disabled}
          inputMode="numeric"
          className={`
            flex-1 border rounded-r-xl px-3 py-2.5 text-sm outline-none
            ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900 border-gray-300'}
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all
          `}
        />
      </div>
      {/* 完整号码预览 */}
      {fullNumber && (
        <p className="text-[10px] text-gray-400 mt-1">
          {t('完整号码：', 'Full number: ')}{fullNumber}
        </p>
      )}
    </div>
  )
}
