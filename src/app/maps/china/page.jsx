'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function ChinaMapPage() {
  const [searchText, setSearchText] = useState('')
  const [mapUrl, setMapUrl] = useState(
    'https://www.openstreetmap.org/export/embed.html?bbox=73.5,18.2,135.1,53.6&layer=mapnik'
  )
  const [searchResult, setSearchResult] = useState('')
  const [userInfo, setUserInfo] = useState('')

  // IP定位
  // IP定位 + 自动飞往用户位置
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        if (d.latitude && d.longitude) {
          setUserInfo(`📍 ${d.city}, ${d.country_name}`)
          // 自动定位到用户位置
          const [lat, lon] = [d.latitude, d.longitude]
          setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.2},${lat-0.15},${lon+0.2},${lat+0.15}&layer=mapnik&marker=${lat},${lon}`)
        }
      })
      .catch(() => {})
  }, [])

  const handleSearch = async () => {
    const q = searchText.trim()
    if (!q) { setSearchResult('请输入地名'); return }
    setSearchResult('搜索中…')
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=3`)
      if (!res.ok) throw new Error('API错误')
      const geo = await res.json()
      const features = geo?.features
      if (!features?.length) { setSearchResult('未找到该地区'); return }
      const f = features[0], [lon, lat] = f.geometry.coordinates
      const p = f.properties
      const name = [p.name, p.city, p.state, p.country].filter(Boolean).join(', ')
      // 更新 iframe URL 定位到搜索地址
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.5},${lat-0.3},${lon+0.5},${lat+0.3}&layer=mapnik&marker=${lat},${lon}`)
      setSearchResult(`📍 ${name}`)
    } catch (e) {
      setSearchResult('搜索失败：' + e.message)
    }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="max-w-5xl mx-auto px-4 py-6">

        <Link href="/maps" className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#c23531] mb-4 transition-colors">
          <ArrowLeft size={14} /> 返回地图列表
        </Link>

        <h1 className="text-lg font-bold text-[#1c1917] mb-1">🌏 中国地图</h1>
        <p className="text-xs text-[#888] mb-4">OpenStreetMap 全球地图 · 搜索定位 · 拖拽缩放</p>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="搜索中国任何地区，如：威海、山东、天安门…"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#e5ddd5] bg-white text-sm text-[#1c1917] placeholder:text-[#bbb] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/30 transition-colors" />
          </div>
          <button onClick={handleSearch}
            className="px-4 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5">
            <Search size={15} /> 搜索
          </button>
        </div>

        {searchResult && searchResult !== '搜索中…' && (
          <div className="mb-3 text-xs text-[#d97706] bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">{searchResult}</div>
        )}
        {userInfo && (
          <div className="mb-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">{userInfo}</div>
        )}

        {/* 纯iframe地图 — 无JavaScript依赖 */}
        <div className="bg-white rounded-xl border border-[#e5ddd5] overflow-hidden shadow-sm">
          <iframe
            key={mapUrl}
            src={mapUrl}
            width="100%"
            height="480"
            style={{ border: 0, display: 'block' }}
            title="OpenStreetMap"
            allowFullScreen
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#888]">
          <span>👆 拖拽移动</span>
          <span>🔍 滚轮/双指缩放</span>
          <span>🔎 搜索定位</span>
        </div>

      </div>
    </div>
  )
}
