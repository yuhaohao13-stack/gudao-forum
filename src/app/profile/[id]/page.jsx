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
    supabase.from('profiles').select('*').eq('id', id).single().then(({ data }) => {
      setProfile(data)
      if (data) supabase.from('threads').select('*, categories(name, slug)').eq('author_id', id).order('created_at', { ascending: false }).limit(50).then(({ data: t }) => setThreads(t || []))
    })
  }, [id])

  if (!profile) return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="fade-in">
      <div className="paper-card p-6 sm:p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#c23531] flex items-center justify-center text-2xl font-bold text-white shadow-sm">
          {(profile.display_name || profile.username || '?')[0]}
        </div>
        <h1 className="text-xl font-bold text-[#2c2c2c] mt-3">{profile.display_name || profile.username}</h1>
        <p className="text-[#8c8c8c] text-sm">@{profile.username}</p>
        {profile.bio && <p className="text-[#555] text-sm mt-2">{profile.bio}</p>}
        <div className="flex items-center justify-center gap-3 mt-3 text-xs">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${profile.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' : profile.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' : 'text-[#8c8c8c]'}`}>
            {profile.role === 'admin' ? '👑 管理员' : profile.role === 'moderator' ? '🛡️ 版主' : '👤 用户'}
          </span>
          <span className="text-[#d8d0c0]">·</span>
          <span className="text-[#8c8c8c]">加入于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-bold text-[#666] mb-3 flex items-center gap-2">
          <span>📝 发过的帖子</span>
          <span className="text-xs text-[#b0a898] font-normal">({threads.length})</span>
        </h2>
        {threads.length === 0 ? (
          <div className="text-center py-8 paper-card"><div className="text-2xl mb-2">📭</div><p className="text-[#8c8c8c] text-sm">还没有发过帖子</p></div>
        ) : (
          <div className="space-y-2">
            {threads.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`thread-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#2c2c2c] group-hover:text-[#c23531] transition-colors truncate">{t.title}</h3>
                    <div className="text-xs text-[#8c8c8c] mt-0.5">{t.categories?.name} <span className="text-[#d8d0c0]">·</span> {new Date(t.created_at).toLocaleDateString('zh-CN')}</div>
                  </div>
                  <div className="text-xs text-[#8c8c8c] shrink-0">💬 {t.reply_count || 0}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
