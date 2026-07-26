import { NextResponse } from 'next/server'

export const runtime = 'edge'

async function getJson(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`fetch failed: ${url}`)
  return res.json()
}

export async function GET(request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || ''

    let lat = 1.3521, lon = 103.8198 // 默认新加坡
    let city = '新加坡'

    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      // ① 先试国内 IP 库（对中国 IP 定位最准）
      // 注意：pconline 返回 GBK 编码，需转 UTF-8
      let cnCity = ''
      try {
        const res = await fetch(`https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`, {
          signal: AbortSignal.timeout(3000),
        })
        if (res.ok) {
          const buf = await res.arrayBuffer()
          const text = new TextDecoder('gbk').decode(buf)
          const data = JSON.parse(text)
          // 返回: {"ip":"xxx","pro":"山东省","city":"威海市"}
          if (data.city) cnCity = data.city.replace(/[市]$/, '')
          if (data.pro && !cnCity) cnCity = data.pro
          if (cnCity) city = cnCity
        }
      } catch {}

      // ② ipinfo.io 获取经纬度（天气需要用坐标）
      try {
        const geo = await getJson(`https://ipinfo.io/${ip}/json`)
        const loc = (geo.loc || '').split(',')
        if (loc.length === 2) {
          lat = parseFloat(loc[0])
          lon = parseFloat(loc[1])
        }
        // 如果国内库没找到城市，用 ipinfo 的城市
        if (!cnCity) {
          const ipCity = geo.city || ''
          if (ipCity && !/[区县镇乡]/.test(ipCity)) {
            city = ipCity
          }
        }
      } catch {
        // ③ ipapi.co 兜底
        try {
          const geo = await getJson(`https://ipapi.co/${ip}/json/`)
          lat = geo.latitude || lat
          lon = geo.longitude || lon
          if (!cnCity && geo.city && !/[区县镇乡]/.test(geo.city)) {
            city = geo.city
          }
        } catch {}
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
    } catch {}

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

    let info = weatherMap[wmoCode] || { text: '未知', emoji: '❓' }

    // 夜间判断（19:00-06:59 显示月亮）
    try {
      const now = new Date()
      const hour = now.getHours()
      if (hour >= 19 || hour < 7) {
        if (wmoCode === 0) info = { text: '夜间晴', emoji: '🌙' }
        else if (wmoCode === 1 || wmoCode === 2) info = { text: '夜间', emoji: '🌙' }
      }
    } catch {}

    return NextResponse.json({ city, temp, ...info })
  } catch {
    return NextResponse.json({ city: '新加坡', temp: 28, text: '晴朗', emoji: '☀️' })
  }
}
