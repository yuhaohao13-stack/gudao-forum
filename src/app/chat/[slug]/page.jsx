'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import OnlineUsersPanel from '@/components/OnlineUsersPanel'
import { Search, Crown, Lightbulb, Eye } from 'lucide-react'
import { checkContent, validateInput } from '@/lib/moderation'

const MESSAGES_PER_PAGE = 50

export default function ChatRoomPage() {
  const { slug } = useParams()
  const supabase = createClient()
  const { user, profile, loading: authLoading } = useAuth()

  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [userCache, setUserCache] = useState({})    // user_id -> {display_name, username, role}
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sendError, setSendError] = useState('')

  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('chat_session_id')
      if (!sid) {
        sid = crypto.randomUUID()
        localStorage.setItem('chat_session_id', sid)
      }
      return sid
    }
    return ''
  })

  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback((smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' })
    }, 50)
  }, [])

  // 查询用户资料
  const fetchUserProfiles = useCallback(async (userIds) => {
    const uncached = userIds.filter(id => !userCache[id] && id)
    if (uncached.length === 0) return

    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, role')
      .in('id', uncached)

    if (data) {
      setUserCache(prev => {
        const next = { ...prev }
        for (const p of data) {
          next[p.id] = p
        }
        return next
      })
    }
  }, [userCache, supabase])

  useEffect(() => {
    if (!slug) return

    supabase.from('chat_rooms').select('*').eq('slug', slug).single()
      .then(async ({ data }) => {
        if (data) {
          setRoom(data)

          const { data: msgs } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('room_id', data.id)
            .order('created_at', { ascending: false })
            .limit(MESSAGES_PER_PAGE)

          const sorted = (msgs || []).reverse()
          setMessages(sorted)

          // 拉取所有发消息者的用户资料
          const userIds = [...new Set((msgs || []).map(m => m.user_id))]
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, display_name, role')
            .in('id', userIds)

          if (profiles) {
            const cache = {}
            for (const p of profiles) {
              cache[p.id] = p
            }
            setUserCache(cache)
          }

          setHasMore(sorted.length >= MESSAGES_PER_PAGE)
          setLoading(false)
          setTimeout(() => scrollToBottom(false), 100)
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
          // 查询新消息的用户资料（如有需要）
          await fetchUserProfiles([payload.new.user_id])

          setMessages(prev => [...prev, payload.new])
          const container = messagesContainerRef.current
          if (container) {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
            if (isNearBottom) scrollToBottom(true)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, fetchUserProfiles])

  // 心跳上报（每30秒）
  useEffect(() => {
    if (!slug || !sessionId) return
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/chat/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_slug: slug, session_id: sessionId, user_agent: navigator.userAgent }),
        })
      } catch (e) {
        // 心跳失败静默处理
      }
    }
    sendHeartbeat()
    const interval = setInterval(sendHeartbeat, 30000)
    return () => clearInterval(interval)
  }, [slug, sessionId])

  // 加载更早的消息
  const loadMore = async () => {
    if (loadingMore || !hasMore || !room?.id || messages.length === 0) return
    setLoadingMore(true)
    const oldest = messages[0]
    const { data } = await supabase.from('chat_messages')
      .select('*')
      .eq('room_id', room.id)
      .lt('created_at', oldest.created_at)
      .order('created_at', { ascending: false })
      .limit(MESSAGES_PER_PAGE)

    if (data) {
      const sorted = data.reverse()
      setMessages(prev => [...sorted, ...prev])
      setHasMore(data.length >= MESSAGES_PER_PAGE)

      // 拉取新出现的用户资料
      const newIds = [...new Set(data.map(m => m.user_id))]
      await fetchUserProfiles(newIds)
    }
    setLoadingMore(false)
  }

  // 发送消息
  const handleSend = async (e) => {
    e.preventDefault()
    setSendError('')
    if (!user || !input.trim() || sending || !room?.id) return
    // 内容安全检查
    const safeCheck = checkContent(input)
    if (!safeCheck.pass) { setSendError('消息包含不当言论'); return }
    const inputCheck = validateInput(input, 500)
    if (!inputCheck.valid) { setSendError(inputCheck.error); return }
    setSending(true)
    const content = input.trim()
    setInput('')

    const { error, data } = await supabase.from('chat_messages').insert({
      room_id: room.id,
      user_id: user.id,
      content,
    }).select()

    if (error) {
      setSendError(error.message || '发送失败，请稍后再试')
      setInput(content)
    } else if (data && data.length > 0) {
      // 直接添加新消息到列表（不用重新拉取全部）
      setMessages(prev => [...prev, data[0]])
      scrollToBottom(true)
    }
    setSending(false)
    inputRef.current?.focus()
  }

  // 获取用户显示名
  const getUserDisplay = (msg) => {
    const cached = userCache[msg.user_id]
    if (cached) return cached
    if (user?.id === msg.user_id && profile) return profile
    return null
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
        <div className="mb-3"><Search size={40} className="inline-block" /></div>
        <p className="text-[#999]">聊天室不存在</p>
        <Link href="/chat" className="text-[#c23531] hover:underline mt-2 inline-block">返回聊天室列表</Link>
      </div>
    )
  }

  return (
    <div className="anim-fade-in flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* 头部 — 独立在外 */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/chat" className="text-sm text-[#c23531]/70 hover:text-[#c23531] transition-colors shrink-0">&larr;</Link>
          <span className="text-xl shrink-0">{room.icon}</span>
          <h1 className="text-lg font-bold text-[#1a1a1a] truncate">{room.name}</h1>
          <span className="hidden sm:inline text-[10px] text-[#b0a898] bg-[#f5f0e8] rounded-full px-2 py-0.5 truncate max-w-[150px]">{room.description}</span>

        </div>
      </div>

      {/* 消息 + 在线面板 — 同框展示 */}
      <div className="flex-1 flex min-h-0 rounded-xl border border-[#eee8dc] bg-white overflow-hidden">
        {/* 左：消息列表 + 输入框 (3/4) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 消息列表 */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth"
          >
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
                const userInfo = getUserDisplay(msg)
                const isAdmin = userInfo?.role === 'admin'
                const isMod = userInfo?.role === 'moderator'
                const isSelf = user?.id === msg.user_id
                const avatarLetter = (userInfo?.display_name || userInfo?.username || '?')[0]
                const displayName = userInfo?.display_name || userInfo?.username || '用户'

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 py-1.5 px-2 rounded-lg transition-colors ${
                      isSelf ? 'bg-[#c23531]/5' : 'hover:bg-[#faf8f4]'
                    }`}
                  >
                    <Link href={isSelf ? '#' : `/profile/${msg.user_id}`}
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                        isAdmin ? 'bg-[#c23531]' : isMod ? 'bg-[#8b6914]' : 'bg-[#b0a898]'
                      }`}
                      title={displayName}
                    >
                      {avatarLetter}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link href={isSelf ? '#' : `/profile/${msg.user_id}`}
                          className={`text-xs font-medium hover:underline ${
                            isAdmin ? 'text-[#c23531]' : isMod ? 'text-[#8b6914]' : 'text-[#666]'
                          }`}>
                          {displayName}
                          {isAdmin && <Crown size={10} className="ml-1 inline-block opacity-60" />}
                        </Link>
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
          <div className="shrink-0 border-t border-[#eee8dc] px-4 py-3">
            {user ? (
              <form onSubmit={handleSend} className="flex flex-col gap-2">
                <div className="flex gap-2">
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
                </div>
                {sendError && (
                  <p className="text-xs text-[#c23531] bg-[#c23531]/8 border border-[#c23531]/15 rounded-lg px-3 py-2">{sendError}</p>
                )}
              </form>
            ) : (
              <div className="text-center border border-dashed border-[#ddd6c8] rounded-lg p-3">
                <p className="text-sm text-[#999]">
                  <Eye size={14} className="inline-block align-text-bottom" /> <Link href="/login" className="text-[#c23531] font-medium hover:underline">登录</Link> 后可参与聊天，当前为只读模式
                </p>
              </div>
            )}
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-[#ccc]">友善交流，以文会友</span>
              <span className="text-[10px] text-[#999]"><Lightbulb size={12} className="inline-block align-text-bottom" /> 聊天记录保留 48 小时</span>
              <span className="text-[10px] text-[#ccc]">{messages.length} 条消息</span>
            </div>
          </div>
        </div>

        {/* 分割线 + 右：在线面板 (1/4) — 不自滚动 */}
        <div className="max-md:hidden border-l border-[#eee8dc] w-1/4 min-w-[140px] max-w-[220px]">
          <OnlineUsersPanel roomSlug={slug} currentUserId={user?.id || null} />
        </div>
      </div>

    </div>
  )
}
