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
    const fetchThread = async () => {
      const { data: t } = await supabase
        .from('threads')
        .select('*, profiles(username, display_name, role), categories(name, slug)')
        .eq('id', id)
        .single()

      if (t) {
        await supabase.from('threads').update({ view_count: (t.view_count || 0) + 1 }).eq('id', id)
        const { data: r } = await supabase
          .from('replies')
          .select('*, profiles(username, display_name)')
          .eq('thread_id', id)
          .order('created_at')
        setReplies(r || [])
        setThread({ ...t, view_count: (t.view_count || 0) + 1 })
      }
      setLoading(false)
    }
    fetchThread()
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
    const { error: err } = await supabase.from('replies').insert({
      thread_id: id, content: replyContent.trim(), author_id: user.id,
    })
    if (err) {
      setError(err.message)
    } else {
      await supabase.from('threads').update({ reply_count: replies.length + 1 }).eq('id', id)
      const { data: newReply } = await supabase
        .from('replies')
        .select('*, profiles(username, display_name)')
        .eq('thread_id', id)
        .order('created_at')
      setReplies(newReply || [])
      setReplyContent('')
    }
    setSending(false)
  }

  const toggleLike = async () => {
    if (!user) return
    if (liked) {
      await supabase.from('thread_likes').delete().eq('thread_id', id).eq('user_id', user.id)
      setLiked(false)
    } else {
      await supabase.from('thread_likes').insert({ thread_id: id, user_id: user.id })
      setLiked(true)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )
  if (!thread) return (
    <div className="text-center py-20 text-slate-500">
      <div className="text-4xl mb-3">🔍</div>
      <p>帖子不存在或已被删除</p>
      <Link href="/" className="text-amber-400 hover:underline mt-2 inline-block">返回首页</Link>
    </div>
  )

  return (
    <div className="fade-in">
      {/* 面包屑 */}
      <Link href={`/c/${thread.categories?.slug}`} className="text-sm text-amber-400/70 hover:text-amber-400 transition-colors">
        &larr; {thread.categories?.name}
      </Link>

      {/* 主帖 */}
      <article className="mt-3 glass-card p-5 sm:p-6 fade-in-up">
        <div className="flex items-center gap-2 mb-1">
          {(thread.profiles?.role === 'admin' || thread.profiles?.role === 'moderator') && (
            <span className="text-[10px] bg-amber-600/15 text-amber-400 border border-amber-700/20 px-1.5 py-0.5 rounded font-medium">👑 管理员</span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-100">{thread.title}</h1>
        <div className="flex items-center flex-wrap gap-2 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-[8px] text-white font-bold">
              {(thread.profiles?.display_name || thread.profiles?.username || '?')[0]}
            </span>
            {thread.profiles?.display_name || thread.profiles?.username}
          </span>
          <span className="text-slate-700">·</span>
          <span>{new Date(thread.created_at).toLocaleString('zh-CN')}</span>
        </div>

        <div className="mt-5 text-slate-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {thread.content}
        </div>

        {/* 图片 */}
        {thread.images && thread.images.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {thread.images.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-[45%] sm:w-[30%] group">
                <img
                  src={url} alt={`图片 ${i + 1}`}
                  className="w-full h-auto max-h-60 rounded-lg border border-slate-700/50 object-cover
                             group-hover:border-amber-500/50 group-hover:opacity-90 transition-all duration-200"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}

        {/* 互动栏 */}
        <div className="mt-5 pt-4 border-t border-slate-800/50 flex items-center gap-4 text-sm">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              liked ? 'text-red-400 bg-red-900/20' : 'text-slate-400 hover:text-red-400 hover:bg-red-900/10'
            }`}
          >
            {liked ? '❤️' : '🤍'} {liked ? '已赞' : '点赞'}
          </button>
          <span className="text-slate-500 flex items-center gap-1">💬 {replies.length} 回复</span>
          <span className="text-slate-500 flex items-center gap-1">👁️ {thread.view_count || 0} 浏览</span>
        </div>
      </article>

      {/* 回复列表 */}
      <div className="mt-6 fade-in-up">
        <h2 className="font-bold text-slate-400 mb-3 flex items-center gap-2">
          <span>💬 全部回复</span>
          <span className="text-xs text-slate-600 font-normal">({replies.length})</span>
        </h2>

        <div className="space-y-3">
          {replies.length === 0 && (
            <div className="text-center py-8 glass-card">
              <div className="text-2xl mb-2">🛋️</div>
              <p className="text-slate-500 text-sm">暂无回复，来抢沙发吧</p>
            </div>
          )}
          {replies.map((reply) => (
            <div key={reply.id} className="glass-card p-4 fade-in-scale">
              {reply.is_deleted ? (
                <p className="text-slate-500 italic text-sm">[该回复已被删除]</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[7px] text-slate-300 font-bold">
                      {(reply.profiles?.display_name || reply.profiles?.username || '?')[0]}
                    </span>
                    <span className="font-medium text-slate-300">{reply.profiles?.display_name || reply.profiles?.username}</span>
                    <span className="text-slate-700">·</span>
                    <span>{new Date(reply.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm">
                    {reply.content}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 回复框 */}
      {user ? (
        <form onSubmit={handleReply} className="mt-6 glass-card p-4 fade-in-up">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="input-field min-h-[100px] resize-none"
            placeholder="写下你的回复..."
          />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-slate-600">友善交流，尊重他人</span>
            <button
              type="submit"
              disabled={sending || !replyContent.trim()}
              className="btn-amber disabled:opacity-50 disabled:cursor-not-allowed !px-5 !py-2"
            >
              {sending ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  发送中...
                </span>
              ) : '发表回复'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 text-center py-5 glass-card">
          <p className="text-slate-400 text-sm">
            <Link href="/login" className="text-amber-400 hover:underline font-medium">登录</Link> 后可以回复
          </p>
        </div>
      )}
    </div>
  )
}
