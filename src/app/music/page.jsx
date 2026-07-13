'use client'

import Link from 'next/link'
import { Music, Headphones, ArrowRight } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'

export default function MusicPage() {
  return (
    <div className="anim-fade-in">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道' },
      ]} className="mb-4" />

      <div className="hero-section">
        <h1><Music size={24} className="inline-block align-text-bottom" /> 古道音乐频道</h1>
        <p className="tagline">
          好音乐，不设限。六大分类，120首精选，总有一首打动你。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {musicData.map(category => (
          <Link key={category.id} href={`/music/${category.id}`}
            className="bg-white border border-[#ece8e0] rounded-xl p-5 hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{category.name.split(' ')[0]}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1a1a1a]">
                  {category.name.replace(/^.\s+/, '')}
                </h3>
                <p className="text-xs text-[#aaa]">{category.subtitle}</p>
              </div>
              <Headphones size={18} className="text-[#b45309]/50 group-hover:text-[#b45309] transition-colors shrink-0" />
            </div>
            <p className="text-xs text-[#999] leading-relaxed">{category.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-[#b0a898]">{category.songs.length} 首歌曲</span>
              <span className="text-[10px] text-[#b45309] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                进入 <ArrowRight size={10} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
