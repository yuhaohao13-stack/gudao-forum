'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [searched, setSearched] = useState(false)
  const supabase = createClient()

  const doSearch = async (q) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data: byTitle } = await supabase
        .from('threads').select('*, profiles(username, display_name), categories(name, slug)')
        .ilike('title', `%${q.trim()}%`).order('created_at', { ascending: false }).limit(20)
      const { data: byContent } = await supabase
        .from('threads').select('*, profiles(username, display_name), categories(name, slug)')
        .ilike('content', `%${q.trim()}%`).order('created_at', { ascending: false }).limit(20)
      const seen = new Set()
      const merged = [...(byTitle || []), ...(byContent || [])].filter(t => {
        if (seen.has(t.id)) return false; seen.add(t.id); return true
      })
      setResults(merged)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  useEffect(() => { if (query) { setSearchInput(query); doSearch(query) } }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
  }

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold text-gradient mb-4">🔍 搜索帖子</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input type="text" value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="输入关键词搜索..."
            className="input-field flex-1"
            autoFocus
          />
          <button type="submit" disabled={loading}
            className="btn-amber flex items-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? '搜索中...' : '搜索'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="w-6 h-6 mx-auto border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && searched && query && (
        <>
          <p className="text-sm text-slate-500 mb-4">搜索「{query}」— 找到 {results.length} 个结果</p>

          {results.length === 0 ? (
            <div className="text-center py-12 glass-card">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-slate-500">没有找到相关帖子</p>
              <p className="text-xs text-slate-600 mt-1">试试其他关键词</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((thread, i) => (
                <Link key={thread.id} href={`/t/${thread.id}`}
                  className={`post-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors truncate">{thread.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>{thread.profiles?.display_name || thread.profiles?.username}</span>
                        {thread.categories && <><span className="text-slate-700">·</span><span>{thread.categories?.name}</span></>}
                        <span className="text-slate-700">·</span>
                        <span>{new Date(thread.created_at).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">{thread.content?.substring(0, 120)}{thread.content?.length > 120 ? '...' : ''}</div>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 shrink-0">
                      <span>💬 {thread.reply_count || 0}</span>
                      <span>👁️ {thread.view_count || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {!searched && !query && (
        <div className="text-center py-12">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-slate-500">输入关键词，搜索全站帖子</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" /></div>}>
    <SearchResults />
  </Suspense>
}
