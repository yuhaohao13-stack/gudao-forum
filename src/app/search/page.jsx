'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function SearchResults() {
  const sp = useSearchParams()
  const router = useRouter()
  const query = sp.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState(query)
  const [searched, setSearched] = useState(false)
  const supabase = createClient()

  const doSearch = async (q) => {
    if (!q.trim()) return
    setLoading(true); setSearched(true)
    try {
      const [t, c] = await Promise.all([
        supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
          .ilike('title', `%${q}%`).order('created_at', { ascending: false }).limit(20),
        supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)')
          .ilike('content', `%${q}%`).order('created_at', { ascending: false }).limit(20),
      ])
      const seen = new Set()
      setResults([...(t.data || []), ...(c.data || [])].filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true }))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { if (query) { setInput(query); doSearch(query) } }, [query])

  return (
    <div className="fade-in">
      <h1 className="text-2xl font-bold text-[#2c2c2c] mb-4">🔍 搜索</h1>
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`) }} className="mb-6 flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="搜索帖子..." className="ink-input flex-1" autoFocus />
        <button type="submit" disabled={loading} className="btn-red">{loading ? '搜索中...' : '搜索'}</button>
      </form>

      {loading && <div className="text-center py-8"><div className="w-5 h-5 mx-auto border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>}

      {!loading && searched && query && (
        <>
          <p className="text-sm text-[#8c8c8c] mb-4">搜索「{query}」— {results.length} 个结果</p>
          <div className="space-y-2">
            {results.length === 0 ? (
              <div className="text-center py-12 paper-card"><div className="text-3xl mb-2">🔍</div><p className="text-[#8c8c8c]">没有找到相关帖子</p></div>
            ) : results.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`}
                className={`thread-card fade-in-up group ${i > 0 ? `stagger-${Math.min(i, 5)}` : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#2c2c2c] group-hover:text-[#c23531] transition-colors truncate">{t.title}</h3>
                    <div className="text-xs text-[#8c8c8c] mt-0.5">{t.profiles?.display_name || t.profiles?.username}{t.categories && <> <span className="text-[#d8d0c0]">/</span> {t.categories?.name}</>}</div>
                    <div className="text-xs text-[#b0a898] mt-1 line-clamp-2">{t.content?.substring(0, 120)}{t.content?.length > 120 ? '...' : ''}</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8c8c8c] shrink-0">
                    <span>{t.reply_count || 0}</span>
                    <span>{t.view_count || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      {!searched && !query && <div className="text-center py-12"><div className="text-3xl mb-2">🔍</div><p className="text-[#8c8c8c]">输入关键词，搜索全站帖子</p></div>}
    </div>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-[#c23531]/30 border-t-[#c23531] rounded-full animate-spin" /></div>}>
    <SearchResults />
  </Suspense>
}
