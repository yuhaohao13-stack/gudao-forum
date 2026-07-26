'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/client'

export default function BookmarksPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchBookmarks()
    else setLoading(false)
  }, [user])

  const fetchBookmarks = async () => {
    const r = await fetch('/api/bookmark')
    const d = await r.json()
    setBookmarks(d.bookmarks || [])
    setLoading(false)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>
  if (!user) return <div className="text-center py-20"><p className="text-[#bbb]">请先登录</p><Link href="/login" className="btn-primary mt-2 inline-block">去登录</Link></div>

  return (
    <div className="anim-fade-in w-full sm:max-w-3xl sm:mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-[#aaa] hover:text-[#1a1a1a] transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="text-lg font-bold text-[#1a1a1a]"><Bookmark size={18} className="inline-block align-text-top text-[#b45309]" /> 我的收藏</h1>
        <span className="text-xs text-[#bbb]">({bookmarks.length} 篇)</span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="card p-12 text-center">
          <Bookmark size={40} className="mx-auto text-[#ddd] mb-4" />
          <p className="text-[#bbb] text-sm">还没有收藏任何帖子</p>
          <Link href="/" className="btn-primary mt-4 inline-block">去逛逛</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map(b => (
            <Link key={b.id} href={`/t/${b.thread_id}`}
              className="block card p-4 hover:border-[#e0d0b0] transition-all anim-scale">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-[#1a1a1a] truncate">{b.thread?.title || '（帖子已删除）'}</h3>
                  <p className="text-xs text-[#bbb] mt-1">
                    <Bookmark size={10} className="inline-block align-text-bottom text-[#b45309]" />
                    {' '}收藏于 {new Date(b.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                <span className="text-[#b45309] text-xs whitespace-nowrap flex-shrink-0">阅读 →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
