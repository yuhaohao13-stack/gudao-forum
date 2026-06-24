'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const [categories, setCategories] = useState([])
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
      setCategories(cats || [])

      // 最新帖子
      const { data: recent } = await supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
        .order('created_at', { ascending: false })
        .limit(20)
      setRecentThreads(recent || [])

      // 热门帖子（按回复数 + 点赞数排序）
      const { data: hot } = await supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
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
                  <span className="text-slate-500">{thread.categories?.name}</span>
                  <span className="text-slate-600">·</span>
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
    <div className="space-y-8">
      {/* 版块列表 */}
      <section>
        <h2 className="text-lg font-bold mb-3 text-slate-300">📂 版块</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/c/${cat.slug}`}
              className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-amber-500 transition-colors"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="font-semibold">{cat.name}</div>
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
          <ThreadList threads={recentThreads} />
        ) : (
          <ThreadList threads={hotThreads} />
        )}
      </section>
    </div>
  )
}
