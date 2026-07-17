'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import CATEGORIES, { getDesktopUrl, getMobileUrl } from '@/data/wallpapers'
import { ArrowLeft, Download, Lock, Check, Loader2 } from 'lucide-react'

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

  const handleDownload = async (seed, title, type) => {
    if (!user) { showToast('请先登录'); return }
    if (!isMember) { showToast('请升级会员后下载'); return }

    const url = type === 'desktop' ? getDesktopUrl(seed) : getMobileUrl(seed)
    setDownloading(`${seed}-${type}`)

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

  if (!category) {
    return (
      <div className="text-center py-20">
        <p className="text-[#999]">分类不存在</p>
        <Link href="/wallpaper" className="text-[#b45309] hover:underline mt-2 inline-block">← 返回壁纸库</Link>
      </div>
    )
  }

  return (
    <div className="anim-fade-in max-w-5xl mx-auto pb-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '🎨 高清壁纸库', href: '/wallpaper' },
        { label: category.name },
      ]} />

      {/* 返回 + 标题 */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/wallpaper" className="inline-flex items-center gap-1 text-sm text-[#b45309] hover:underline">
          <ArrowLeft size={14} /> 返回壁纸库
        </Link>
        {!isMember && (
          <Link href="/lottery/upgrade"
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-medium hover:bg-amber-100 transition-colors">
            <Lock size={12} className="inline-block align-text-bottom" /> 升级会员下载
          </Link>
        )}
      </div>

      <div className="text-center mb-6">
        <span className="text-3xl mb-2 block">{category.icon}</span>
        <h1 className="text-xl font-bold text-[#1c1917]">{category.name}壁纸</h1>
        <p className="text-sm text-[#888] mt-1">{category.desc}</p>
      </div>

      {/* 壁纸列表 */}
      <div className="space-y-8">
        {category.wallpapers.map((wp, i) => (
          <div key={wp.id} className="bg-white border border-[#ece8e0] rounded-xl overflow-hidden">
            {/* 壁纸标题 */}
            <div className="px-4 py-3 border-b border-[#f0ede8] flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#1c1917]">
                <span className="text-[#b45309]">#{i + 1}</span> {wp.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-[#999]">
                <span>🖥️ 1920×1080</span>
                <span>📱 1080×1920</span>
              </div>
            </div>

            {/* 图片预览 - 双列 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
              {/* 桌面版 */}
              <div className="relative group">
                <img
                  src={getDesktopUrl(wp.seed)}
                  alt={`${wp.title} 桌面壁纸`}
                  className="w-full aspect-video object-cover rounded-lg border border-[#f0ede8]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                  {isMember ? (
                    <button
                      onClick={() => handleDownload(wp.seed, wp.title, 'desktop')}
                      disabled={downloading === `${wp.seed}-desktop`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg bg-[#b45309] text-white text-xs font-medium hover:bg-[#92400e] flex items-center gap-1.5"
                    >
                      {downloading === `${wp.seed}-desktop` ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      保存壁纸
                    </button>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs flex items-center gap-1.5">
                      <Lock size={12} /> 会员可下载
                    </div>
                  )}
                </div>
                <span className="absolute bottom-6 left-6 text-[10px] px-2 py-0.5 rounded bg-black/50 text-white">🖥️ 桌面</span>
              </div>

              {/* 手机版 */}
              <div className="relative group">
                <img
                  src={getMobileUrl(wp.seed)}
                  alt={`${wp.title} 手机壁纸`}
                  className="w-full aspect-[9/16] object-cover rounded-lg border border-[#f0ede8]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                  {isMember ? (
                    <button
                      onClick={() => handleDownload(wp.seed, wp.title, 'mobile')}
                      disabled={downloading === `${wp.seed}-mobile`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg bg-[#b45309] text-white text-xs font-medium hover:bg-[#92400e] flex items-center gap-1.5"
                    >
                      {downloading === `${wp.seed}-mobile` ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      保存壁纸
                    </button>
                  ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs flex items-center gap-1.5">
                      <Lock size={12} /> 会员可下载
                    </div>
                  )}
                </div>
                <span className="absolute bottom-6 left-6 text-[10px] px-2 py-0.5 rounded bg-black/50 text-white">📱 手机</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 非会员提示 */}
      {!isMember && (
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 text-center">
          <Lock size={28} className="mx-auto text-amber-500 mb-2" />
          <h3 className="font-bold text-[#1c1917] text-base mb-1">🔒 内容已锁定</h3>
          <p className="text-xs text-[#888] mb-3">升级黄金/钻石会员后可查看全部高清壁纸并下载保存</p>
          <Link href="/lottery/upgrade"
            className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:from-[#a04407] hover:to-[#c06806] transition-all">
            了解会员权益 →
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
