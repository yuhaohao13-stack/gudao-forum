'use client'
import { useState, useEffect } from 'react'

export default function WeatherBar() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchByIP() {
      const res = await fetch('/api/weather', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    }

    async function fetchByGPS(lat, lon) {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    }

    async function load() {
      try {
        // 先尝试浏览器 GPS 定位（手机用户精度高）
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 300000,
          })
        })
        const data = await fetchByGPS(pos.coords.latitude, pos.coords.longitude)
        if (!cancelled) setWeather(data)
        return
      } catch {
        // GPS 失败（用户拒绝/超时），fallback 到 IP 定位
        try {
          const data = await fetchByIP()
          if (!cancelled) setWeather(data)
        } catch {
          if (!cancelled) setError(true)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (!weather || error) return null

  return (
    <div className="flex flex-col items-start leading-tight text-lg text-[#aaa] shrink-0">
      <span className="flex items-center gap-2">
        <span className="text-3xl">{weather.emoji}</span>
        <span className="font-medium text-[#e8d5a3] text-2xl">{weather.temp}°</span>
        <span className="text-xl">{weather.text}</span>
      </span>
      <span className="text-sm text-[#bbb]">{weather.city}</span>
    </div>
  )
}
