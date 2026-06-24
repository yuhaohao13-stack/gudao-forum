'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

export default function ThreadPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [liked, setLiked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchThread = async () => {
      const { data: t } = await supabase
        .from('threads')
        .select('*, profiles(username, display_name), categories(name, slug)')
        .eq('id', id)
        .single()

      if (t) {
        // 增加浏览量
        await supabase.rpc('increment_view_count', { thread_id: id }).catch(() => {})
        await supabase.from('threads').update({ view_count: (t.view_count || 0) + 1 }).eq('id', id)

        const { data: r } = await supabase
          .from('replies')
          .select('*, profiles(username, display_name)')
          .eq('thread_id', id)
          .order('created_at')
        setReplies(r || [])
        setThread(t)
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
    if (!replyContent.trim()) return
    setSending(true)

    const { error } = await supabase.from('replies').insert({
      thread_id: id,
      content: replyContent.trim(),
      author_id: user.id,
    })

    if (!error) {
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

  if (loading) return <div className="text-center text-slate-500 py-12">加载中...</div>
  if (!thread) return <div className="text-center text-slate-500 py-12">帖子不存在</div>

  return (
    <div>
      <Link href={`/c/${thread.categories?.slug}`} className="text-sm text-blue-400 hover:underline">
        &larr; {thread.categories?.name}
      </Link>

      {/* 主帖 */}
      <article className="mt-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h1 className="text-xl font-bold">{thread.title}</h1>
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
          <span>{thread.profiles?.display_name || thread.profiles?.username}</span>
          <span className="text-slate-600">·</span>
          <span>{new Date(thread.created_at).toLocaleString('zh-CN')}</span>
        </div>
        <div className="mt-4 text-slate-200 leading-relaxed whitespace-pre-wrap">
          {thread.content}
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
          <button onClick={toggleLike} className={`flex items-center gap-1 ${liked ? 'text-red-400' : 'hover:text-red-400'} transition-colors`}>
            {liked ? '❤️' : '🤍'} 点赞
          </button>
          <span>💬 {replies.length} 回复</span>
          <span>👁️ {thread.view_count || 0} 浏览</span>
        </div>
      </article>

      {/* 回复列表 */}
      <div className="mt-6 space-y-3">
        <h2 className="font-bold text-slate-300">全部回复 ({replies.length})</h2>
        {replies.length === 0 && (
          <p className="text-slate-500 text-center py-6">暂无回复，来抢沙发吧 🛋️</p>
        )}
        {replies.map((reply) => (
          <div key={reply.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            {reply.is_deleted ? (
              <p className="text-slate-500 italic text-sm">[该回复已被删除]</p>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="font-semibold">{reply.profiles?.display_name || reply.profiles?.username}</span>
                  <span className="text-slate-600">·</span>
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

      {/* 回复输入 */}
      {user ? (
        <form onSubmit={handleReply} className="mt-6">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm min-h-[100px] focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="写下你的回复..."
          />
          <button
            type="submit"
            disabled={sending || !replyContent.trim()}
            className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            {sending ? '发送中...' : '发表回复'}
          </button>
        </form>
      ) : (
        <div className="mt-6 text-center py-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-sm">
            <Link href="/login" className="text-blue-400 hover:underline">登录</Link> 后可以回复
          </p>
        </div>
      )}
    </div>
  )
}
