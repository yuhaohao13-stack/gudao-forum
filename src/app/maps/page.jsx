'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, MapPin, Globe, ChevronRight } from 'lucide-react'

export default function MapsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* 返回首页 */}
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#c23531] mb-4 transition-colors">
          <ArrowLeft size={14} /> 返回首页
        </Link>

        <h1 className="text-lg font-bold text-[#1c1917] mb-1">🗺️ 地图浏览</h1>
        <p className="text-xs text-[#888] mb-6">探索中国与世界的行政区划地图，搜索定位你感兴趣的地区</p>

        {/* 中国地图卡片 */}
        <Link href="/maps/china">
          <div className="bg-white rounded-xl border border-[#e5ddd5] overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 mb-4">
            <div className="flex">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#dc2626] to-[#ea580c] flex items-center justify-center text-3xl shrink-0">
                🌏
              </div>
              <div className="flex-1 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#1c1917]">中国地图</div>
                  <div className="text-[11px] text-[#888] mt-1">
                    34个省市区 · 搜索定位 · 双指缩放
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#ccc]" />
              </div>
            </div>
          </div>
        </Link>

        {/* 世界地图卡片 */}
        <Link href="/maps/world">
          <div className="bg-white rounded-xl border border-[#e5ddd5] overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#2563eb] to-[#0891b2] flex items-center justify-center text-3xl shrink-0">
                🌍
              </div>
              <div className="flex-1 px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#1c1917]">世界地图</div>
                  <div className="text-[11px] text-[#888] mt-1">
                    200+国家和地区 · 搜索定位 · 双指缩放
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#ccc]" />
              </div>
            </div>
          </div>
        </Link>

        {/* 提示 */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>💡 使用提示：</strong>
            <br />• 搜索框输入地名，点击搜索自动定位
            <br />• 双指捏合可放大缩小地图
            <br />• 点击地图上的区域可查看名称
          </div>
        </div>

      </div>
    </div>
  )
}
