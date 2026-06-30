'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Image, X } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

export default function PrivateChatPage() {
  const { id: otherUserId } = useParams()
  const { user } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const [otherProfile, setOtherProfile] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [areFriends, setAreFriends] = useState(false)
  const fileRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  useEffect(() => {
    if (!user || !otherUserId) return
    if (user.id === otherUserId) { router.push('/'); return }

    // 查对方资料
    supabase.from('profiles').select('*').eq('id', otherUserId).single().then(({ data }) => {
      setOtherProfile(data)
    })

    // 查好友关系
    supabase.from('friends').select('*')
      .or(`and(requester_id.eq.${user.id},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${user.id})`)
      .eq('status', 'accepted')
      .single()
      .then(({ data }) => setAreFriends(!!data))

    // 加载私信
    loadMessages()
    // 标记为已读
    supabase.from('private_messages').update({ read_at: new Date().toISOString() })
      .eq('receiver_id', user.id).eq('sender_id', otherUserId).is('read_at', null).then()
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, otherUserId])

  const loadMessages = async () => {
    const { data } = await supabase
      .from('private_messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })
      .limit(100)
    if (data) { setMessages(data); setTimeout(scrollToBottom, 100) }
  }

  // 实时消息
  useEffect(() => {
    if (!user || !otherUserId) return
    const sub = supabase
      .channel(`pm_${user.id}_${otherUserId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `sender_id=in.(${user.id},${otherUserId})` },
        async (payload) => {
          if (payload.new.sender_id === user.id || payload.new.sender_id === otherUserId) {
            // 去重：避免自己发送时重复
            setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new])
            scrollToBottom()
          }
        }
      )
      .subscribe()
    return () => supabase.removeChannel(sub)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, otherUserId])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!user || (!input.trim() && images.length === 0) || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')

    // 上传图片
    let uploadedUrls = []
    for (const f of images) {
      const ext = f.name.split('.').pop()
      const path = `pm/${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
      const { error: ue } = await supabase.storage.from('forum-images').upload(path, f)
      if (!ue) {
        const { data: { publicUrl } } = supabase.storage.from('forum-images').getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }
    }
    setImages([]); setPreviews([])

    const { data, error } = await supabase.from('private_messages').insert({
      sender_id: user.id, receiver_id: otherUserId,
      content: content || null,
      images: uploadedUrls.length ? uploadedUrls : null,
    }).select()
    if (!error && data?.[0]) {
      // 直接添加，不重新拉取，避免实时订阅重复
      setMessages(prev => [...prev, data[0]])
      scrollToBottom()
    }
    setSending(false)
  }

  const deleteMessage = async (msgId) => {
    if (!confirm('确定删除这条消息？')) return
    await supabase.from('private_messages').delete().eq('id', msgId)
    setMessages(prev => prev.filter(m => m.id !== msgId))
  }

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in flex flex-col h-[calc(100vh-10rem)] max-h-[700px]">
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <Link href={`/profile/${otherUserId}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[#c23531] flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {(otherProfile?.display_name || otherProfile?.username || '?')[0]}
          </div>
          <div>
            <span className="font-semibold text-sm text-[#1a1a1a]">{otherProfile?.display_name || otherProfile?.username}</span>
            {!areFriends && <span className="ml-2 text-[10px] text-[#bbb]">(非好友)</span>}
          </div>
        </Link>
        {areFriends && <span className="text-[10px] text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5"><CheckCircle size={10} className="inline-block align-text-bottom" /> 好友</span>}
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-[#eee8dc] bg-white p-4 space-y-3 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#ccc] text-sm">
            {areFriends ? <>发送第一条私信吧 <MessageCircle size={14} className="inline-block align-text-bottom" /></> : '成为好友后才能发送私信'}
          </div>
        ) : messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              msg.sender_id === user.id ? 'bg-[#c23531] text-white rounded-br-md' : 'bg-[#f5f0e8] text-[#333] rounded-bl-md'
            }`}>
              <div className="flex items-start gap-1 group">
                <div className="flex-1 min-w-0">
                  {msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>}
                  {msg.images?.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 ${msg.content ? 'mt-2' : ''}`}>
                      {msg.images.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="" className="max-w-[200px] max-h-[200px] rounded-lg" loading="lazy" />
                        </a>
                      ))}
                    </div>
                  )}
                  <p className={`text-[10px] mt-1 ${msg.sender_id === user.id ? 'text-white/60' : 'text-[#bbb]'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button onClick={() => deleteMessage(msg.id)}
                  className="text-white/30 hover:text-[#c23531] opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5"
                  title="删除"><X size={10} /></button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入 */}
      <div className="mt-3 shrink-0">
        {areFriends ? (
          <form onSubmit={handleSend} className="space-y-2">
            {previews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {previews.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} alt="" className="h-16 w-16 object-cover rounded-lg border border-[#eee8dc]" />
                    <button type="button" onClick={() => { setImages([]); setPreviews([]) }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#c23531] rounded-full flex items-center justify-center text-white"><X size={10} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="发送私信..." maxLength={1000} className="input flex-1" disabled={sending} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="btn-ghost border border-[#eee8dc] px-3"><Image size={16} className="inline-block" /></button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImages} className="hidden" />
              <button type="submit" disabled={sending || (!input.trim() && images.length === 0)}
                className="btn-primary disabled:opacity-50 !px-5">发送</button>
            </div>
          </form>
        ) : (
          <div className="card p-3 text-center border-dashed border-[#ddd6c8]">
            <p className="text-sm text-[#999]">需要先添加为好友才能私信</p>
          </div>
        )}
        <p className="text-[10px] text-[#ccc] mt-1 text-right">私信保留 48 小时后自动清理</p>
      </div>
    </div>
  )
}
