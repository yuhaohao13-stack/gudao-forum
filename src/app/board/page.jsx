'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { FileText, MessageCircle, Eye, Megaphone, Monitor, Flower2, Package, BookOpen, ChevronLeft } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

const CAT_ICONS = {
  announcements: <Megaphone size={20} className="inline-block" />,
  random: <MessageCircle size={20} className="inline-block" />,
  tech: <Monitor size={20} className="inline-block" />,
  life: <Flower2 size={20} className="inline-block" />,
  resources: <Package size={20} className="inline-block" />,
  fiction: <BookOpen size={20} className="inline-block" />,
}

export default function BoardPage() {
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({})
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) { const [a] = sorted.splice(annIdx, 1); sorted.unshift(a) }
      setCategories(sorted)

      // 查每个板块的帖子数和浏览数
      const statMap = {}
      for (const c of sorted) {
        const { count: pc } = await supabase.from('threads').select('*', { count: 'exact', head: true }).eq('category_id', c.id)
        const { data: v } = await supabase.from('threads').select('view_count').eq('category_id', c.id)
        statMap[c.id] = {
          posts: pc || 0,
          views: (v || []).reduce((s, t) => s + (t.view_count || 0), 0),
        }
      }
      setStats(statMap)
    }
    fetch()
  }, [])

  return (
    <div className="anim-fade-in max-w-3xl mx-auto">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '板块列表' },
      ]} />

      <h1 className="text-xl font-bold text-[#1a1a1a] mt-2 mb-1">📋 论坛板块</h1>
      <p className="text-xs text-[#aaa] mb-6">选择一个板块浏览讨论</p>

      <div className="space-y-2">
        {categories.map(c => {
          const s = stats[c.id] || { posts: 0, views: 0 }
          return (
            <Link key={c.id} href={`/c/${c.slug}`}
              className="block bg-white border border-[#ece8e0] rounded-xl px-4 py-3.5 transition-all hover:border-[#b45309]/40 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] flex items-center justify-center text-lg shrink-0">
                  {CAT_ICONS[c.slug] || <FileText size={20} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#1a1a1a]">{c.name}</span>
                    {c.slug === 'announcements' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#b8860b]/10 text-[#b8860b] font-medium">公告</span>}
                  </div>
                  <div className="text-xs text-[#888] mt-0.5">{c.description}</div>
                  <div className="flex items-center gap-3 text-[10px] text-[#aaa] mt-1">
                    <span><MessageCircle size={11} className="inline align-text-bottom" /> {s.posts} 帖</span>
                    <span><Eye size={11} className="inline align-text-bottom" /> {s.views.toLocaleString()} 浏览</span>
                  </div>
                </div>
                <span className="text-[#b45309] text-xs shrink-0">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
