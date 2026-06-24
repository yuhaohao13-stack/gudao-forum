'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function ThreadPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [liked, setLiked] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: t } = await supabase.from('threads')
        .select('*, profiles(username, display_name, role), categories(name, slug)').eq('id', id).single()
      if (t) {
        await supabase.from('threads').update({ view_count: (t.view_count || 0) + 1 }).eq('id', id)
        const { data: r } = await supabase.from('replies').select('*, profiles(username, display_name)').eq('thread_id', id).order('created_at')
        setReplies(r || []); setThread({ ...t, view_count: (t.view_count || 0) + 1 })
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  useEffect(() => {
    if (!user) return
    supabase.from('thread_likes').select('*').eq('thread_id', id).eq('user_id', user.id).single()
      .then(({ data }) => setLiked(!!data))
  }, [user, id])

  const handleReply = async (e) => {
    e.preventDefault()
    setError('')
    if (!replyContent.trim()) return
    setSending(true)
    const { error: err } = await supabase.from('replies').insert({ thread_id: id, content: replyContent.trim(), author_id: user.id })
    if (err) { setError(err.message) } else {
      await supabase.from('threads').update({ reply_count: replies.length + 1 }).eq('id', id)
      const { data: r } = await supabase.from('replies').select('*, profiles(username, display_name)').eq('thread_id', id).order('created_at')
      setReplies(r || []); setReplyContent('')
    }
    setSending(false)
  }

  const toggleLike = async () => {
    if (!user) return
    if (liked) { await supabase.from('thread_likes').delete().eq('thread_id', id).eq('user_id', user.id); setLiked(false) }
    else { await supabase.from('thread_likes').insert({ thread_id: id, user_id: user.id }); setLiked(true) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>
  if (!thread) return <div className="text-center py-20 text-[#999]"><div className="text-3xl mb-3">🔍</div><p>帖子不存在</p><Link href="/" className="text-[#c23531] hover:underline mt-2 inline-block">返回首页</Link></div>

  return (
    <div className="anim-fade-in">
      <Link href={`/c/${thread.categories?.slug}`} className="text-sm text-[#c23531]/70 hover:text-[#c23531] transition-colors">&larr; {thread.categories?.name}</Link>

      <article className="mt-3 card p-6 sm:p-8 anim-up">
        {(thread.profiles?.role === 'admin' || thread.profiles?.role === 'moderator') && (
          <span className="meta-tag bg-[#c23531]/10 text-[#c23531] border border-[#c23531]/20 mb-2">👑 管理员</span>
        )}
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1a1a1a] leading-snug">{thread.title}</h1>
        <div className="flex items-center gap-2 mt-3 text-xs text-[#999]">
          <span className="w-6 h-6 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
            {(thread.profiles?.display_name || thread.profiles?.username || '?')[0]}
          </span>
          <span className="font-medium text-[#666]">{thread.profiles?.display_name || thread.profiles?.username}</span>
          <span className="text-[#ddd6c8]">·</span>
          <span>{new Date(thread.created_at).toLocaleString('zh-CN')}</span>
        </div>

        <div className="my-6 h-px bg-[#f0e8dc]" />

        <div className="text-[#333] leading-7 sm:leading-8 whitespace-pre-wrap text-sm sm:text-base">
          {thread.content}
        </div>

        {thread.images?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {thread.images.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-[45%] sm:w-[30%] group">
                <img src={url} alt="" className="w-full h-auto max-h-60 object-cover rounded-xl border border-[#eee8dc] group-hover:border-[#c23531]/40 group-hover:opacity-90 transition-all" loading="lazy" />
              </a>
            ))}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-[#f0e8dc] flex items-center gap-4 text-sm">
          <button onClick={toggleLike}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${liked ? 'text-[#c23531] bg-[#c23531]/10 border border-[#c23531]/20' : 'text-[#999] border border-[#eee8dc] hover:text-[#c23531] hover:border-[#c23531]/30'}`}>
            {liked ? '❤️' : '🤍'} <span className="font-medium">{liked ? '已赞' : '点赞'}</span>
          </button>
          <span className="stat">💬 <span className="stat-num">{replies.length}</span> 回复</span>
          <span className="stat">👁️ <span className="stat-num">{thread.view_count || 0}</span> 浏览</span>
        </div>
      </article>

      <div className="mt-6 anim-up">
        <h2 className="font-semibold text-sm text-[#666] mb-3">💬 全部回复<span className="font-normal text-[#bbb] ml-1">({replies.length})</span></h2>
        <div className="space-y-3">
          {replies.length === 0 ? (
            <div className="card p-8 text-center"><div className="text-2xl mb-2">🛋️</div><p className="text-[#999] text-sm">暂无回复</p></div>
          ) : replies.map((r, i) => (
            <div key={r.id} className={`card p-4 sm:p-5 anim-scale ${i > 0 ? `anim-delay-${Math.min(i, 3)}` : ''}`}>
              {r.is_deleted ? (
                <p className="text-[#ccc] italic text-sm">[该回复已被删除]</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-[#999] mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#ddd6c8] flex items-center justify-center text-[8px] text-white font-bold">
                      {(r.profiles?.display_name || r.profiles?.username || '?')[0]}
                    </span>
                    <span className="font-medium text-[#666]">{r.profiles?.display_name || r.profiles?.username}</span>
                    <span className="text-[#ddd6c8]">·</span>
                    <span>{new Date(r.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="text-[#333] leading-7 whitespace-pre-wrap text-sm">{r.content}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {user ? (
        <form onSubmit={handleReply} className="mt-6 card p-5 anim-up">
          <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)}
            className="input min-h-[100px] resize-none" placeholder="写下你的回复..." />
          {error && <p className="text-[#c23531] text-xs mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-[#ccc]">以文会友，友善交流</span>
            <button type="submit" disabled={sending || !replyContent.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed !px-5 !py-2"
            >{sending ? '发送中...' : '发表回复'}</button>
          </div>
        </form>
      ) : (
        <div className="mt-6 card p-5 text-center">
          <p className="text-[#999] text-sm"><Link href="/login" className="text-[#c23531] hover:underline font-medium">登录</Link> 后可以回复</p>
        </div>
      )}
    </div>
  )
}
