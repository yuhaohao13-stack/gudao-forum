'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'
import CATEGORIES, { getDesktopUrl } from '@/data/wallpapers'
import { Image, Lock, Sparkles } from 'lucide-react'

export default function WallpaperPage() {
  const { user, profile } = useAuth()
  const memberLevel = profile?.membership_level || 'regular'
  const isMember = memberLevel === 'gold' || memberLevel === 'diamond'

  return (
    <div className="anim-fade-in max-w-4xl mx-auto pb-12">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '🎨 高清壁纸库' },
      ]} />

      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1c1917] mb-2">🎨 高清壁纸库</h1>
        <p className="text-sm text-[#888] max-w-xl mx-auto">
          精选十大分类高清壁纸，支持电脑桌面（1920×1080）和手机壁纸（1080×1920），会员可免费下载保存
        </p>
        {!isMember && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
            <Lock size={12} /> 升级会员可查看和下载壁纸
          </div>
        )}
      </div>

      {/* 分类网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={isMember ? `/wallpaper/${cat.id}` : '/lottery/upgrade'}
            className="group block bg-white border border-[#ece8e0] rounded-xl overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 hover:border-[#b45309]"
          >
            {/* 封面图 */}
            <div className="aspect-[16/10] bg-[#f5f0e8] overflow-hidden relative">
              <img
                src={getDesktopUrl(cat.wallpapers[0].seed)}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {!isMember && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Lock size={24} className="text-white" />
                </div>
              )}
            </div>
            {/* 信息 */}
            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{cat.icon}</span>
                <h3 className="font-semibold text-sm text-[#1c1917] truncate">{cat.name}</h3>
              </div>
              <p className="text-[10px] text-[#999] line-clamp-2 leading-relaxed">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 非会员提示 */}
      {!isMember && (
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 text-center">
          <Lock size={32} className="mx-auto text-amber-500 mb-2" />
          <h3 className="font-bold text-[#1c1917] text-base mb-1">升级会员，畅享高清壁纸</h3>
          <p className="text-xs text-[#888] mb-4">黄金/钻石会员可查看和下载全部高清壁纸，电脑端+手机端双版本</p>
          <Link href="/lottery/upgrade"
            className="inline-flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] text-white hover:from-[#a04407] hover:to-[#c06806] transition-all"
          >
            <Sparkles size={16} /> 了解会员权益
          </Link>
        </div>
      )}

      {/* SEO 关键词 */}
      <div className="mt-8 text-[10px] text-[#ccc] text-center leading-loose">
        高清壁纸 · 电脑壁纸 · 手机壁纸 · 4K壁纸 · 杂志封面 · 宇宙星空 · 人物写真 · 山川风景 · 
        四季壁纸 · 动漫壁纸 · 城市建筑 · 海洋壁纸 · 花鸟壁纸 · 极简壁纸 · 免费高清壁纸
      </div>
    </div>
  )
}
