// 电脑液晶通用查询 —— 纯逻辑（无 React 依赖，服务端/客户端都可用）
import db from '../data/lcd-panels.json'

const SERIES = db.series || {}
const MACHINES = db.machines || {}

const norm = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '')

const NORM = {}
for (const k of Object.keys(SERIES)) NORM[norm(k)] = k
const KEYS = Object.keys(NORM).sort((a, b) => b.length - a.length)

export const BRANDS = db.brands || {}

export function brandOf(key) {
  const p = Object.keys(BRANDS).sort((a, b) => b.length - a.length).find((x) => key.startsWith(x))
  return p ? BRANDS[p] : '其他'
}

export function groupKey(s) {
  return `${s.size}" ${s.res} ${s.iface} ${s.pins}pin${s.touch ? ' 触摸' : ''}`
}

export function matchSeries(code) {
  const n = norm(code)
  if (!n) return null
  if (NORM[n]) return NORM[n]
  for (const k of KEYS) if (n.startsWith(k) && k.length >= 6) return NORM[k]
  for (const cut of [1, 2]) {
    if (n.length > cut) {
      const nn = n.slice(0, -cut)
      for (const k of KEYS) if (nn.startsWith(k) && k.length >= 6) return NORM[k]
    }
  }
  return null
}

export function matchMachine(code) {
  const raw = String(code || '').trim().toLowerCase()
  const q = norm(code)
  if (!raw) return []
  return Object.entries(MACHINES).filter(([name]) => {
    const low = name.toLowerCase()
    const n = norm(name)
    if (raw.length >= 2 && low.includes(raw)) return true
    if (q.length >= 4 && n.includes(q)) return true
    return false
  })
}

export function compatList(key) {
  const s = SERIES[key]
  if (!s) return []
  const g = groupKey(s)
  return Object.keys(SERIES).filter((k) => k !== key && groupKey(SERIES[k]) === g)
}

/** 查询入口：先按液晶型号，再按电脑型号；返回结构化结果或 null */
export function search(input) {
  const raw = String(input || '').trim()
  if (!raw) return null

  const key = matchSeries(raw)
  if (key) {
    const s = SERIES[key]
    return {
      kind: 'panel',
      query: raw,
      panel: { code: key, brand: brandOf(key), ...s, group: groupKey(s) },
      compat: compatList(key),
    }
  }

  const machines = matchMachine(raw)
  if (machines.length) {
    return {
      kind: 'machine',
      query: raw,
      machines: machines.map(([name, m]) => ({ name, ...m })),
    }
  }

  return { kind: 'none', query: raw }
}
