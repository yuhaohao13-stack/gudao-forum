'use client'
import { useState, useEffect } from 'react'

export default function WeatherBar() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!cancelled) setWeather(data)
      } catch {
        if (!cancelled) setError(true)
      }
    }

    fetchWeather()
    return () => { cancelled = true }
  }, [])

  // 加载中或失败时也不显示任何内容
  if (!weather || error) return null

  return (
    <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs text-[#666] bg-[#fafaf8] border-b border-[#f0f0f0]">
      <span className="text-sm leading-none">{weather.emoji}</span>
      <span className="font-medium">{weather.temp}°C</span>
      <span className="text-[#ccc]">·</span>
      <span>{weather.text}</span>
      <span className="text-[#ccc]">·</span>
      <span className="font-medium text-[#888]">{weather.city}</span>
    </div>
  )
}
