'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { BookOpen, Search, FilterX } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import POEMS, { CATEGORIES } from '@/data/poetry'

export default function PoetryPage() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let list = POEMS
    if (activeCategory) {
      list = list.filter(p => p.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeCategory, searchQuery])

  const hasFilter = activeCategory || searchQuery.trim()

  return (
    <div className="anim-fade-in max-w-4xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '唐诗三百首' },
      ]} className="mb-3" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📜</span>
        <h1 className="text-base font-bold text-[#1a1a1a]">唐诗三百首</h1>
        <span className="text-[10px] text-[#b0a898] ml-auto">{POEMS.length} 首精选</span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b0a898]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索诗名、作者或诗句…"
          className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-[#ece8e0] rounded-lg
                     focus:outline-none focus:border-[#b45309]/50 focus:ring-1 focus:ring-[#b45309]/20
                     placeholder-[#c5bdb0] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0a898] hover:text-[#666] transition-colors"
          >
            <FilterX size={14} />
          </button>
        )}
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border
            ${!activeCategory
              ? 'bg-[#b45309] text-white border-[#b45309] shadow-sm'
              : 'bg-white text-[#888] border-[#ece8e0] hover:border-[#b45309]/30 hover:text-[#b45309]'
            }`}
        >
          全部
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-all border
              ${activeCategory === cat
                ? 'bg-[#b45309] text-white border-[#b45309] shadow-sm'
                : 'bg-white text-[#888] border-[#ece8e0] hover:border-[#b45309]/30 hover:text-[#b45309]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter status */}
      {hasFilter && (
        <div className="mb-3 flex items-center gap-2 text-[10px] text-[#888]">
          <span>
            {activeCategory && <>分类：<span className="text-[#b45309] font-medium">{activeCategory}</span></>}
            {searchQuery.trim() && (
              <>{activeCategory && ' · '}搜索：<span className="text-[#b45309] font-medium">「{searchQuery.trim()}」</span></>
            )}
          </span>
          <span className="text-[#b0a898]">· 共 {filtered.length} 首</span>
          <button
            onClick={() => { setActiveCategory(null); setSearchQuery('') }}
            className="ml-auto text-[#b45309] hover:underline"
          >
            清除筛选
          </button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-3"><BookOpen size={36} className="inline-block text-[#ddd]" /></div>
          <p className="text-sm text-[#999]">没有找到匹配的诗作</p>
          <button
            onClick={() => { setActiveCategory(null); setSearchQuery('') }}
            className="mt-2 text-[11px] text-[#b45309] hover:underline"
          >
            查看全部
          </button>
        </div>
      )}

      {/* Poem grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {filtered.map(poem => (
          <Link
            key={poem.id}
            href={`/poetry/${poem.id}`}
            className="bg-white border border-[#ece8e0] rounded-lg px-3 py-2.5
                       hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5
                       transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-xs font-semibold text-[#1a1a1a] leading-tight line-clamp-1">
                {poem.title}
              </h3>
              {poem.title.length <= 4 && (
                <span className="text-[9px] text-[#b45309] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                  →
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#b0a898] font-medium mb-1.5">{poem.author}</p>
            <p className="text-[10px] text-[#888] leading-relaxed line-clamp-2">
              {poem.content.split('\n')[0]}
              {poem.content.includes('\n') && <>…</>}
            </p>
            <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-[8px] font-medium
              ${poem.category === '山水田园' ? 'bg-green-50 text-green-700' :
                poem.category === '边塞征战' ? 'bg-red-50 text-red-700' :
                poem.category === '咏物言志' ? 'bg-blue-50 text-blue-700' :
                poem.category === '送别友情' ? 'bg-purple-50 text-purple-700' :
                poem.category === '思乡怀人' ? 'bg-orange-50 text-orange-700' :
                'bg-amber-50 text-amber-700'}`}
            >
              {poem.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
