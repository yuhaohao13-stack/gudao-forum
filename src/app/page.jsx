'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [recentThreads, setRecentThreads] = useState([])
  const [hotThreads, setHotThreads] = useState([])
  const [activeTab, setActiveTab] = useState('recent')
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) { const [ann] = sorted.splice(annIdx, 1); sorted.unshift(ann) }
      setCategories(sorted)
      const annCat = sorted.find(c => c.slug === 'announcements')
      if (annCat) {
        const { data: annThreads } = await supabase.from('threads')
          .select('*, profiles(username, display_name)').eq('category_id', annCat.id)
          .order('created_at', { ascending: false }).limit(5)
        setAnnouncements(annThreads || [])
      }
      const annCatId = annCat?.id
      let rq = supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
      if (annCatId) rq = rq.neq('category_id', annCatId)
      const { data: recent } = await rq.order('created_at', { ascending: false }).limit(20)
      setRecentThreads(recent || [])
      let hq = supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
      if (annCatId) hq = hq.neq('category_id', annCatId)
      const { data: hot } = await hq.order('reply_count', { ascending: false }).limit(20)
      setHotThreads(hot || [])
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      {/* 站训 */}
      <div className="text-center py-3 fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-[#2c2c2c]">古道论坛</h1>
        <div className="w-12 h-0.5 bg-[#c23531] mx-auto mt-2 opacity-60" />
        <p className="text-[#8c8c8c] text-sm mt-2 tracking-wider">以文会友 · 以友辅仁</p>
      </div>

      {/* 公告 */}
      {announcements.length > 0 && (
        <section className="fade-in-up">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-sm font-bold text-[#c23531]">📢 站务公告</span>
            <span className="text-[10px] bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20 px-1.5 py-0.5 rounded font-medium">置顶</span>
          </div>
          <div className="space-y-2">
            {announcements.map((thread, i) => (
              <Link key={thread.id} href={`/t/${thread.id}`}
                className={`thread-card-announcement fade-in-up group ${i > 0 ? `stagger-${i}` : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#c23531]">📌</span>
                      <h3 className="font-semibold text-[#2c2c2c] group-hover:text-[#c23531] transition-colors truncate">{thread.title}</h3>
                    </div>
                    <div className="text-xs text-[#8c8c8c] mt-0.5 ml-0.5">
                      {thread.profiles?.display_name || thread.profiles?.username}
                      <span className="mx-1">·</span>
                      {new Date(thread.created_at).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#8c8c8c] shrink-0">
                    <span>{thread.reply_count || 0}</span>
                    <span>{thread.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 版块 */}
      <section className="fade-in-up">
        <h2 className="text-xs font-bold text-[#8c8c8c] uppercase tracking-widest mb-3">探索版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/c/${cat.slug}`}
              className={`paper-card-hover p-4 fade-in-scale ${i > 0 ? `stagger-${i}` : ''}`}
            >
              <div className="text-2xl mb-1.5">{cat.icon}</div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                {cat.name}
                {cat.slug === 'announcements' && (
                  <span className="text-[9px] bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20 px-1 py-0.5 rounded">公告</span>
                )}
              </div>
              <div className="text-xs text-[#8c8c8c] mt-0.5 line-clamp-1">{cat.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 帖子 */}
      <section className="fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'recent' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white/60 text-[#666] hover:text-[#c23531] border border-[#e0d8c8]'
            }`}
          >⏱️ 最新</button>
          <button onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'hot' ? 'bg-[#c23531] text-white shadow-sm' : 'bg-white/60 text-[#666] hover:text-[#c23531] border border-[#e0d8c8]'
            }`}
          >🔥 热门</button>
          <Link href="/search" className="ml-auto btn-ink flex items-center gap-1 text-xs">🔍 搜索</Link>
        </div>

        <div className="space-y-2">
          {(activeTab === 'recent' ? recentThreads : hotThreads).length === 0 ? (
            <div className="text-center py-12 paper-card">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-[#8c8c8c] text-sm">还没有帖子</p>
              <Link href="/new-thread" className="btn-red inline-block mt-3">发第一条帖子</Link>
            </div>
          ) : (
            (activeTab === 'recent' ? recentThreads : hotThreads).map((thread, i) => (
              <Link key={thread.id} href={`/t/${thread.id}`}
                className={`thread-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#2c2c2c] group-hover:text-[#c23531] transition-colors truncate">{thread.title}</h3>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-[#8c8c8c]">
                      <span>{thread.profiles?.display_name || thread.profiles?.username}</span>
                      {thread.categories && <><span className="text-[#d8d0c0]">/</span><span>{thread.categories?.name}</span></>}
                      <span className="text-[#d8d0c0]">/</span>
                      <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#8c8c8c] shrink-0">
                    <span>{thread.reply_count || 0}</span>
                    <span>{thread.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
