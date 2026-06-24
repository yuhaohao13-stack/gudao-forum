'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function CategoryPage() {
  const { profile } = useAuth()
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [sortBy, setSortBy] = useState('latest')
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const isAnnouncements = slug === 'announcements'
  const supabase = createClient()

  useEffect(() => {
    const fetchCategory = async () => {
      const { data: cat } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()
      setCategory(cat)

      if (cat) {
        const order = sortBy === 'latest'
          ? { ascending: false }
          : { ascending: false }

        const { data } = await supabase
          .from('threads')
          .select('*, profiles(username, display_name)')
          .eq('category_id', cat.id)
          .order('is_pinned', { ascending: false })
          .order(sortBy === 'hot' ? 'reply_count' : 'created_at', { ascending: false })
        setThreads(data || [])
      }
    }
    fetchCategory()
  }, [slug, sortBy])

  if (!category) return <div className="text-center text-slate-500 py-12">加载中...</div>

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-amber-400 hover:underline">&larr; 返回首页</Link>
        <h1 className="text-2xl font-bold mt-1">{category.icon} {category.name}</h1>
        <p className="text-slate-400 text-sm mt-0.5">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'latest' ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            ⏱️ 最新
          </button>
          <button
            onClick={() => setSortBy('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortBy === 'hot' ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            🔥 最热
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isAnnouncements && !isAdmin && (
            <span className="text-xs text-slate-500 hidden sm:block">仅管理员可发帖</span>
          )}
          {(!isAnnouncements || isAdmin) && (
            <Link
              href="/new-thread"
              className="bg-amber-600 hover:bg-amber-500 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              ✏️ 发新帖
            </Link>
          )}
        </div>
      </div>
      {isAnnouncements && !isAdmin && (
        <div className="mb-4 text-center py-3 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">🔒 站务管理仅管理员可发帖</p>
        </div>
      )}

      <div className="space-y-2">
        {threads.length === 0 && (
          <p className="text-slate-500 text-center py-8">这里还没有帖子，来发第一条吧！</p>
        )}
        {threads.map((thread) => (
          <Link
            key={thread.id}
            href={`/t/${thread.id}`}
            className="block bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {thread.is_pinned && <span className="text-xs bg-yellow-600/30 text-yellow-400 px-1.5 py-0.5 rounded">📌 置顶</span>}
                  {thread.is_locked && <span className="text-xs bg-red-600/30 text-red-400 px-1.5 py-0.5 rounded">🔒 已锁</span>}
                  <h3 className="font-semibold truncate">{thread.title}</h3>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span>{thread.profiles?.display_name || thread.profiles?.username}</span>
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
    </div>
  )
}
