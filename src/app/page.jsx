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
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) {
        const [ann] = sorted.splice(annIdx, 1)
        sorted.unshift(ann)
      }
      setCategories(sorted)

      const annCat = sorted.find(c => c.slug === 'announcements')
      if (annCat) {
        const { data: annThreads } = await supabase
          .from('threads')
          .select('*, profiles(username, display_name)')
          .eq('category_id', annCat.id)
          .order('created_at', { ascending: false })
          .limit(5)
        setAnnouncements(annThreads || [])
      }

      const annCatId = annCat?.id
      let recentQuery = supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
      if (annCatId) recentQuery = recentQuery.neq('category_id', annCatId)
      const { data: recent } = await recentQuery
        .order('created_at', { ascending: false })
        .limit(20)
      setRecentThreads(recent || [])

      let hotQuery = supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
      if (annCatId) hotQuery = hotQuery.neq('category_id', annCatId)
      const { data: hot } = await hotQuery
        .order('reply_count', { ascending: false })
        .limit(20)
      setHotThreads(hot || [])
    }
    fetchData()
  }, [])

  const ThreadCard = ({ thread }) => (
    <Link
      href={`/t/${thread.id}`}
      className="post-card fade-in-up group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors duration-200 truncate">
            {thread.title}
          </h3>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[7px] text-slate-300 font-bold">
                {(thread.profiles?.display_name || thread.profiles?.username || '?')[0]}
              </span>
              {thread.profiles?.display_name || thread.profiles?.username}
            </span>
            {thread.categories && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-slate-500">{thread.categories?.name}</span>
              </>
            )}
            <span className="text-slate-700">·</span>
            <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1" title="回复">
            💬 <span className="font-medium">{thread.reply_count || 0}</span>
          </span>
          <span className="flex items-center gap-1" title="浏览">
            👁️ <span className="font-medium">{thread.view_count || 0}</span>
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="space-y-8">
      {/* 欢迎语 */}
      <div className="text-center py-2 fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">欢迎来到古道论坛</h1>
        <p className="text-slate-500 text-sm mt-1">自由讨论，友善交流</p>
      </div>

      {/* 公告 */}
      {announcements.length > 0 && (
        <section className="fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-sm font-bold">📢 站务公告</span>
            <span className="text-[10px] bg-gradient-to-r from-amber-600 to-amber-500 text-white px-1.5 py-0.5 rounded-full font-medium">置顶</span>
          </div>
          <div className="space-y-2">
            {announcements.map((thread, i) => (
              <Link
                key={thread.id}
                href={`/t/${thread.id}`}
                className={`post-card-announcement fade-in-up group ${i > 0 ? `stagger-${i}` : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">📌</span>
                      <h3 className="font-semibold truncate text-amber-100 group-hover:text-amber-300 transition-colors">
                        {thread.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="text-amber-400/60">
                        {thread.profiles?.display_name || thread.profiles?.username}
                      </span>
                      <span className="text-slate-700">·</span>
                      <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <span>💬 {thread.reply_count || 0}</span>
                    <span>👁️ {thread.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 版块网格 */}
      <section className="fade-in-up">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">探索版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/c/${cat.slug}`}
              className={`glass-card-hover fade-in-scale ${i > 0 ? `stagger-${i}` : ''}`}
              style={i > 0 ? {} : {}}
            >
              <div className="text-2xl mb-1.5">{cat.icon}</div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                {cat.name}
                {cat.slug === 'announcements' && (
                  <span className="text-[9px] bg-amber-600/20 text-amber-400 border border-amber-700/30 px-1 py-0.5 rounded">
                    公告
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 帖子 Tab */}
      <section className="fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'recent'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            ⏱️ 最新
          </button>
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'hot'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            🔥 热门
          </button>
          <Link
            href="/search"
            className="ml-auto btn-ghost flex items-center gap-1 text-xs"
          >
            🔍 搜索
          </Link>
        </div>

        {activeTab === 'recent' ? (
          recentThreads.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm">还没有帖子</p>
              <Link href="/new-thread" className="btn-amber inline-block mt-3">发第一条帖子</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentThreads.map((thread, i) => (
                <div key={thread.id} className={i > 0 ? `stagger-${Math.min(i, 5)}` : ''}>
                  <ThreadCard thread={thread} />
                </div>
              ))}
            </div>
          )
        ) : (
          hotThreads.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-sm">还没有热门帖子</p>
            </div>
          ) : (
            <div className="space-y-2">
              {hotThreads.map((thread, i) => (
                <div key={thread.id} className={i > 0 ? `stagger-${Math.min(i, 5)}` : ''}>
                  <ThreadCard thread={thread} />
                </div>
              ))}
            </div>
          )
        )}
      </section>
    </div>
  )
}
