'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Clock, Flame, Pencil, Lock, Pin, Crown, MessageCircle } from 'lucide-react'
import { TECH_CATEGORY_SLUG, canViewTech, TechLockOverlay, canPinThread } from '@/lib/member'
import { useAuth } from '@/components/AuthProvider'
import Breadcrumb from '@/components/Breadcrumb'

export default function CategoryPage() {
  const { user, profile } = useAuth()
  const { slug } = useParams()
  const router = useRouter()
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [sortBy, setSortBy] = useState('latest')
  const [lockOverlay, setLockOverlay] = useState({ show: false, reason: 'upgrade' })
  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const membershipLevel = profile?.membership_level || 'regular'
  const canShowPinButton = isAdmin || membershipLevel === 'gold' || membershipLevel === 'diamond'
  const isAnnouncements = slug === 'announcements'
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single()
      setCategory(cat)
      if (cat) {
        const { data } = await supabase.from('threads')
          .select('*, profiles!inner(username, display_name, role)').eq('category_id', cat.id)
          .order('is_pinned', { ascending: false }).order(sortBy === 'hot' ? 'reply_count' : 'created_at', { ascending: false })
        const sorted = (data || []).sort((a, b) => {
          const aA = a.profiles?.role === 'admin' || a.profiles?.role === 'moderator'
          const bB = b.profiles?.role === 'admin' || b.profiles?.role === 'moderator'
          if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
          if (aA !== bB) return aA ? -1 : 1
          return 0
        })
        setThreads(sorted)
      }
    }
    fetch()
  }, [slug, sortBy])

  const togglePin = async (e, thread) => {
    e.stopPropagation()
    // 检查置顶权限
    const check = canPinThread(user, profile)
    if (!check.allowed) return

    const newVal = !thread.is_pinned
    await supabase.from('threads').update({ is_pinned: newVal }).eq('id', thread.id)
    setThreads(threads.map(t => t.id === thread.id ? { ...t, is_pinned: newVal } : t))

    // 黄金会员：置顶后 +1
    if (!check.unlimited && profile?.id) {
      const currentUsed = profile.thread_pins_used || 0
      await supabase.from('profiles').update({ thread_pins_used: currentUsed + 1 }).eq('id', profile.id)
    }
  }

  const isTech = slug === TECH_CATEGORY_SLUG
  const techAccess = isTech ? canViewTech(user, profile) : { allowed: true }

  const handleThreadClick = (t) => {
    if (isTech && !techAccess.allowed) {
      setLockOverlay({ show: true, reason: techAccess.reason || 'upgrade' })
      return
    }
    router.push(`/t/${t.id}`)
  }

  if (!category) return <div className="flex justify-center py-16"><div className="w-4 h-4 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>

  return (
    <div className="anim-fade-in">
      <div className="mb-5">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: `${category.icon} ${category.name}` },
        ]} />
        <h1 className="text-xl font-bold text-[#1a1a1a] mt-1">{category.icon} {category.name}</h1>
        <p className="text-[#aaa] text-xs mt-0.5">{category.description}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5">
          <button onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === 'latest' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}><Clock size={14} className="inline-block align-text-bottom" /> 最新</button>
          <button onClick={() => setSortBy('hot')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${sortBy === 'hot' ? 'bg-[#b45309] text-white' : 'bg-[#f5f5f3] text-[#888] hover:text-[#1a1a1a]'}`}><Flame size={14} className="inline-block align-text-bottom" /> 最热</button>
        </div>
        {(!isAnnouncements || isAdmin) && (
          <Link href="/new-thread" className="btn-primary !px-3 !py-1.5 !text-xs"><Pencil size={14} className="inline-block align-text-bottom" /> 发帖</Link>
        )}
      </div>

      {isAnnouncements && !isAdmin && (
        <div className="card p-3 text-center mb-4"><p className="text-[#aaa] text-xs"><Lock size={14} className="inline-block align-text-bottom" /> 此版块仅管理员可发帖</p></div>
      )}

      <div className="card divide-y divide-[#f5f5f3]">
        {threads.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[#bbb] text-sm">这里还没有帖子</p>
            {(!isAnnouncements || isAdmin) && <Link href="/new-thread" className="btn-primary mt-3">发第一条帖子</Link>}
          </div>
        ) : threads.map((t, i) => (
          <div key={t.id} onClick={() => handleThreadClick(t)}
            className={`thread-item px-4 ${i === 0 ? 'pt-3' : ''} last:pb-3`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  {t.is_pinned && <span className="tag"><Pin size={12} className="inline-block align-text-bottom" /> 置顶</span>}
                  {(t.profiles?.role === 'admin' || t.profiles?.role === 'moderator') && !t.is_pinned && <span className="tag"><Crown size={12} className="inline-block align-text-bottom" /> 管理员</span>}
                  {t.is_locked && <span className="tag"><Lock size={12} className="inline-block align-text-bottom" /> 已锁</span>}
                </div>
                <h3 className="font-medium text-sm text-[#1a1a1a] truncate leading-snug">{isTech && !techAccess.allowed && <span className="mr-1">🔒</span>}{t.title}</h3>
                <div className="flex items-center gap-2 text-xs text-[#bbb] mt-1">
                  <span>{t.profiles?.display_name || t.profiles?.username}</span>
                  <span>·</span>
                  <span>{new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-1">
                <span className="text-xs text-[#bbb]"><MessageCircle size={14} className="inline-block align-text-bottom" /> {t.reply_count || 0}</span>
                {canShowPinButton && (
                  <button onClick={(e) => togglePin(e, t)}
                    className={`ml-1 px-1.5 py-0.5 rounded text-xs ${t.is_pinned ? 'text-[#8b6914] bg-[#f5f5f3]' : 'text-[#ddd] hover:text-[#8b6914] hover:bg-[#f5f5f3]'}`}>
                    <Pin size={14} className="inline-block" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isTech && (
        <TechLockOverlay
          show={lockOverlay.show}
          onClose={() => setLockOverlay({ show: false, reason: 'upgrade' })}
          reason={lockOverlay.reason}
        />
      )}
    </div>
  )
}
