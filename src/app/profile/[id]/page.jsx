'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null); const [threads, setThreads] = useState([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', id).single().then(({ data }) => {
      setProfile(data)
      if (data) supabase.from('threads').select('*, categories(name, slug)').eq('author_id', id).order('created_at', { ascending: false }).limit(50).then(({ data: t }) => setThreads(t || []))
    })
  }, [id])

  if (!profile) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <div className="card p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#c23531] flex items-center justify-center text-3xl font-bold text-white shadow-sm">
          {(profile.display_name || profile.username || '?')[0]}
        </div>
        <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mt-4">{profile.display_name || profile.username}</h1>
        <p className="text-[#999] text-sm">@{profile.username}</p>
        {profile.bio && <p className="text-[#666] text-sm mt-2">{profile.bio}</p>}
        <div className="flex items-center justify-center gap-3 mt-3 text-xs">
          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${profile.role === 'admin' ? 'bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20' : profile.role === 'moderator' ? 'bg-[#8b6914]/10 text-[#8b6914] border border-[#8b6914]/20' : 'text-[#999]'}`}>
            {profile.role === 'admin' ? '👑 管理员' : profile.role === 'moderator' ? '🛡️ 版主' : '👤 用户'}
          </span>
          <span className="text-[#ddd6c8]">·</span>
          <span className="text-[#999]">加入于 {new Date(profile.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold text-sm text-[#666] mb-3">📝 发过的帖子<span className="font-normal text-[#bbb] ml-1">({threads.length})</span></h2>
        {threads.length === 0 ? (
          <div className="card p-8 text-center"><div className="text-2xl mb-2">📭</div><p className="text-[#999] text-sm">还没有发过帖子</p></div>
        ) : (
          <div className="space-y-2.5">
            {threads.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`} className={`post-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
                <div className="text-[#1a1a1a]">
                  <div className="font-semibold truncate">{t.title}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-[#999] truncate min-w-0">
                      {t.categories?.name} <span className="text-[#ddd6c8] mx-1.5">·</span> {new Date(t.created_at).toLocaleDateString('zh-CN')}
                    </div>
                    <div className="text-xs text-[#bbb] shrink-0 ml-3">💬 {t.reply_count || 0}</div>
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
