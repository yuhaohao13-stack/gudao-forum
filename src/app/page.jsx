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
      // 把站务管理放到最前面
      const sorted = cats || []
      const annIdx = sorted.findIndex(c => c.slug === 'announcements')
      if (annIdx > 0) {
        const [ann] = sorted.splice(annIdx, 1)
        sorted.unshift(ann)
      }
      setCategories(sorted)

      // 公告帖
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

      // 最新帖子（排除公告版块）
      const annCatId = annCat?.id
      let recentQuery = supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
      if (annCatId) {
        recentQuery = recentQuery.neq('category_id', annCatId)
      }
      const { data: recent } = await recentQuery
        .order('created_at', { ascending: false })
        .limit(20)
      setRecentThreads(recent || [])

      // 热门帖子
      let hotQuery = supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
      if (annCatId) {
        hotQuery = hotQuery.neq('category_id', annCatId)
      }
      const { data: hot } = await hotQuery
        .order('reply_count', { ascending: false })
        .limit(20)
      setHotThreads(hot || [])
    }
    fetchData()
  }, [])

  const ThreadList = ({ threads, emptyText }) => (
    threads.length === 0 ? (
      <p className="text-slate-500 text-center py-8">{emptyText || '还没有帖子，快来发第一条吧！'}</p>
    ) : (
      <div className="space-y-2">
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/t/${thread.id}`}
            className="block bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{thread.title}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>{thread.profiles?.display_name || thread.profiles?.username || '匿名'}</span>
                  <span className="text-slate-600">·</span>
                  {thread.categories && (
                    <><span className="text-slate-500">{thread.categories?.name}</span><span className="text-slate-600">·</span></>
                  )}
                  <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                <span>💬 {thread.reply_count || 0}</span>
                <span>👁️ {thread.view_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  )

  return (
    <div className="space-y-6">
      {/* 公告区 */}
      {announcements.length > 0 && (
        <section className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4">
          <h2 className="text-sm font-bold text-amber-400 mb-2">📢 站务公告</h2>
          <div className="space-y-1">
            {announcements.map((thread) => (
              <Link
                key={thread.id}
                href={`/t/${thread.id}`}
                className="block text-sm text-slate-200 hover:text-amber-400 transition-colors py-1"
              >
                <span className="text-amber-500 mr-1">▶</span>
                {thread.title}
                <span className="text-xs text-slate-500 ml-2">
                  {new Date(thread.created_at).toLocaleDateString('zh-CN')}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 版块列表 */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-slate-300">📂 版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/c/${cat.slug}`}
              className={`bg-slate-900 border rounded-xl p-4 hover:border-amber-500 transition-colors ${
                cat.slug === 'announcements' ? 'border-amber-700 bg-amber-950/20' : 'border-slate-700'
              }`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="font-semibold">
                {cat.name}
                {cat.slug === 'announcements' && (
                  <span className="ml-1.5 text-[10px] bg-amber-600 text-white px-1 py-0.5 rounded">公告</span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{cat.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 帖子列表 Tab */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'recent' ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            ⏱️ 最新
          </button>
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'hot' ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            🔥 热门
          </button>
          <Link
            href="/search"
            className="ml-auto px-3 py-1.5 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            🔍 搜索
          </Link>
        </div>

        {activeTab === 'recent' ? (
          <ThreadList threads={recentThreads} emptyText="还没有帖子，快来发第一条吧！" />
        ) : (
          <ThreadList threads={hotThreads} emptyText="还没有热门帖子" />
        )}
      </section>
    </div>
  )
}
