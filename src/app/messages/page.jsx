'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (authLoading || !user) return
    loadConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading])

  const loadConversations = async () => {
    // 获取所有跟我有关的私信，按时间倒序取最新一条
    const { data } = await supabase
      .from('private_messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(200)

    // 按对话分组，取最新一条
    const seen = {}
    const convos = []
    for (const msg of data || []) {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
      if (!seen[otherId]) {
        seen[otherId] = true
        convos.push({ otherId, lastMsg: msg })
      }
    }

    // 批量查用户资料
    const ids = convos.map(c => c.otherId)
    if (ids.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, role')
        .in('id', ids)
      const profileMap = {}
      for (const p of profiles || []) profileMap[p.id] = p
      for (const c of convos) c.profile = profileMap[c.otherId] || null
    }

    setConversations(convos)
    setLoading(false)
  }

  const deleteConversation = async (otherId, e) => {
    e.stopPropagation()
    if (!confirm('确定删除与该用户的聊天记录？')) return
    await supabase.from('private_messages')
      .delete()
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
    loadConversations()
  }

  if (authLoading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>
  if (!user) return (
    <div className="card p-10 text-center anim-fade-in max-w-md mx-auto mt-16">
      <div className="text-3xl mb-3">🔐</div>
      <p className="text-[#999] mb-3">请登录后查看私信</p>
      <Link href="/login" className="btn-primary">去登录</Link>
    </div>
  )

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold font-serif text-[#1a1a1a] mb-5">💬 私信</h1>
      <p className="text-xs text-[#999] mb-4">私信永久保留，仅你和对方可见</p>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>
      ) : conversations.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-3xl mb-3">💬</div>
          <p className="text-[#999] text-sm">还没有私信</p>
          <p className="text-[#ccc] text-xs mt-1">去好友个人页发送私信吧</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {conversations.map(conv => {
            const name = conv.profile?.display_name || conv.profile?.username || '用户'
            const lastContent = conv.lastMsg.content || (conv.lastMsg.images?.length > 0 ? '[图片]' : '')
            const isMe = conv.lastMsg.sender_id === user.id

            return (
              <div key={conv.otherId} className="card p-3 flex items-center gap-3 group hover:border-[#c23531]/30 transition-all">
                <Link href={`/profile/${conv.otherId}`} className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#c23531] flex items-center justify-center text-sm font-bold text-white shadow-sm hover:opacity-80 transition-opacity">
                    {name[0]}
                  </div>
                </Link>
                <Link href={`/messages/${conv.otherId}`} className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#1a1a1a] truncate">{name}</span>
                    <span className="text-[10px] text-[#bbb] shrink-0 ml-2">
                      {new Date(conv.lastMsg.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#999] truncate mt-0.5">
                    {isMe && <span className="text-[#ccc]">你: </span>}{lastContent || '（空消息）'}
                  </p>
                </Link>
                <button onClick={(e) => deleteConversation(conv.otherId, e)}
                  className="text-[10px] text-[#bbb] hover:text-[#c23531] opacity-0 group-hover:opacity-100 transition-all shrink-0 px-2 py-1 rounded hover:bg-[#c23531]/5"
                  title="删除聊天">🗑️</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
