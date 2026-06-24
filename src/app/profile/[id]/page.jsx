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
        .from('threads')
        .select('*, categories(name, slug)')
        .eq('author_id', id)
        .order('created_at', { ascending: false })
        .limit(50)
      setThreads(t || [])
    }
    fetchProfile()
  }, [id])

  if (!profile) return <div className="text-center text-slate-500 py-12">加载中...</div>

  return (
    <div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
          {(profile.display_name || profile.username || '?')[0]}
        </div>
        <h1 className="text-xl font-bold mt-3">{profile.display_name || profile.username}</h1>
        <p className="text-slate-400 text-sm">@{profile.username}</p>
        {profile.bio && <p className="text-slate-300 text-sm mt-2">{profile.bio}</p>}
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
          <span>角色：{profile.role === 'admin' ? '管理员' : profile.role === 'moderator' ? '版主' : '用户'}</span>
          <span>·</span>
          <span>加入于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-bold text-slate-300 mb-3">发过的帖子 ({threads.length})</h2>
        <div className="space-y-2">
          {threads.length === 0 && (
            <p className="text-slate-500 text-center py-6">还没有发过帖子</p>
          )}
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/t/${thread.id}`}
              className="block bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{thread.title}</h3>
                  <div className="text-xs text-slate-400 mt-1">
                    <span className="text-slate-500">{thread.categories?.name}</span>
                    <span className="text-slate-600 mx-1">·</span>
                    <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  💬 {thread.reply_count || 0}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
