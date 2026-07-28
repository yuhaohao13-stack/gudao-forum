'use client'

import { useState, useEffect } from 'react'

const CHINA_BBOX = '73.5,18.2,135.1,53.6'
const WORLD_BBOX = '-180,-90,180,90'

export default function MapView({ center, zoom = 6, isChina = false, searchQuery, onSearchResult, userLoc }) {
  const bbox = isChina ? CHINA_BBOX : WORLD_BBOX
  const defaultCenter = isChina ? '104.19,35.86' : '0,20'
  const [mapSrc, setMapSrc] = useState('')
  const [userText, setUserText] = useState('')

  useEffect(() => {
    setMapSrc(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${defaultCenter}`)
  }, [])

  // 搜索
  useEffect(() => {
    if (!searchQuery) return
    ;(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=3`)
        if (!res.ok) throw new Error()
        const geo = await res.json()
        const features = geo?.features
        if (!features?.length) { onSearchResult?.('', '未找到'); return }
        const f = features[0], [lon, lat] = f.geometry.coordinates
        const p = f.properties
        const name = [p.name, p.city, p.state, p.country].filter(Boolean).join(', ')
        const newSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.5},${lat-0.3},${lon+0.5},${lat+0.3}&layer=mapnik&marker=${lat},${lon}`
        setMapSrc(newSrc)
        onSearchResult?.('search', name)
      } catch { onSearchResult?.('', '搜索失败') }
    })()
  }, [searchQuery])

  // IP定位
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        if (d.latitude && d.longitude) {
          setUserText(`${d.city}, ${d.country_name}`)
          onSearchResult?.('userLoc', { lat: d.latitude, lon: d.longitude, label: `${d.city}, ${d.country_name}` })
        }
      })
      .catch(() => {})
  }, [])

  const flyToUser = () => {
    if (!userLoc) return
    const newSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${userLoc.lon-0.2},${userLoc.lat-0.15},${userLoc.lon+0.2},${userLoc.lat+0.15}&layer=mapnik&marker=${userLoc.lat},${userLoc.lon}`
    setMapSrc(newSrc)
  }

  return (
    <div className="relative bg-white rounded-xl border border-[#e5ddd5] overflow-hidden">
      {mapSrc ? (
        <iframe
          title="map"
          src={mapSrc}
          width="100%"
          height="420"
          style={{ border: 0, display: 'block' }}
          loading="eager"
        />
      ) : (
        <div style={{ height: '420px' }} className="flex items-center justify-center bg-[#f5f0eb]">
          <div className="text-sm text-[#888]">加载地图中…</div>
        </div>
      )}
      {userText && (
        <div className="absolute top-2 left-2 z-10 bg-white/90 rounded-lg px-2.5 py-1 text-xs text-green-700 shadow-sm border border-green-200">
          📌 {userText}
        </div>
      )}
      {userLoc && (
        <button onClick={flyToUser}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M22 12h-4M6 12H2"/></svg>
        </button>
      )}
    </div>
  )
}
