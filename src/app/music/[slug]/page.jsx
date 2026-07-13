'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Headphones } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import musicData from '@/data/music'

export default function MusicCategoryPage() {
  const { slug } = useParams()
  const category = musicData.find(c => c.id === slug)

  if (!category) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="mb-3"><Headphones size={40} className="inline-block text-[#ccc]" /></div>
        <p className="text-[#999]">该分类不存在</p>
        <Link href="/music" className="text-[#b45309] hover:underline mt-2 inline-block">返回音乐频道</Link>
      </div>
    )
  }

  return (
    <div className="anim-fade-in">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '音乐频道', href: '/music' },
        { label: category.name.replace(/^.\s+/, '') },
      ]} className="mb-4" />

      <div className="flex items-center gap-3 mb-6">
        <Link href="/music" className="text-[#b45309]/60 hover:text-[#b45309] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-2xl">{category.name.split(' ')[0]}</span>
        <div>
          <h1 className="text-lg font-bold text-[#1a1a1a]">{category.name.replace(/^.\s+/, '')}</h1>
          <p className="text-xs text-[#aaa]">{category.description}</p>
        </div>
      </div>

      <div className="space-y-1">
        {category.songs.map((song, i) => (
          <Link key={song.id} href={`/music/song/${category.id}/${song.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-[#ece8e0] hover:border-[#b45309]/30 hover:bg-[#fcfaf7] transition-all duration-150 group">
            <span className="text-xs text-[#b0a898] w-5 text-right shrink-0 font-mono">{i + 1}</span>
            <div className="w-8 h-8 rounded-full bg-[#f5f0e8] flex items-center justify-center shrink-0 group-hover:bg-[#b45309] group-hover:text-white transition-colors">
              <Play size={14} className="ml-0.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] truncate">{song.title}</p>
              <p className="text-[11px] text-[#999]">{song.artist}</p>
            </div>
            <span className="text-[10px] text-[#b0a898]">MP3</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
