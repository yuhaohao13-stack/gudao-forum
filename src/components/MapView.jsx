'use client'

import { useEffect, useRef, useState } from 'react'

export default function MapView({ center, zoom, minZoom, searchQuery, onSearchResult, userLoc }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const searchMarkerRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 注入 Leaflet CSS
    if (!document.getElementById('lcss')) {
      const link = document.createElement('link')
      link.id = 'lcss'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // 加载 Leaflet JS（使用全局 script）
    if (!window.L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => {
        setLoaded(true)
      }
      document.body.appendChild(script)
    } else {
      setLoaded(true)
    }
  }, [])

  // 创建地图
  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return
    const L = window.L

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const map = L.map(containerRef.current, {
      center,
      zoom,
      minZoom,
      zoomControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map

    // 等待容器渲染完成
    setTimeout(() => map.invalidateSize(), 100)

    // IP定位
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const lat = data.latitude, lon = data.longitude
        const city = data.city || '', country = data.country_name || ''
        if (lat && lon) {
          L.marker([lat, lon], {
            icon: L.divIcon({
              className: '',
              html: `<div style="background:#2563eb;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,.3);border:2px solid white">📍</div>`,
              iconSize: [24, 24], iconAnchor: [12, 24],
            })
          }).addTo(map).bindPopup(`<b>📍 您的位置</b><br/>${city}, ${country}`)
          onSearchResult?.('userLoc', { lat, lon, label: `${city}, ${country}` })
        }
      })
      .catch(() => {})

    return () => { map.remove(); mapRef.current = null }
  }, [loaded])

  // 搜索
  useEffect(() => {
    if (!mapRef.current || !searchQuery) return
    const L = window.L
    ;(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`)
        if (!res.ok) throw new Error()
        const geo = await res.json()
        const features = geo?.features
        if (!features?.length) { onSearchResult?.('', '未找到'); return }
        const f = features[0], [lon, lat] = f.geometry.coordinates
        const p = f.properties
        const name = [p.name, p.city, p.state, p.country].filter(Boolean).join(', ')
        mapRef.current.flyTo([lat, lon], 9)
        if (searchMarkerRef.current) mapRef.current.removeLayer(searchMarkerRef.current)
        const pin = L.marker([lat, lon], {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:#dc2626;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,.3)">🔍</div>`,
            iconSize: [24, 24], iconAnchor: [12, 24],
          })
        }).addTo(mapRef.current)
        pin.bindPopup(`<b>${name}</b>`).openPopup()
        searchMarkerRef.current = pin
        onSearchResult?.('search', name)
      } catch { onSearchResult?.('', '搜索失败') }
    })()
  }, [searchQuery])

  const flyToUser = () => {
    if (mapRef.current && userLoc) mapRef.current.flyTo([userLoc.lat, userLoc.lon], 12)
  }

  return (
    <div className="relative">
      <div ref={containerRef} style={{ width: '100%', height: '380px' }} className="z-0 rounded-lg" />
      {userLoc && (
        <button onClick={flyToUser}
          className="absolute top-2 right-2 z-[1000] w-8 h-8 bg-white rounded-lg shadow-md border flex items-center justify-center hover:bg-gray-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M22 12h-4M6 12H2"/></svg>
        </button>
      )}
    </div>
  )
}
