import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function getJson(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`fetch failed: ${url}`)
  return res.json()
}

export async function GET(request) {
  try {
    // 1. 从 URL 参数获取 GPS 经纬度（浏览器定位，最准）
    const { searchParams } = new URL(request.url)
    const gpsLat = searchParams.get('lat')
    const gpsLon = searchParams.get('lon')

    let lat = 1.3521, lon = 103.8198 // 默认新加坡
    let city = '新加坡'

    if (gpsLat && gpsLon) {
      // 有 GPS → 直接用，跳过 IP 定位
      lat = parseFloat(gpsLat)
      lon = parseFloat(gpsLon)

      // 用 Nominatim 反向查城市名
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=zh`,
          { headers: { 'User-Agent': 'GudaoForum/1.0 (weather)' } }
        )
        if (nomRes.ok) {
          const nom = await nomRes.json()
          const addr = nom?.address || {}
          const raw = (addr.city || '')
          if (raw && !/[区县镇乡]/.test(raw)) {
            city = raw.replace(/[市]$/, '')
          }
        }
      } catch {}
    } else {
      // 没有 GPS → 走 IP 定位（备用）
      const forwarded = request.headers.get('x-forwarded-for')
      const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || ''

      if (ip && ip !== '::1' && ip !== '127.0.0.1') {
        try {
          const geo = await getJson(`https://ipinfo.io/${ip}/json`)
          const loc = (geo.loc || '').split(',')
          if (loc.length === 2) {
            lat = parseFloat(loc[0])
            lon = parseFloat(loc[1])
            city = geo.city || ''
          }
        } catch {
          try {
            const geo = await getJson(`https://ipapi.co/${ip}/json/`)
            lat = geo.latitude || lat
            lon = geo.longitude || lon
            city = geo.city || ''
          } catch {}
        }
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
