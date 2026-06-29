'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function Results() {
  const sp = useSearchParams(); const router = useRouter()
  const query = sp.get('q') || ''
  const [results, setResults] = useState([]); const [loading, setLoading] = useState(false)
  const [input, setInput] = useState(query); const [searched, setSearched] = useState(false)
  const supabase = createClient()

  const search = async (q) => {
    if (!q.trim()) return; setLoading(true); setSearched(true)
    try {
      const [t, c] = await Promise.all([
        supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)').ilike('title', `%${q}%`).order('created_at', { ascending: false }).limit(20),
        supabase.from('threads').select('*, profiles(username, display_name), categories(name, slug)').ilike('content', `%${q}%`).order('created_at', { ascending: false }).limit(20),
      ])
      const seen = new Set()
      setResults([...(t.data || []), ...(c.data || [])].filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true }))
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { if (query) { setInput(query); search(query) } }, [query])

  return (
    <div className="anim-fade-in max-w-2xl mx-auto">
      <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mb-5">搜索</h1>
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`) }} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ccc] text-sm pointer-events-none">⌕</span>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="搜索帖子..." className="input pl-9" autoFocus />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '搜索中...' : '搜索'}</button>
      </form>
      {loading && <div className="flex justify-center py-8"><div className="w-5 h-5 border-[1.5px] border-[#ccc] border-t-[#1a1a1a] rounded-full animate-spin" /></div>}
      {!loading && searched && query && (
        <><p className="text-sm text-[#aaa] mb-4">搜索「{query}」— {results.length} 个结果</p>
        <div className="space-y-2.5">
          {results.length === 0 ? (
            <div className="card p-10 text-center"><div className="text-2xl mb-2">🔍</div><p className="text-[#aaa]">没有找到相关帖子</p></div>
          ) : results.map((t, i) => (
            <Link key={t.id} href={`/t/${t.id}`} className={`post-card ${i > 0 ? `anim-delay-${Math.min(i, 5)}` : ''}`}>
              <div className="text-[#1a1a1a]">
                <div className="font-semibold truncate text-sm">{t.title}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-[#aaa] truncate min-w-0">
                    <span className="font-medium text-[#888]">{t.profiles?.display_name || t.profiles?.username}</span>
                    {t.categories && <><span className="text-[#ddd8d0] mx-1.5">/</span>{t.categories?.name}</>}
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0 ml-3">
                    <span className="stat">💬 <span className="stat-num">{t.reply_count || 0}</span></span>
                    <span className="stat">👁 <span className="stat-num">{t.view_count || 0}</span></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div></>
      )}
      {!searched && !query && <div className="text-center py-16"><div className="text-2xl mb-2">⌕</div><p className="text-[#aaa]">输入关键词，搜索全站帖子</p></div>}
    </div>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ccc] border-t-[#1a1a1a] rounded-full animate-spin" /></div>}><Results /></Suspense>
}
