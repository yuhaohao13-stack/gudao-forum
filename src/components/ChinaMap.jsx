'use client'

import { useEffect, useRef, useState } from 'react'

export default function ChinaMap({ onReady }) {
  const containerRef = useRef(null)
  const [error, setError] = useState('')
  const [usingOSM, setUsingOSM] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    let map = null, tileLayer = null, cancelled = false

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

        if (!containerRef.current || cancelled) return

        map = L.map(containerRef.current, {
          center: [35.86, 104.19],
          zoom: 4,
          minZoom: 3,
          zoomControl: false,
        })
        L.control.zoom({ position: 'bottomright' }).addTo(map)

        // 默认用高德瓦片（国内流畅）
        const gaodeUrl = 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        tileLayer = L.tileLayer(gaodeUrl, {
          attribution: '&copy; 高德地图',
          maxZoom: 18,
        }).addTo(map)

        // 检测瓦片是否加载失败 → 切换到 OSM
        let fallbackDone = false
        map.on('tileerror', () => {
          if (fallbackDone || cancelled) return
          fallbackDone = true
          console.log('高德瓦片加载失败，切换到 OSM')
          map.removeLayer(tileLayer)
          tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 19,
          }).addTo(map)
          setUsingOSM(true)
        })

        setTimeout(() => map.invalidateSize(), 300)
        onReady?.(map, L)
      } catch (e) {
        if (!cancelled) setError(e.message || '加载失败')
      }
    }

    init()
    return () => { cancelled = true; map?.remove() }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 border border-red-200 rounded-xl" style={{ height: '400px' }}>
        <div className="text-red-600 text-sm text-center px-4">❌ 地图加载失败<br/><span className="text-xs">{error}</span></div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={containerRef} style={{ width: '100%', height: '480px' }} className="z-0 rounded-lg" />
      {usingOSM && (
        <div className="absolute top-2 left-2 z-[1000] bg-blue-500/80 text-white text-[10px] px-2 py-1 rounded-md">
          🌐 海外模式 · 已切换到 OpenStreetMap
        </div>
      )}
    </div>
  )
}
