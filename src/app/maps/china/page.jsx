'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Search } from 'lucide-react'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function ChinaMapPage() {
  const [mounted, setMounted] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [searchResult, setSearchResult] = useState('')

  useEffect(() => { setMounted(true) }, [])

  const handleSearchResult = (type, data) => {
    if (type === 'userLoc') {
      setUserLocation(data)
    } else if (type === 'search') {
      setSearchResult(data)
    } else {
      setSearchResult(data || '')
    }
  }

  const handleSearch = () => {
    const q = searchText.trim()
    if (!q) return
    setSearchResult('搜索中…')
    setSearchQuery(q) // 触发 MapView 搜索
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  return (
    <div className="min-h-screen">
      {/* 电脑端固定左半屏，手机端正常全宽 */}
      <div className="bg-[#f5f0eb] min-h-screen px-4 py-6 sm:fixed sm:left-0 sm:top-0 sm:w-[50vw] sm:h-screen sm:overflow-y-auto">

        <Link href="/maps" className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#c23531] mb-4 transition-colors">
          <ArrowLeft size={14} /> 返回地图列表
        </Link>

        <h1 className="text-lg font-bold text-[#1c1917] mb-1">🌏 中国地图</h1>
        <p className="text-xs text-[#888] mb-4">高精度瓦片地图 · 搜索定位 · 双指缩放拖拽 · 自动IP定位</p>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="搜索中国任何地区，如：威海、山东、天安门、西湖…"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#e5ddd5] bg-white text-sm text-[#1c1917] placeholder:text-[#bbb] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/30 transition-colors" />
          </div>
          <button onClick={handleSearch}
            className="px-4 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5">
            <Search size={15} /> 搜索
          </button>
        </div>

        {searchResult && searchResult !== '搜索中…' && (
          <div className="mb-3 text-xs text-[#d97706] bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">📍 {searchResult}</div>
        )}
        {userLocation && (
          <div className="mb-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">📌 检测到您的位置：{userLocation.label}</div>
        )}

        <div className="bg-white rounded-xl border border-[#e5ddd5] overflow-hidden relative">
          <MapView
            center={[35.86, 104.19]} zoom={4} minZoom={3}
            searchQuery={searchQuery}
            userLoc={userLocation}
            onSearchResult={handleSearchResult}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#888]">
          <span>👆 拖拽移动 — 从威海拖到乌鲁木齐</span>
          <span>🔍 双指/滚轮缩放</span>
          <span>📍 右下角 +/- 按钮</span>
          <span>🔎 搜索任意地名</span>
        </div>

      </div>
    </div>
  )
}
