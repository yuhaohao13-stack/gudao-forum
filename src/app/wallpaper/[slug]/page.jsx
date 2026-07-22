'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import CATEGORIES, { getDesktopUrl, getMobileUrl } from '@/data/wallpapers'
import { ArrowLeft, Download, Lock, Loader2 } from 'lucide-react'

export default function WallpaperCategoryPage() {
  const { slug } = useParams()
  const { user, profile } = useAuth()
  const [downloading, setDownloading] = useState('')
  const [toast, setToast] = useState('')

  const category = CATEGORIES.find(c => c.id === slug)
  const memberLevel = profile?.membership_level || 'regular'
  const isMember = memberLevel === 'gold' || memberLevel === 'diamond'

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleDownload = async (catId, wpId, title, type) => {
    if (!user) { showToast('请先登录'); return }

    // 普通会员扣除500积分，会员免费
    if (!isMember) {
      const res = await fetch('/api/points/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'download' }) })
      const data = await res.json()
      if (!data.success) {
        showToast(data.message || '积分不足，下载需500积分')
        return
      }
      window.dispatchEvent(new CustomEvent('points-updated'))
    }

    const url = type === 'desktop' ? getDesktopUrl(catId, wpId) : getMobileUrl(catId, wpId)
    setDownloading(`${wpId}-${type}`)

    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${title}-${type === 'desktop' ? '桌面' : '手机'}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(blob), 5000)
      showToast('✅ 下载成功')
    } catch(e) {
      showToast('下载失败，请重试')
    }
    setTimeout(() => setDownloading(''), 2000)
  }

  const handleClick = (wpId, title, type) => {
    if (!user) { showToast('请先登录'); return }
    if (!isMember) { showToast('请升级会员后下载'); return }
    handleDownload(category.id, wpId, title, type)
  }

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-[#999]">分类不存在</p>
        <Link href="/wallpaper" className="text-[#b45309] hover:underline mt-2 inline-block">← 返回壁纸库</Link>
      </div>
    )
  }

  return (
    <div className="anim-fade-in max-w-4xl mx-auto pb-8">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '🎨 高清壁纸库', href: '/wallpaper' },
        { label: category.name },
      ]} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xl align-middle">{category.icon}</span>
          <h1 className="text-lg font-bold text-[#1c1917] inline-block ml-1">{category.name}</h1>
          <p className="text-xs text-[#888] mt-0.5">{category.desc}</p>
        </div>
        {!isMember && (
          <Link href="/lottery/upgrade"
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-medium hover:bg-amber-100 transition-colors shrink-0">
            <Lock size={11} className="inline-block align-text-bottom" /> 升级下载
          </Link>
        )}
      </div>

      {/* 缩略图网格：桌面版5张 + 手机版5张 */}
      {/* 桌面版行 */}
      <div className="mb-2">
        <p className="text-[10px] text-[#999] mb-1.5">🖥️ 桌面版（1920×1080）</p>
        <div className="grid grid-cols-5 gap-2">
          {category.wallpapers.map((wp, i) => (
            <div key={`desk-${wp.id}`} className="cursor-pointer group relative" onClick={() => handleClick(wp.id, wp.title, 'desktop')}>
              <div className="relative overflow-hidden rounded-lg border border-[#ece8e0] bg-[#faf8f5] aspect-video">
                <img src={getDesktopUrl(category.id, wp.id)} alt={wp.title}
                  className="w-full h-full object-cover"
                  loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 ${isMember ? 'bg-[#b45309] text-white' : 'bg-black/60 text-white'}`}>
                    {downloading === `${wp.id}-desktop` ? <Loader2 size={10} className="animate-spin" /> : isMember ? <Download size={10} /> : <Lock size={10} />}
                    {downloading === `${wp.id}-desktop` ? '中...' : isMember ? '下载' : '🔒'}
                  </span>
                </div>
                <span className="absolute bottom-1 left-1 text-[8px] px-1 py-0.5 rounded bg-black/50 text-white">#{i+1}</span>
              </div>
              <p className="text-[9px] text-[#888] mt-0.5 truncate">{wp.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 手机版行 */}
      <div>
        <p className="text-[10px] text-[#999] mb-1.5">📱 手机版（1080×1920）</p>
        <div className="grid grid-cols-5 gap-2">
          {category.wallpapers.map((wp, i) => (
            <div key={`mob-${wp.id}`} className="cursor-pointer group relative" onClick={() => handleClick(wp.id, wp.title, 'mobile')}>
              <div className="relative overflow-hidden rounded-lg border border-[#ece8e0] bg-[#faf8f5] aspect-video">
                <img src={getMobileUrl(category.id, wp.id)} alt={wp.title}
                  className="w-full h-full object-cover"
                  loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 ${isMember ? 'bg-[#b45309] text-white' : 'bg-black/60 text-white'}`}>
                    {downloading === `${wp.id}-mobile` ? <Loader2 size={10} className="animate-spin" /> : isMember ? <Download size={10} /> : <Lock size={10} />}
                    {downloading === `${wp.id}-mobile` ? '中...' : isMember ? '下载' : '🔒'}
                  </span>
                </div>
                <span className="absolute bottom-1 left-1 text-[8px] px-1 py-0.5 rounded bg-black/50 text-white">#{i+1}</span>
              </div>
              <p className="text-[9px] text-[#888] mt-0.5 truncate">{wp.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 非会员提示 */}
      {!isMember && (
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-[#888] mb-2">🔒 可预览壁纸，升级黄金/钻石会员后可下载保存</p>
          <Link href="/lottery/upgrade"
            className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:from-[#a04407] hover:to-[#c06806] transition-all">
            升级会员 →
          </Link>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1a1a1a] text-white text-xs shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
