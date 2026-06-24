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
        const { data } = await supabase
          .from('threads')
          .select('*, profiles!inner(username, display_name, role)')
          .eq('category_id', cat.id)
          .order('is_pinned', { ascending: false })
          .order(sortBy === 'hot' ? 'reply_count' : 'created_at', { ascending: false })

        // 管理员帖子排前面
        const sorted = (data || []).sort((a, b) => {
          const aAdmin = a.profiles?.role === 'admin' || a.profiles?.role === 'moderator'
          const bAdmin = b.profiles?.role === 'admin' || b.profiles?.role === 'moderator'
          if (a.is_pinned && !b.is_pinned) return -1
          if (!a.is_pinned && b.is_pinned) return 1
          if (aAdmin && !bAdmin) return -1
          if (!aAdmin && bAdmin) return 1
          return 0
        })
        setThreads(sorted)
      }
    }
    fetchCategory()
  }, [slug, sortBy])

  if (!category) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="fade-in">
      {/* 顶部导航 */}
      <div className="mb-6">
        <Link href="/" className="text-sm text-amber-400/70 hover:text-amber-400 transition-colors">
          &larr; 返回首页
        </Link>
        <h1 className="text-2xl font-bold text-gradient mt-1">{category.icon} {category.name}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{category.description}</p>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'latest'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⏱️ 最新
          </button>
          <button
            onClick={() => setSortBy('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'hot'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
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
            <Link href="/new-thread" className="btn-amber !px-3 !py-1.5 text-xs sm:!px-4 sm:!py-2 sm:text-sm">
              ✏️ 发新帖
            </Link>
          )}
        </div>
      </div>

      {isAnnouncements && !isAdmin && (
        <div className="mb-4 text-center py-4 glass-card">
          <p className="text-slate-400 text-sm">🔒 站务管理仅管理员可发帖</p>
        </div>
      )}

      {/* 帖子列表 */}
      <div className="space-y-2">
        {threads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-slate-500 text-sm">这里还没有帖子</p>
            {(!isAnnouncements || isAdmin) && (
              <Link href="/new-thread" className="btn-amber inline-block mt-3">发第一条帖子</Link>
            )}
          </div>
        ) : (
          threads.map((thread, i) => (
            <Link
              key={thread.id}
              href={`/t/${thread.id}`}
              className={`post-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {thread.is_pinned && (
                      <span className="text-[10px] bg-yellow-600/20 text-yellow-400 border border-yellow-700/30 px-1.5 py-0.5 rounded font-medium">
                        📌 置顶
                      </span>
                    )}
                    {(thread.profiles?.role === 'admin' || thread.profiles?.role === 'moderator') && !thread.is_pinned && (
                      <span className="text-[10px] bg-amber-600/15 text-amber-400 border border-amber-700/20 px-1.5 py-0.5 rounded font-medium">
                        👑 管理员
                      </span>
                    )}
                    {thread.is_locked && (
                      <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-700/30 px-1.5 py-0.5 rounded font-medium">
                        🔒 已锁
                      </span>
                    )}
                    <h3 className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                      {thread.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[7px] text-slate-300 font-bold">
                        {(thread.profiles?.display_name || thread.profiles?.username || '?')[0]}
                      </span>
                      {thread.profiles?.display_name || thread.profiles?.username}
                    </span>
                    <span className="text-slate-700">·</span>
                    <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-500 shrink-0">
                  <span className="flex items-center gap-1">💬 <span className="font-medium">{thread.reply_count || 0}</span></span>
                  <span className="flex items-center gap-1">👁️ <span className="font-medium">{thread.view_count || 0}</span></span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
