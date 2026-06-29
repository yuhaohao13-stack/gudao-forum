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
    <div className="anim-fade-in max-w-3xl mx-auto">
      <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mb-5">搜索</h1>
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`) }} className="mb-6 flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="搜索帖子..." className="input" autoFocus />
        <button type="submit" disabled={loading} className="btn-primary">{loading ? '搜索中...' : '搜索'}</button>
      </form>
      {loading && <div className="flex justify-center py-8"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>}
      {!loading && searched && query && (
        <><p className="text-sm text-[#aaa] mb-4">搜索「{query}」— {results.length} 个结果</p>
        {results.length === 0 ? (
          <div className="border border-dashed border-[#eee] rounded-xl py-12 text-center"><p className="text-[#bbb]">没有找到相关帖子</p></div>
        ) : (
          <div className="card divide-y divide-[#f5f5f5]">
            {results.map((t, i) => (
              <Link key={t.id} href={`/t/${t.id}`} className="thread-item px-4 first:pt-4 last:pb-4">
                <h3 className="font-medium text-sm truncate">{t.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#bbb]">
                  <span>{t.profiles?.display_name || t.profiles?.username}</span>
                  {t.categories && <><span>·</span><span>{t.categories?.name}</span></>}
                  <span className="ml-auto">💬 {t.reply_count || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}</>
      )}
      {!searched && !query && <div className="text-center py-16"><p className="text-[#bbb]">输入关键词，搜索全站帖子</p></div>}
    </div>
  )
}

export default function SearchPage() {
  return <Suspense fallback={<div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>}><Results /></Suspense>
}
