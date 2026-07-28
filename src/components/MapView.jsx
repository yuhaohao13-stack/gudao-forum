'use client'

import { useEffect, useRef, useState } from 'react'

let L = null

export default function MapView({ center, zoom, minZoom, searchQuery, onSearchResult, userLoc }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const userMarkerRef = useRef(null)
  const searchMarkerRef = useRef(null)
  const [ready, setReady] = useState(false)

  // 动态加载 Leaflet
  useEffect(() => {
    let cancelled = false
    async function init() {
      const leaflet = await import('leaflet')
      await import('leaflet/dist/leaflet.css')
      if (cancelled) return

      L = leaflet.default || leaflet

      // 修复图标
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!containerRef.current || cancelled) return

      const map = L.map(containerRef.current, {
        center, zoom, minZoom, zoomControl: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)
      mapRef.current = map
      setReady(true)

      // IP 定位
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        if (cancelled) return
        const lat = data.latitude, lon = data.longitude
        const city = data.city || '', country = data.country_name || ''
        if (lat && lon) {
          userMarkerRef.current = L.marker([lat, lon], {
            icon: L.divIcon({
              className: '',
              html: `<div style="background:#2563eb;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid #fff">📍</div>`,
              iconSize: [28, 28], iconAnchor: [14, 28],
            })
          }).addTo(map)
          userMarkerRef.current.bindPopup(`<b>📍 您的位置</b><br/>${city}, ${country}`)
          onSearchResult?.('userLoc', { lat, lon, label: `${city}, ${country}` })
        }
      } catch {}
    }
    init()
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null }
  }, [])

  // 处理搜索
  useEffect(() => {
    if (!ready || !searchQuery || !mapRef.current) return
    ;(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&accept-language=zh`
        )
        const data = await res.json()
        if (!data?.length) { onSearchResult?.('', '未找到该地区'); return }

        const first = data[0]
        const lat = parseFloat(first.lat), lon = parseFloat(first.lon)

        mapRef.current.flyTo([lat, lon], Math.max(first.importance > 0.5 ? 10 : 5, 5))

        if (searchMarkerRef.current) mapRef.current.removeLayer(searchMarkerRef.current)
        const pin = L.marker([lat, lon], {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:#dc2626;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,.3)">🔍</div>`,
            iconSize: [28, 28], iconAnchor: [14, 28],
          })
        }).addTo(mapRef.current)
        pin.bindPopup(`<b>${first.display_name}</b>`).openPopup()
        searchMarkerRef.current = pin

        onSearchResult?.('search', first.display_name)
      } catch { onSearchResult?.('', '搜索失败') }
    })()
  }, [searchQuery])

  // 定位到用户
  const flyToUser = () => {
    if (mapRef.current && userLoc) {
      mapRef.current.flyTo([userLoc.lat, userLoc.lon], 12)
    }
  }

  return (
    <div className="relative">
      <div ref={containerRef} style={{ width: '100%', height: '68vh' }} className="z-0" />
      {userLoc && (
        <button onClick={flyToUser}
          className="absolute top-3 right-3 z-[1000] w-9 h-9 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="定位到我">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M22 12h-4M6 12H2"/></svg>
        </button>
      )}
      <style jsx>{`
        :global(.leaflet-popup-content-wrapper) { border-radius: 8px; font-size: 12px; }
        :global(.leaflet-popup-content) { margin: 8px 12px; }
        :global(.leaflet-container) { font-family: inherit; }
      `}</style>
    </div>
  )
}
