'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle, Eye, CheckCircle, Lightbulb } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

export default function ChatPage() {
  const [rooms, setRooms] = useState([])
  const [onlineCount, setOnlineCount] = useState(0)
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    supabase.from('chat_rooms').select('*').order('sort_order').then(({ data }) => {
      setRooms(data || [])
    })
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    supabase.from('chat_messages').select('user_id', { count: 'exact', head: true })
      .gte('created_at', fiveMinAgo)
      .then(({ count }) => setOnlineCount(count || 0))
  }, [])

  return (
    <div className="anim-fade-in">
      <div className="hero-section">
        <h1><MessageCircle size={24} className="inline-block align-text-bottom" /> 在线聊天室</h1>
        <p className="tagline">
          非会员可查看聊天记录，会员可参与聊天
          {onlineCount > 0 && (
            <span className="ml-3 inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {onlineCount} 人在线
            </span>
          )}
        </p>
        {!authLoading && !user && (
          <div className="mt-4">
            <Link href="/login" className="btn-primary">登录聊天</Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map((room, i) => (
          <Link key={room.id} href={`/chat/${room.slug}`}
            className={`feature-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl shrink-0 mt-0.5">{room.icon}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[#1a1a1a]">{room.name}</h3>
                <p className="text-sm text-[#aaa] mt-1 line-clamp-1">{room.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[#aaa]">
                  {user ? (
                    <span className="text-green-700"><CheckCircle size={12} className="inline-block align-text-bottom" /> 可发言</span>
                  ) : (
                    <span><Eye size={14} className="inline-block align-text-bottom" /> 可查看</span>
                  )}
                  <span>·</span>
                  <span>进入 →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!authLoading && !user && (
        <div className="mt-6 border border-[#f0f0f0] rounded-xl p-4 text-center bg-[#fafafa]">
          <p className="text-sm text-[#888]">
            <Lightbulb size={14} className="inline-block align-text-bottom" /> 非会员可以查看所有聊天记录，<Link href="/login" className="text-[#c23531] font-medium hover:underline">登录</Link>或<Link href="/register" className="text-[#c23531] font-medium hover:underline">注册</Link>后即可参与聊天
          </p>
        </div>
      )}
    </div>
  )
}
