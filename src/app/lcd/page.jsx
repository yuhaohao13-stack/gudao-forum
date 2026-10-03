'use client'
import { useState } from 'react'
import Link from 'next/link'
import Seo from '@/components/Seo'
import { Search, Monitor, Lock, Loader2, Cpu, CheckCircle2, Wrench } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { search, brandOf, groupKey } from '@/lib/lcd'
import db from '@/data/lcd-panels.json'

const SERIES = db.series || {}

function groupByBrand(list) {
  const g = {}
  for (const k of list) {
    const b = brandOf(k)
    if (!g[b]) g[b] = []
    g[b].push(k)
  }
  return Object.entries(g).sort((a, b) => b[1].length - a[1].length)
}

export default function LcdQueryPage() {
  const { user, loading } = useAuth()
  const [q, setQ] = useState('')
  const [res, setRes] = useState(null)
  const [busy, setBusy] = useState(false)

  const run = (e) => {
    e?.preventDefault()
    if (!q.trim()) return
    setBusy(true)
    setTimeout(() => { setRes(search(q)); setBusy(false) }, 120)
  }

  const samples = ['NV156FHM-N4V', 'LP140WH2', 'N156HCE-EAB', 'Inspiron 15 5510', '联想小新 15']

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Seo
        title="电脑液晶通用查询 - 液晶屏通用型号对照 | 古道论坛"
        description="输入液晶编号（如 NV156FHM-N4V、LP140WH2）或电脑型号，查询同规格可通用液晶屏型号与对应电脑品牌机型。注册会员免费使用。"
        keywords="电脑液晶通用查询,笔记本屏幕通用型号,液晶屏型号对照,NV156FHM 通用,laptop LCD panel compatibility,cross reference,古道论坛"
        url="https://www.gudaoforum.com/lcd"
      />

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-[#b45309] font-semibold text-xs mb-2">
          <Monitor size={15} /> LCD Panel Cross-Reference
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">电脑液晶通用查询</h1>
        <p className="text-sm text-[#888] mt-2 leading-relaxed">
          输入<b className="text-[#b45309]">液晶编号</b>（如 NV156FHM-N4V）或<b className="text-[#b45309]">电脑型号</b>（如 Inspiron 15 5510），
          <br className="hidden sm:block" />
          查出可用液晶型号 + 对应电脑品牌机型。
        </p>
      </div>

      {loading ? (
        <div className="text-center text-[#bbb] py-10"><Loader2 size={20} className="animate-spin inline" /></div>
      ) : !user ? (
        <div className="bg-white border border-[#eee8dc] rounded-2xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#f5f0e8] text-[#b45309] flex items-center justify-center mx-auto mb-3"><Lock size={22} /></div>
          <h2 className="font-bold text-[#1a1a1a]">会员专享查询</h2>
          <p className="text-sm text-[#888] mt-2 mb-5">液晶通用型号库开放给注册会员，注册后免费查询。</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="bg-[#c23531] hover:bg-[#a82b27] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">免费注册</Link>
            <Link href="/login" className="border border-[#e5ded2] hover:border-[#c23531] text-[#666] text-sm px-5 py-2.5 rounded-xl">登录</Link>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={run} className="bg-white border border-[#eee8dc] rounded-2xl p-3 flex gap-2 shadow-sm">
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="输入液晶编号或电脑型号…"
              className="flex-1 px-3 py-2.5 text-sm border border-[#eee8dc] rounded-xl focus:outline-none focus:border-[#b45309]" />
            <button type="submit" disabled={busy}
              className="bg-[#b45309] hover:bg-[#9a4607] text-white text-sm font-semibold px-5 rounded-xl flex items-center gap-1.5 disabled:opacity-60">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} 查询
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {samples.map((s) => (
              <button key={s} onClick={() => { setQ(s); setRes(search(s)) }}
                className="text-[11px] text-[#999] bg-[#f7f4ee] hover:bg-[#fdf2e8] hover:text-[#b45309] px-2.5 py-1 rounded-full">{s}</button>
            ))}
          </div>

          {res && <Result res={res} />}
        </>
      )}
    </div>
  )
}

function Result({ res }) {
  if (res.kind === 'none') {
    return (
      <div className="mt-6 bg-[#fdf6e8] border border-[#f0dfc0] rounded-2xl p-5 text-sm text-[#8b6914]">
        库里暂时没有 <b>{res.query}</b> 的记录 —— 在本帖回复实物丝印照片，我们补进库并回复你。
      </div>
    )
  }

  if (res.kind === 'panel') {
    const p = res.panel
    const groups = groupByBrand(res.compat)
    return (
      <div className="mt-6 space-y-4">
        <div className="bg-white border border-[#eee8dc] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-1"><CheckCircle2 size={14} /> 已收录</div>
          <div className="text-xl font-bold text-[#1a1a1a] font-mono">{p.code}</div>
          <div className="text-sm text-[#888] mt-0.5">{p.brand}</div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[p.group, `厚度 ≈${p.thick || '?'}mm`, p.touch ? '触摸屏' : '非触摸'].map((x, i) => (
              <span key={i} className="text-xs bg-[#f5f0e8] text-[#8b6914] px-2.5 py-1 rounded-full">{x}</span>
            ))}
          </div>
          {p.note && <div className="text-xs text-[#999] mt-3">{p.note}</div>}
        </div>

        <div className="bg-white border border-[#eee8dc] rounded-2xl p-5 shadow-sm">
          <div className="font-bold text-[#1a1a1a] text-sm mb-1">同规格可通用液晶（{res.compat.length} 个）</div>
          <div className="text-[11px] text-[#bbb] mb-3">判据：尺寸 + 分辨率 + 接口 + 针脚数；装机前仍需核对出线朝向 / 耳位 / 厚度</div>
          <div className="space-y-3">
            {groups.map(([b, list]) => (
              <div key={b}>
                <div className="text-xs font-semibold text-[#888] mb-1">{b}（{list.length}）</div>
                <div className="flex flex-wrap gap-1.5">
                  {list.map((k) => <span key={k} className="text-xs font-mono bg-[#f7f4ee] text-[#555] px-2 py-0.5 rounded">{k}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {res.machines.map((m, i) => {
        const spec = { size: m.size, res: m.res, iface: m.iface, pins: m.pins, touch: m.touch }
        const g = groupKey(spec)
        const compat = Object.keys(SERIES).filter((k) => groupKey(SERIES[k]) === g)
        return (
          <div key={i} className="bg-white border border-[#eee8dc] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-1.5 text-[#b45309] text-xs font-semibold mb-1"><Cpu size={14} /> 电脑机型</div>
            <div className="font-bold text-[#1a1a1a]">{m.name}</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[g, m.touch ? '触摸屏' : '非触摸'].map((x, j) => (
                <span key={j} className="text-xs bg-[#f5f0e8] text-[#8b6914] px-2.5 py-1 rounded-full">{x}</span>
              ))}
            </div>
            {m.note && <div className="text-xs text-[#999] mt-2">{m.note}</div>}
            {m.dellepart && <div className="text-xs text-[#999] mt-1">原厂备件号：{m.dellepart}</div>}
            <div className="text-xs font-semibold text-[#888] mt-4 mb-1">可用液晶（{compat.length} 个）</div>
            <div className="flex flex-wrap gap-1.5">
              {compat.map((k) => <span key={k} className="text-xs font-mono bg-[#f7f4ee] text-[#555] px-2 py-0.5 rounded">{k}</span>)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
