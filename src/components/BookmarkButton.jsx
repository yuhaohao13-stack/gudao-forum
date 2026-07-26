'use client'
import { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

export default function BookmarkButton({ threadId }) {
  const { user } = useAuth()
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`/api/bookmark?thread_id=${threadId}`)
      .then(r => r.json())
      .then(d => setBookmarked(d.bookmarked))
      .catch(() => {})
  }, [user, threadId])

  const toggle = async () => {
    if (!user) return
    const r = await fetch('/api/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId }),
    })
    const d = await r.json()
    setBookmarked(d.bookmarked)
  }

  return (
    <button onClick={toggle}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all text-sm
        ${bookmarked
          ? 'text-[#b45309] bg-[#fef9ed] border border-[#f0dbb4]'
          : 'text-[#aaa] border border-[#f0f0f0] hover:text-[#b45309] hover:border-[#e0d0b0]'}`}>
      <Bookmark size={16} className={bookmarked ? 'fill-current inline-block align-text-bottom' : 'inline-block align-text-bottom'} />
      <span>{bookmarked ? '已收藏' : '收藏'}</span>
    </button>
  )
}
