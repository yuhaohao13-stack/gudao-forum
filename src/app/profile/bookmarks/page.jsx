'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, ArrowLeft, Search } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'

export default function BookmarksPage() {
  const { user, profile } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  // 客户端搜索收藏内的帖子
  const filtered = searchQuery.trim()
    ? bookmarks.filter(b => (b.thread?.title || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : bookmarks

  if (loading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>
  if (!user) return <div className="text-center py-20"><p className="text-[#bbb]">请先登录</p><Link href="/login" className="btn-primary mt-2 inline-block">去登录</Link></div>

  return (
    <div className="anim-fade-in w-full sm:max-w-3xl sm:mx-auto px-4 py-6">
      <Breadcrumb crumbs={[
        { label: '首页', href: '/' },
        { label: '个人详情', href: `/profile/${user.id}` },
        { label: '我的收藏' },
      ]} />

      <div className="flex items-center gap-3 mb-4 mt-4">
        <h1 className="text-lg font-bold text-[#1a1a1a]"><Bookmark size={18} className="inline-block align-text-top text-[#b45309]" /> 我的收藏</h1>
        <span className="text-xs text-[#bbb]">({bookmarks.length} 篇)</span>
      </div>

      {/* 搜索框 - 只搜收藏内的帖子 */}
      <div className="mb-4 flex gap-2 w-1/3 min-w-[200px]">
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索收藏内的帖子..."
          className="input !text-sm flex-1" />
        <button onClick={() => {}}
          className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-[#b45309] hover:bg-[#a04408] transition-colors shrink-0">
          <Search size={14} className="inline-block align-text-bottom" /> 搜索
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Bookmark size={40} className="mx-auto text-[#ddd] mb-4" />
          <p className="text-[#bbb] text-sm">{searchQuery ? '没有找到匹配的收藏' : '还没有收藏任何帖子'}</p>
          {!searchQuery && <Link href="/" className="btn-primary mt-4 inline-block">去逛逛</Link>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(b => (
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
