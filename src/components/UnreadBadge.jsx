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

    const fetchCount = () => {
      supabase.from('private_messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .is('read_at', null)
        .then(({ count }) => setCount(count || 0))
    }

    fetchCount()

    // 实时更新未读数
    const sub = supabase
      .channel('unread_count')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'private_messages', filter: `receiver_id=eq.${user.id}` },
        () => fetchCount()
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'private_messages', filter: `receiver_id=eq.${user.id}` },
        () => fetchCount()
      )
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [user])

  if (count === 0) return null

  return (
    <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#c23531] text-white text-[10px] font-bold leading-none ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
