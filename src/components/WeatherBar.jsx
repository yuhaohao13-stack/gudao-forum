'use client'
import { useState, useEffect } from 'react'

// 天气emoji映射
const weatherEmoji = {
  'clear': '☀️',
  'partly-cloudy': '⛅',
  'cloudy': '☁️',
  'overcast': '☁️',
  'fog': '🌫️',
  'drizzle': '🌦️',
  'rain': '🌧️',
  'heavy-rain': '🌧️',
  'thunderstorm': '⛈️',
  'snow': '🌨️',
  'sleet': '🌨️',
}

// WMO天气代码 → 中文描述
function wmoToWeather(code) {
  if (code === 0) return { text: '晴朗', emoji: '☀️' }
  if (code === 1) return { text: '大部晴朗', emoji: '☀️' }
  if (code === 2) return { text: '多云', emoji: '⛅' }
  if (code === 3) return { text: '阴天', emoji: '☁️' }
  if (code >= 45 && code <= 48) return { text: '雾', emoji: '🌫️' }
  if (code >= 51 && code <= 55) return { text: '毛毛雨', emoji: '🌦️' }
  if (code >= 56 && code <= 57) return { text: '冻雨', emoji: '🌧️' }
  if (code >= 61 && code <= 65) return { text: '雨', emoji: '🌧️' }
  if (code >= 66 && code <= 67) return { text: '冻雨', emoji: '🌧️' }
  if (code >= 71 && code <= 77) return { text: '雪', emoji: '🌨️' }
  if (code >= 80 && code <= 82) return { text: '阵雨', emoji: '🌦️' }
  if (code >= 85 && code <= 86) return { text: '阵雪', emoji: '🌨️' }
  if (code >= 95 && code <= 99) return { text: '雷雨', emoji: '⛈️' }
  return { text: '未知', emoji: '❓' }
}

export default function WeatherBar() {
  const [weather, setWeather] = useState(null)
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchWeather() {
      try {
        // 1. IP定位
        const ipRes = await fetch('https://ipapi.co/json/', { cache: 'no-cache' })
        if (!ipRes.ok) throw new Error('IP定位失败')
        const ipData = await ipRes.json()
        if (cancelled) return
        if (!ipData.city) throw new Error('未获取到城市')

        const cityName = `${ipData.city}`
        setCity(cityName)

        // 2. 获取天气（Open-Meteo）
        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current_weather=true&timezone=auto`,
          { cache: 'no-cache' }
        )
        if (!wxRes.ok) throw new Error('天气获取失败')
        const wxData = await wxRes.json()
        if (cancelled) return

        const wmoCode = wxData.current_weather?.weathercode
        const temp = Math.round(wxData.current_weather?.temperature ?? 0)
        const info = wmoToWeather(wmoCode)

        setWeather({ temp, text: info.text, emoji: info.emoji })
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchWeather()
    return () => { cancelled = true }
  }, [])

  if (loading || error) return null

  return (
    <div className="flex items-center justify-center gap-2 py-1.5 text-xs text-[#666] bg-[#fafaf8] border-b border-[#f0f0f0]">
      {weather && (
        <>
          <span className="text-sm leading-none">{weather.emoji}</span>
          <span className="font-medium">{weather.temp}°C</span>
          <span className="text-[#999]">·</span>
          <span>{weather.text}</span>
          <span className="text-[#999]">·</span>
        </>
      )}
      <span className="font-medium text-[#888]">{city}</span>
    </div>
  )
}
