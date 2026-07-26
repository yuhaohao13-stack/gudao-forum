import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function getJson(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`fetch failed: ${url}`)
  return res.json()
}

export async function GET(request) {
  try {
    // 1. 从请求头获取客户端 IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || ''

    // 2. IP 定位（ipapi.co 免费版）
    let lat = 1.3521, lon = 103.8198 // 默认新加坡
    let city = '新加坡'

    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      try {
        const geo = await getJson(`https://ipapi.co/${ip}/json/`)
        if (geo.city) {
          city = geo.city
          if (geo.region) city = `${geo.city}`
          lat = geo.latitude || lat
          lon = geo.longitude || lon
        }
      } catch {
        // fallback 到默认
      }
    }

    // 3. Open-Meteo 天气
    let temp = 28, wmoCode = 0
    try {
      const wx = await getJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
      )
      if (wx.current_weather) {
        wmoCode = wx.current_weather.weathercode
        temp = Math.round(wx.current_weather.temperature)
      }
    } catch {
      // fallback
    }

    // 4. 天气转中文
    const weatherMap = {
      0: { text: '晴朗', emoji: '☀️' }, 1: { text: '大部晴朗', emoji: '☀️' },
      2: { text: '多云', emoji: '⛅' }, 3: { text: '阴天', emoji: '☁️' },
    }
    for (let i = 45; i <= 48; i++) weatherMap[i] = { text: '雾', emoji: '🌫️' }
    for (let i = 51; i <= 55; i++) weatherMap[i] = { text: '毛毛雨', emoji: '🌦️' }
    for (let i = 61; i <= 65; i++) weatherMap[i] = { text: '雨', emoji: '🌧️' }
    for (let i = 71; i <= 77; i++) weatherMap[i] = { text: '雪', emoji: '🌨️' }
    for (let i = 80; i <= 82; i++) weatherMap[i] = { text: '阵雨', emoji: '🌦️' }
    for (let i = 95; i <= 99; i++) weatherMap[i] = { text: '雷雨', emoji: '⛈️' }

    const info = weatherMap[wmoCode] || { text: '未知', emoji: '❓' }

    return NextResponse.json({ city, temp, ...info })
  } catch {
    return NextResponse.json({ city: '新加坡', temp: 28, text: '晴朗', emoji: '☀️' })
  }
}
