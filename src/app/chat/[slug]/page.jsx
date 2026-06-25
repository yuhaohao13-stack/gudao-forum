'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'

const MESSAGES_PER_PAGE = 50

export default function ChatRoomPage() {
  const { slug } = useParams()
  const supabase = createClient()
  const { user, profile, loading: authLoading } = useAuth()

  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [onlineNow, setOnlineNow] = useState(0)

  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback((smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' })
    }, 50)
  }, [])

  useEffect(() => {
    if (!slug) return

    // 加载聊天室信息
    supabase.from('chat_rooms').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        if (data) {
          setRoom(data)
          // 加载初始消息
          supabase.from('chat_messages')
            .select('*, profiles!inner(username, display_name, role)')
            .eq('room_id', data.id)
            .order('created_at', { ascending: false })
            .limit(MESSAGES_PER_PAGE)
            .then(({ data: msgs }) => {
              const sorted = (msgs || []).reverse()
              setMessages(sorted)
              setHasMore(sorted.length >= MESSAGES_PER_PAGE)
              setLoading(false)
              setTimeout(() => scrollToBottom(false), 100)
            })
        } else {
          setLoading(false)
        }
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // 实时订阅新消息
  useEffect(() => {
    if (!room?.id) return

    const subscription = supabase
      .channel(`chat_room_${room.id}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${room.id}` },
        async (payload) => {
          // 补全用户信息
          const { data: msg } = await supabase
            .from('chat_messages')
            .select('*, profiles!inner(username, display_name, role)')
            .eq('id', payload.new.id)
            .single()

          if (msg) {
            setMessages(prev => [...prev, msg])
            // 如果在底部则自动滚动
            const container = messagesContainerRef.current
            if (container) {
              const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
              if (isNearBottom) scrollToBottom(true)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id])

  // 在线统计：显示最近 2 分钟在线的用户（通过去重消息中的 user_id）
  useEffect(() => {
    if (!room?.id) return
    const updateOnline = () => {
      const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
      supabase.from('chat_messages').select('user_id')
        .eq('room_id', room.id)
        .gte('created_at', twoMinAgo)
        .then(({ data }) => {
          const userIds = new Set((data || []).map(m => m.user_id))
          setOnlineNow(userIds.size)
        })
    }
    updateOnline()
    const interval = setInterval(updateOnline, 30000)
    return () => clearInterval(interval)
  }, [room?.id])

  // 加载更早的消息
  const loadMore = async () => {
    if (loadingMore || !hasMore || !room?.id || messages.length === 0) return
    setLoadingMore(true)
    const oldest = messages[0]
    const { data } = await supabase.from('chat_messages')
      .select('*, profiles!inner(username, display_name, role)')
      .eq('room_id', room.id)
      .lt('created_at', oldest.created_at)
      .order('created_at', { ascending: false })
      .limit(MESSAGES_PER_PAGE)

    if (data) {
      const sorted = data.reverse()
      setMessages(prev => [...sorted, ...prev])
      setHasMore(data.length >= MESSAGES_PER_PAGE)
    }
    setLoadingMore(false)
  }

  // 发送消息
  const handleSend = async (e) => {
    e.preventDefault()
    if (!user || !input.trim() || sending || !room?.id) return
    setSending(true)
    const content = input.trim()
    setInput('')

    const { error } = await supabase.from('chat_messages').insert({
      room_id: room.id,
      user_id: user.id,
      content,
    })

    if (error) {
      console.error('发送失败:', error)
      setInput(content)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="text-center py-20 anim-fade-in">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-[#999]">聊天室不存在</p>
        <Link href="/chat" className="text-[#c23531] hover:underline mt-2 inline-block">返回聊天室列表</Link>
      </div>
    )
  }

  return (
    <div className="anim-fade-in flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* 聊天室头部 */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/chat" className="text-sm text-[#c23531]/70 hover:text-[#c23531] transition-colors">&larr;</Link>
          <span className="text-xl">{room.icon}</span>
          <h1 className="text-lg font-bold font-serif text-[#1a1a1a]">{room.name}</h1>
          <span className="text-[10px] text-[#b0a898] bg-[#f5f0e8] rounded-full px-2 py-0.5">{room.description}</span>
          {onlineNow > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {onlineNow} 人在聊
            </span>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto rounded-xl border border-[#eee8dc] bg-white p-4 space-y-1 scroll-smooth"
      >
        {/* 加载更多 */}
        {hasMore && (
          <div className="text-center py-2">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="text-xs text-[#b0a898] hover:text-[#c23531] transition-colors disabled:opacity-50"
            >
              {loadingMore ? '加载中...' : '加载更多消息 ↑'}
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="text-3xl mb-3">{room.icon}</div>
            <p className="text-[#999] text-sm">暂无消息</p>
            <p className="text-[#ccc] text-xs mt-1">
              {user ? '发送第一条消息吧' : '登录后可参与聊天'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.profiles?.role === 'admin'
            const isMod = msg.profiles?.role === 'moderator'
            const isSelf = user?.id === msg.user_id
            const avatarLetter = (msg.profiles?.display_name || msg.profiles?.username || '?')[0]
            const displayName = msg.profiles?.display_name || msg.profiles?.username || '匿名'

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 py-1.5 px-2 rounded-lg transition-colors ${
                  isSelf ? 'bg-[#c23531]/5' : 'hover:bg-[#faf8f4]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                    isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'
                  }`}
                  title={displayName}
                >
                  {avatarLetter}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${
                      isAdmin ? 'text-[#c23531]' : isMod ? 'text-[#8b6914]' : 'text-[#666]'
                    }`}>
                      {displayName}
                      {isAdmin && <span className="ml-1 text-[10px] opacity-60">👑</span>}
                    </span>
                    <span className="text-[10px] text-[#ccc]">
                      {new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-[#333] leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="mt-3 shrink-0">
        {user ? (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`在 #${room.name} 中发言...`}
              maxLength={500}
              className="input flex-1"
              disabled={sending}
              autoFocus
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed !px-5"
            >
              {sending ? '发送中...' : '发送'}
            </button>
          </form>
        ) : (
          <div className="card p-3 text-center border-dashed border-[#ddd6c8]">
            <p className="text-sm text-[#999]">
              👁️ <Link href="/login" className="text-[#c23531] font-medium hover:underline">登录</Link> 后可参与聊天，当前为只读模式
            </p>
          </div>
        )}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-[#ccc]">友善交流，以文会友</span>
          <span className="text-[10px] text-[#ccc]">{messages.length} 条消息</span>
        </div>
      </div>
    </div>
  )
}
