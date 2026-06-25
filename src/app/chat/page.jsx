'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
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

    // 获取所有聊天室的在线人数（简单统计：最近 5 分钟有过消息的 unique 用户数）
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    supabase.from('chat_messages').select('user_id', { count: 'exact', head: true })
      .gte('created_at', fiveMinAgo)
      .then(({ count }) => setOnlineCount(count || 0))
  }, [])

  return (
    <div className="anim-fade-in">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#1a1a1a]">💬 在线聊天室</h1>
          <p className="text-sm text-[#999] mt-1">
            非会员可查看聊天记录，会员可参与聊天
            {onlineCount > 0 && (
              <span className="ml-3 inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {onlineCount} 人在线
              </span>
            )}
          </p>
        </div>
        {!authLoading && !user && (
          <Link href="/login" className="btn-primary text-xs !px-3 !py-1.5">
            登录聊天
          </Link>
        )}
      </div>

      {/* 聊天室网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rooms.map((room, i) => (
          <Link key={room.id} href={`/chat/${room.slug}`}
            className={`card p-5 hover:border-[#c23531]/30 transition-all group anim-scale ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                {room.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold font-serif text-[#1a1a1a] text-lg group-hover:text-[#c23531] transition-colors">
                  {room.name}
                </h3>
                <p className="text-sm text-[#999] mt-0.5 line-clamp-1">{room.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  {user ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      可发言
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-[#b0a898]">
                      👁️ 可查看
                    </span>
                  )}
                  <span className="text-xs text-[#ccc]">点击进入 →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 提示 */}
      {!authLoading && !user && (
        <div className="mt-6 card p-4 text-center bg-gradient-to-r from-[#c23531]/5 to-transparent border-[#c23531]/10">
          <p className="text-sm text-[#666]">
            💡 非会员可以查看所有聊天记录，<Link href="/login" className="text-[#c23531] font-medium hover:underline">登录</Link>或<Link href="/register" className="text-[#c23531] font-medium hover:underline">注册</Link>后即可参与聊天
          </p>
        </div>
      )}
    </div>
  )
}
