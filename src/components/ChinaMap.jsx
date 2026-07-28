'use client'

import { useEffect, useRef, useState } from 'react'

export default function ChinaMap({ onReady }) {
  const containerRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!containerRef.current) return
    let map = null

    async function init() {
      try {
        const leaf = await import('leaflet')
        await import('leaflet/dist/leaflet.css')
        const L = leaf.default || leaf

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        if (!containerRef.current) return

        map = L.map(containerRef.current, {
          center: [35.86, 104.19],
          zoom: 4,
          minZoom: 3,
          zoomControl: false,
        })

        // 高德地图瓦片 — 国内可访问，无需 Key
        L.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
          attribution: '&copy; 高德地图',
          maxZoom: 18,
          subdomains: ['01', '02', '03', '04'],
        }).addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)
        onReady?.(map, L)
        setTimeout(() => map.invalidateSize(), 300)
      } catch (e) {
        console.error('Map error:', e)
        setError(e.message || '加载失败')
      }
    }

    init()
    return () => { map?.remove() }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 border border-red-200 rounded-xl" style={{ height: '400px' }}>
        <div className="text-red-600 text-sm text-center px-4">❌ 地图加载失败<br/><span className="text-xs">{error}</span></div>
      </div>
    )
  }

  return <div ref={containerRef} style={{ width: '100%', height: '480px' }} className="z-0 rounded-lg" />
}
