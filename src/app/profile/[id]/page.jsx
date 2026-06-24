'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [threads, setThreads] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single()
      setProfile(p)
      const { data: t } = await supabase
        .from('threads').select('*, categories(name, slug)')
        .eq('author_id', id).order('created_at', { ascending: false }).limit(50)
      setThreads(t || [])
    }
    fetchProfile()
  }, [id])

  if (!profile) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="fade-in">
      {/* 用户卡片 */}
      <div className="glass-card p-6 sm:p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-amber-900/30">
          {(profile.display_name || profile.username || '?')[0]}
        </div>
        <h1 className="text-xl font-bold text-slate-100 mt-3">{profile.display_name || profile.username}</h1>
        <p className="text-slate-500 text-sm">@{profile.username}</p>
        {profile.bio && <p className="text-slate-300 text-sm mt-2">{profile.bio}</p>}
        <div className="flex items-center justify-center gap-3 mt-3 text-xs">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            profile.role === 'admin' ? 'bg-amber-600/20 text-amber-400 border border-amber-700/30'
            : profile.role === 'moderator' ? 'bg-green-600/20 text-green-400 border border-green-700/30'
            : 'text-slate-500'}`
          }>
            {profile.role === 'admin' ? '👑 管理员' : profile.role === 'moderator' ? '🛡️ 版主' : '👤 用户'}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">加入于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="mt-6">
        <h2 className="font-bold text-slate-400 mb-3 flex items-center gap-2">
          <span>📝 发过的帖子</span>
          <span className="text-xs text-slate-600 font-normal">({threads.length})</span>
        </h2>

        {threads.length === 0 ? (
          <div className="text-center py-8 glass-card">
            <div className="text-2xl mb-2">📭</div>
            <p className="text-slate-500 text-sm">还没有发过帖子</p>
          </div>
        ) : (
          <div className="space-y-2">
            {threads.map((thread, i) => (
              <Link key={thread.id} href={`/t/${thread.id}`}
                className={`post-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors truncate">{thread.title}</h3>
                    <div className="text-xs text-slate-500 mt-1">
                      <span className="text-slate-500">{thread.categories?.name}</span>
                      <span className="text-slate-700 mx-1">·</span>
                      <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 shrink-0 flex items-center gap-2">
                    <span>💬 {thread.reply_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
