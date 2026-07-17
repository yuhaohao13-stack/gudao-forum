'use client'

'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import CATEGORIES from '@/data/wallpapers'
import { Lock, Sparkles } from 'lucide-react'

export default function WallpaperPage() {
  const { user, profile } = useAuth()
  const memberLevel = profile?.membership_level || 'regular'
  const isMember = memberLevel === 'gold' || memberLevel === 'diamond'

  return (
    <div className="anim-fade-in max-w-3xl mx-auto pb-8">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '🎨 高清壁纸库' },
      ]} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-bold text-[#1c1917]">🎨 高清壁纸库</h1>
          <p className="text-xs text-[#888]">十大分类 · 电脑+手机双版本 · 会员免费下载</p>
        </div>
        {!isMember && (
          <Link href="/lottery/upgrade"
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-medium hover:bg-amber-100 transition-colors shrink-0">
            <Lock size={11} className="inline-block align-text-bottom" /> 升级下载
          </Link>
        )}
      </div>

      {/* 紧凑分类网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={isMember ? `/wallpaper/${cat.id}` : '/lottery/upgrade'}
            className="flex flex-col items-center gap-1.5 py-3 px-2 bg-white border border-[#ece8e0] rounded-xl transition-all hover:border-[#b45309] hover:shadow-sm hover:-translate-y-0.5"
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-xs font-semibold text-[#1c1917] text-center">{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* 非会员提示 */}
      {!isMember && (
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 text-center">
          <p className="text-xs text-[#888] mb-3">🔒 升级黄金/钻石会员后可查看全部壁纸并下载保存</p>
          <Link href="/lottery/upgrade"
            className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:from-[#a04407] hover:to-[#c06806] transition-all">
            <Sparkles size={16} /> 了解会员权益
          </Link>
        </div>
      )}

      <div className="mt-6 text-[9px] text-[#ccc] text-center leading-loose">
        高清壁纸 · 电脑壁纸 · 手机壁纸 · 4K壁纸 · 杂志封面 · 宇宙星空 · 人物写真 · 山川风景 ·
        四季壁纸 · 动漫壁纸 · 城市建筑 · 海洋壁纸 · 花鸟壁纸 · 极简壁纸
      </div>
    </div>
  )
}
