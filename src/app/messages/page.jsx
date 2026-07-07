'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lock, MessageCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useLanguage } from '@/lib/LanguageContext'
import { useRouter } from 'next/navigation'

export default function MessagesPage() {
  const { t } = useLanguage()
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
    if (!confirm(t('messages.delete') + '?')) return
    await supabase.from('private_messages')
      .delete()
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
    loadConversations()
  }

  if (authLoading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>
  if (!user) return (
    <div className="card p-10 text-center anim-fade-in max-w-md mx-auto mt-16">
      <div className="mb-3"><Lock size={36} className="inline-block" /></div>
      <p className="text-[#999] mb-3">{t('messages.login_required')}</p>
      <Link href="/login" className="btn-primary">{t('auth.go_login')}</Link>
    </div>
  )

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1c1917] mb-5"><MessageCircle size={20} className="inline-block align-text-bottom" /> {t('messages.title')}</h1>
      <p className="text-xs text-[#999] mb-4">Messages are private between you and the other person.</p>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>
      ) : conversations.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="mb-3"><MessageCircle size={36} className="inline-block text-[#ccc]" /></div>
          <p className="text-[#999] text-sm">{t('messages.no_conversations')}</p>
          <p className="text-[#ccc] text-xs mt-1">{t('messages.send_first')}</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {conversations.map(conv => {
            const name = conv.profile?.display_name || conv.profile?.username || ''
            const lastContent = conv.lastMsg.content || (conv.lastMsg.images?.length > 0 ? '[Image]' : '')
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
                    <span className="font-semibold text-sm text-[#1c1917] truncate">{name}</span>
                    <span className="text-[10px] text-[#bbb] shrink-0 ml-2">
                      {new Date(conv.lastMsg.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#999] truncate mt-0.5">
                    {isMe && <span className="text-[#ccc]">{t('messages.title')}: </span>}{lastContent || ''}
                  </p>
                </Link>
                <button onClick={(e) => deleteConversation(conv.otherId, e)}
                  className="text-[10px] text-[#bbb] hover:text-[#c23531] opacity-0 group-hover:opacity-100 transition-all shrink-0 px-2 py-1 rounded hover:bg-[#c23531]/5"
                  title={t('messages.delete')}><Trash2 size={14} className="inline-block" /></button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
