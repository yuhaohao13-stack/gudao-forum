'use client'

import Link from 'next/link'
import { Music, Headphones, ArrowRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'

export default function MusicPage() {
  // Emoji icons for each category
  const icons = ['📼', '🌊', '🎸', '🎤', '🌍', '🌙']

  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道' },
      ]} className="mb-3" />

      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎵</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">音乐频道</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">120 首精选</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {musicData.map((category, i) => (
          <Link key={category.id} href={`/music/${category.id}`}
            className="bg-white border border-[#ece8e0] rounded-lg px-3.5 py-3 hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base">{icons[i] || '🎵'}</span>
              <h3 className="text-xs font-semibold text-[#1a1a1a] leading-tight">
                {category.name.replace(/^.\s+/, '')}
              </h3>
            </div>
            <p className="text-[10px] text-[#999] leading-relaxed line-clamp-2">{category.description}</p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[9px] text-[#b0a898]">{category.songs.length} 首</span>
              <span className="text-[9px] text-[#b45309] opacity-0 group-hover:opacity-100 transition-opacity">
                进入 →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
