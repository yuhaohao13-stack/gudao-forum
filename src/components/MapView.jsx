'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView({ center, zoom, minZoom }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return
    try {
      const map = L.map(containerRef.current, { center, zoom, minZoom, zoomControl: false })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      mapRef.current = map
      setTimeout(() => { map.invalidateSize(); setReady(true) }, 200)
    } catch (e) { console.error('Map init error:', e) }
    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [])

  return <div ref={containerRef} style={{ width:'100%', height:'400px' }} className="z-0 rounded-xl border border-[#e5ddd5]" />
}
