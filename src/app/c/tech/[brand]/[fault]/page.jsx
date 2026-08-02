'use client'
import Seo from '@/components/Seo'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TECH_CATEGORY_SLUG, canViewTech, TechLockOverlay } from '@/lib/member'
import { useAuth } from '@/components/AuthProvider'
import { ChevronLeft, ChevronRight, MessageCircle, Lock, Clock } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'

// URL key → 数据库 brand 字段值
const BRAND_MAP = {
  'Apple': '苹果 Apple', 'Samsung': '三星 Samsung', 'Huawei': '华为 Huawei',
  'Xiaomi': '小米 Xiaomi', 'Other Android': '其他安卓 Other',
  'PC': '电脑主板 PC', 'General': '通用 General',
}

const PAGE_SIZE = 10

export default function TechCasesPage() {
  const { user, profile } = useAuth()
  const { brand, fault } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const brandKey = decodeURIComponent(brand)
  const brandVal = BRAND_MAP[brandKey] || brandKey
  const faultName = decodeURIComponent(fault)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const [threads, setThreads] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [lockOverlay, setLockOverlay] = useState({ show: false, reason: 'upgrade' })
  const supabase = createClient()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator'
  const techAccess = canViewTech(user, profile)

  const fetchData = useCallback(async () => {
    const { data: cat } = await supabase.from('categories').select('*').eq('slug', TECH_CATEGORY_SLUG).single()
    if (!cat) return
    // 总数
    const { count } = await supabase.from('threads')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id)
      .eq('brand', brandVal)
      .eq('fault', faultName)
    setTotalCount(count || 0)

    const from_ = (page - 1) * PAGE_SIZE
    const { data } = await supabase.from('threads')
      .select('*, profiles!inner(username, display_name, role)')
      .eq('category_id', cat.id)
      .eq('brand', brandVal)
      .eq('fault', faultName)
      .order('created_at', { ascending: false })
      .range(from_, from_ + PAGE_SIZE - 1)
    setThreads(data || [])
  }, [brandVal, faultName, page, supabase])

  useEffect(() => { fetchData() }, [fetchData])

  const handleThreadClick = (t) => {
    if (!techAccess.allowed) {
      setLockOverlay({ show: true, reason: techAccess.reason || 'upgrade' })
      return
    }
    router.push(`/t/${t.id}`)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <>
      <Seo title={`${brandVal} ${faultName} - 维修案例 | 古道论坛`} description={`古道论坛维修案例 ${brandVal} ${faultName} 维修案例`} />
      <div className="anim-fade-in max-w-3xl mx-auto">
        <Breadcrumb crumbs={[
          { label: '首页', href: '/' },
          { label: '板块列表', href: '/board' },
          { label: '维修案例', href: '/c/tech' },
          { label: brandVal, href: `/c/tech/${encodeURIComponent(brandKey)}` },
          { label: faultName },
        ]} />

        <div className="mb-5">
          <Link href={`/c/tech/${encodeURIComponent(brandKey)}`} className="text-xs text-[#b45309] hover:underline inline-flex items-center gap-1">
            <ChevronLeft size={14} /> 返回故障分类
          </Link>
          <h1 className="text-xl font-bold text-[#1a1a1a] mt-1">{brandVal} · {faultName} 维修案例</h1>
          <p className="text-[#aaa] text-xs mt-0.5">共 {totalCount} 篇</p>
        </div>

        <div className="card divide-y divide-[#f5f5f3]">
          {threads.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#bbb] text-sm">这里还没有案例</p>
            </div>
          ) : threads.map((t, i) => (
            <div key={t.id} onClick={() => handleThreadClick(t)}
              className={`thread-item px-4 ${i === 0 ? 'pt-3' : ''} last:pb-3 cursor-pointer`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm text-[#1a1a1a] leading-snug">
                    {!techAccess.allowed && <span className="mr-1">🔒</span>}
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#bbb] mt-1">
                    <span>{t.profiles?.display_name || t.profiles?.username}</span>
                    <span>·</span>
                    <span><Clock size={11} className="inline-block align-text-bottom" /> {new Date(t.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  <span className="text-xs text-[#bbb]"><MessageCircle size={14} className="inline-block align-text-bottom" /> {t.reply_count || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6 mb-8">
            <button
              onClick={() => router.push(`/c/tech/${encodeURIComponent(brandKey)}/${encodeURIComponent(faultName)}?page=${page - 1}`)}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            ><ChevronLeft size={14} /> 上一页</button>
            <span className="px-3 text-xs text-[#666]">{page} / {totalPages}</span>
            <button
              onClick={() => router.push(`/c/tech/${encodeURIComponent(brandKey)}/${encodeURIComponent(faultName)}?page=${page + 1}`)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#eee8dc] bg-white text-[#666] hover:bg-[#f5f5f3] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >下一页 <ChevronRight size={14} /></button>
          </div>
        )}

        {!techAccess.allowed && (
          <TechLockOverlay
            show={lockOverlay.show}
            onClose={() => setLockOverlay({ show: false, reason: 'upgrade' })}
            reason={lockOverlay.reason}
          />
        )}
      </div>
    </>
  )
}
