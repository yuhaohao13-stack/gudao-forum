'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Search } from 'lucide-react'

const ChinaMap = dynamic(() => import('@/components/ChinaMap'), { ssr: false })

export default function ChinaMapPage() {
  const [searchText, setSearchText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState('')
  const [userInfo, setUserInfo] = useState('')
  const mapRef = useRef(null)
  const LRef = useRef(null)

  // IP定位
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        if (d.latitude && d.longitude)
          setUserInfo(`📍 ${d.city}, ${d.country_name}`)
      })
      .catch(() => {})
  }, [])

  const handleMapReady = (map, L) => {
    mapRef.current = map
    LRef.current = L

    // IP定位 + 自动飞往
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        const lat = d.latitude, lon = d.longitude
        if (lat && lon) {
          map.flyTo([lat, lon], 10)
          L.marker([lat, lon]).addTo(map).bindPopup(`<b>📍 您的位置</b><br/>${d.city}, ${d.country_name}`).openPopup()
        }
      })
      .catch(() => {})
  }

  const handleSearch = async () => {
    const q = searchText.trim()
    if (!q) return
    setSearchResult('搜索中…')
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q + ' 中国')}&limit=3`)
      if (!res.ok) throw new Error()
      const geo = await res.json()
      const features = geo?.features
      if (!features?.length) { setSearchResult('未找到'); return }
      const f = features[0], [lon, lat] = f.geometry.coordinates
      const p = f.properties
      const name = [p.name, p.city, p.state, p.country].filter(Boolean).join(', ')
      const map = mapRef.current, L = LRef.current
      if (map) {
        map.flyTo([lat, lon], 10)
        L.marker([lat, lon]).addTo(map).bindPopup(`<b>${name}</b>`).openPopup()
      }
      setSearchResult(`📍 ${name}`)
    } catch { setSearchResult('搜索失败') }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch() }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="max-w-5xl mx-auto px-4 py-6">

        <Link href="/maps" className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#c23531] mb-3 transition-colors">
          <ArrowLeft size={14} /> 返回地图列表
        </Link>

        <h1 className="text-lg font-bold text-[#1c1917] mb-1">🌏 中国地图</h1>
        <p className="text-xs text-[#888] mb-4">高德地图瓦片 · 中国用户推荐 · 搜索定位</p>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="搜索中国地区，如：威海、山东、北京…"
              className="w-full pl-3 pr-3 py-2.5 rounded-xl border border-[#e5ddd5] bg-white text-sm text-[#1c1917] placeholder:text-[#bbb] focus:outline-none focus:border-[#d97706] focus:ring-1 focus:ring-[#d97706]/30 transition-colors" />
          </div>
          <button onClick={handleSearch}
            className="px-4 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5">
            <Search size={15} /> 搜索
          </button>
        </div>

        {searchResult && (
          <div className="mb-2 text-xs text-[#d97706] bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">{searchResult}</div>
        )}
        {userInfo && (
          <div className="mb-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">{userInfo}</div>
        )}

        <div className="bg-white rounded-xl border border-[#e5ddd5] overflow-hidden">
          <ChinaMap onReady={handleMapReady} />
        </div>

        <div className="mt-3 text-[10px] text-[#888] space-y-1">
          <p>💡 高德地图瓦片，支持全球浏览。中国大陆用户打开即中国视图，拖动/缩小可看全球。</p>
          <p>👆 拖拽移动 · 滚轮/双指缩放 · 搜索定位</p>
        </div>

      </div>
    </div>
  )
}
