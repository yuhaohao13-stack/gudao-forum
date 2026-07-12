/* BUILD_TAG_20260712 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle, Eye, CheckCircle, Lightbulb, Users } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'

export default function ChatPage() {
  const [rooms, setRooms] = useState([])
  const [roomOnlineCounts, setRoomOnlineCounts] = useState({}) // room_id → count
  const [totalOnline, setTotalOnline] = useState(0)
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const load = async () => {
      // 1. 获取所有聊天室
      const { data: roomsData } = await supabase.from('chat_rooms').select('*').order('sort_order')
      setRooms(roomsData || [])

      // 2. 查询在线用户（按房间统计）
      const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString()
      const { data: presences } = await supabase
        .from('chat_presence')
        .select('user_id, room_id')
        .gte('last_seen', cutoff)

      if (!presences) return

      // 统计各房间在线人数
      const perRoom = {}
      for (const p of presences) {
        const rid = p.room_id
        if (!perRoom[rid]) perRoom[rid] = 0
        perRoom[rid]++
      }
      setRoomOnlineCounts(perRoom)
      setTotalOnline(presences.length)
    }
    load()

    // 每15秒刷新在线人数
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="anim-fade-in">
      {/* 面包屑 */}
      <div className="mb-4">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '聊天室' },
        ]} />
      </div>

      <div className="hero-section">
        <h1><MessageCircle size={24} className="inline-block align-text-bottom" /> 在线聊天室</h1>
        <p className="tagline">
          非会员可查看聊天记录，会员可参与聊天
          {totalOnline > 0 && (
            <span className="ml-3 inline-flex items-center gap-1 text-xs text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <Users size={10} className="inline-block" />
              {' '}{totalOnline} 人在线
            </span>
          )}
        </p>
        {!authLoading && !user && (
          <div className="mt-4">
            <Link href="/login" className="btn-primary">登录聊天</Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rooms.map((room, i) => {
          const roomOnline = roomOnlineCounts[room.id] || 0
          return (
            <Link key={room.id} href={`/chat/${room.slug}`}
              className="bg-white border border-[#ece8e0] rounded-xl px-3 py-2.5 hover:border-[#c23531] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-2">
                <span className="text-lg shrink-0">{room.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-medium text-sm text-[#1a1a1a]">{room.name}</h3>
                    {roomOnline > 0 && (
                      <span className="text-[10px] text-green-700 font-medium shrink-0">
                        {roomOnline}人
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#aaa] truncate">{room.description}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#aaa]">
                    {user ? (
                      <span className="text-green-700"><CheckCircle size={10} className="inline-block align-text-bottom" /> 可发言</span>
                    ) : (
                      <span><Eye size={11} className="inline-block align-text-bottom" /> 可查看</span>
                    )}
                    <span>·</span>
                    <span>进入 →</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
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
