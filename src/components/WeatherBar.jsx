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

  if (!weather || error) return null

  return (
    <div className="flex flex-col items-start leading-tight text-[11px] text-[#aaa] shrink-0">
      <span className="flex items-center gap-1">
        <span className="text-sm">{weather.emoji}</span>
        <span>{weather.text}</span>
      </span>
      <span className="text-[10px] text-[#bbb]">{weather.city}</span>
    </div>
  )
}
