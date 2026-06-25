'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'

export default function UnreadBadge({ className = '' }) {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    let cancelled = false
    let sub = null

    const fetchCount = async () => {
      try {
        const { count: c } = await supabase
          .from('private_messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .is('read_at', null)
        if (!cancelled) setCount(c || 0)
      } catch (e) {
        // 表不存在时忽略
        console.log('UnreadBadge: table not available (yet)')
      }
    }

    fetchCount()

    // 实时更新 - 用 try-catch 避免崩溃
    try {
      sub = supabase
        .channel('unread_count')
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `receiver_id=eq.${user.id}` },
          fetchCount
        )
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'private_messages', filter: `receiver_id=eq.${user.id}` },
          fetchCount
        )
        .subscribe()
    } catch (e) {
      console.log('UnreadBadge: realtime unavailable')
    }

    return () => {
      cancelled = true
      if (sub) supabase.removeChannel(sub)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (count === 0) return null

  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#c23531] text-white text-[10px] font-bold leading-none ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
