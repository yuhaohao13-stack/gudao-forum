'use client'
import { useState, useEffect } from 'react'

export default function WeatherBar() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const CACHE_KEY = 'gudaoforum_weather'
    const CACHE_TTL = 10 * 60 * 1000 // 10分钟

    // 先读缓存
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, time } = JSON.parse(cached)
        if (Date.now() - time < CACHE_TTL) {
          setWeather(data)
        }
      } catch {}
    }

    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        if (!cancelled) {
          setWeather(data)
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: Date.now() }))
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    fetchWeather()
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
