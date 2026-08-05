'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/AuthProvider'
import { Crown, MessageCircle, Eye, Heart, Lock, Diamond, Play } from 'lucide-react'
import Breadcrumb from '@/components/Breadcrumb'
import Seo from '@/components/Seo'

// 技术板块：从标题解析品牌/故障（中文标题格式：品牌 故障：案例名）
const TECH_BRAND_MAP = {
  '苹果': { en: 'Apple', label: '苹果 Apple' },
  '三星': { en: 'Samsung', label: '三星 Samsung' },
  '华为': { en: 'Huawei', label: '华为 Huawei' },
  '小米': { en: 'Xiaomi', label: '小米 Xiaomi' },
  '其他安卓': { en: 'Other Android', label: '其他安卓 Other' },
  '电脑主板': { en: 'PC', label: '电脑主板 PC' },
  '通用': { en: 'General', label: '通用 General' },
}
const TECH_FAULT_MAP = {
  '屏幕/显示/触摸维修': '屏幕-显示-触摸',
  '不开机/死机/重启维修': '不开机-死机',
  '主板/芯片级维修': '主板-芯片',
  '电池/耗电维修': '电池-耗电',
  '信号/无服务维修': '信号-无服务',
  '充电/尾插维修': '充电-尾插',
  '扩容/存储维修': '扩容-存储',
  '功能故障维修': '功能故障',
  '摄像头维修': '摄像头',
  '解锁/激活维修': '解锁-激活',
  '进水维修': '进水',
  '音频维修': '音频',
  '其他维修': '其他',
}
function parseTechTitle(title) {
  for (const [cn, b] of Object.entries(TECH_BRAND_MAP)) {
    if (title.startsWith(cn + ' ')) {
      for (const [fcn, fshort] of Object.entries(TECH_FAULT_MAP)) {
        if (title.includes(fcn)) return { brandEn: b.en, brandLabel: b.label, faultShort: fshort, faultLabel: fcn }
      }
      return { brandEn: b.en, brandLabel: b.label, faultShort: '其他', faultLabel: '其他维修' }
    }
  }
  return null
}
import BookmarkButton from '@/components/BookmarkButton'
import { checkContent } from '@/lib/moderation'
import { TECH_CATEGORY_SLUG, canViewTech, TechLockOverlay, getUpgradeInfo } from '@/lib/member'

export default function ThreadPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [error, setError] = useState('')
  const [techLocked, setTechLocked] = useState(false)
  const [techLockInfo, setTechLockInfo] = useState(null)
  const supabase = createClient()

  // SEO：帖子标题/描述/关键词
  const seoTitle = thread ? `${thread.title} | 古道论坛维修案例` : '古道论坛维修案例'
  const seoDesc = thread ? (thread.content || '').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) : '古道论坛维修案例，手机电脑芯片级维修' 
  const seoKeywords = thread
    ? `${thread.brand || ''} ${(thread.fault || '').replace('-', '/')} 维修案例 手机维修 芯片级维修 ${thread.brand || ''}维修 主板维修 屏幕维修 电池维修`
    : '维修案例,手机维修,芯片级维修,主板维修,屏幕维修'

  useEffect(() => {
    const fetch = async () => {
      const { data: t } = await supabase.from('threads')
        .select('id, title, category_id, author_id, images, is_pinned, is_locked, view_count, reply_count, created_at, updated_at, brand, fault, profiles(username, display_name, role), categories(name, slug)')
        .eq('id', id).maybeSingle()
      if (t) {
        await supabase.from('threads').update({ view_count: (t.view_count || 0) + 1 }).eq('id', id)
        const { data: r } = await supabase.from('replies').select('*, profiles(username, display_name)').eq('thread_id', id).order('created_at')
        setReplies(r || []); setThread({ ...t, view_count: (t.view_count || 0) + 1, content: '' })

        // 内容走服务端鉴权 API（维修案例仅钻石会员，其他板块公开）
        try {
          const res = await fetch(`/api/thread-content/${id}`)
          const data = await res.json()
          if (data.content !== undefined) {
            setThread(prev => ({ ...prev, content: data.content }))
          } else if (data.locked) {
            setTechLocked(true)
            setTechLockInfo({ reason: data.reason || 'upgrade' })
          }
        } catch (e) {
          console.error('内容加载失败', e)
        }
      }
      setLoading(false)
    }
    fetch()
  }, [id])

  useEffect(() => {
    if (!user) return
    supabase.from("thread_likes").select("*").eq("thread_id", id).eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setLiked(!!data))
    supabase.from("thread_likes").select("id", { count: "exact", head: true }).eq("thread_id", id)
      .then(({ count }) => setLikeCount(count || 0))
  }, [user, id])

  const handleReply = async (e) => {
    e.preventDefault(); setError('')
    if (!replyContent.trim()) return
    const replyCheck = checkContent(replyContent)
    if (!replyCheck.pass) { setError('回复包含不当言论'); return }
    setSending(true)
    const { error: err } = await supabase.from('replies').insert({ thread_id: id, content: replyContent.trim(), author_id: user.id })
    if (err) { setError(err.message) } else {
      await supabase.from('threads').update({ reply_count: replies.length + 1 }).eq('id', id)
      const { data: r } = await supabase.from('replies').select('*, profiles(username, display_name)').eq('thread_id', id).order('created_at')
      setReplies(r || []); setReplyContent('')
    }
    setSending(false)
  }

  const toggleLike = async () => {
    if (!user) return
    if (liked) { await supabase.from("thread_likes").delete().eq("thread_id", id).eq("user_id", user.id); setLiked(false); setLikeCount(c => Math.max(0, c - 1)) }
    else { await supabase.from("thread_likes").insert({ thread_id: id, user_id: user.id }); setLiked(true); setLikeCount(c => c + 1) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-5 h-5 border-[1.5px] border-[#ddd] border-t-[#1a1a1a] rounded-full animate-spin" /></div>
  if (!thread) return <div className="text-center py-20 anim-fade-in"><p className="text-[#bbb]">帖子不存在</p><Link href="/" className="text-[#888] hover:text-[#1a1a1a] mt-2 inline-block transition-colors">返回首页</Link></div>

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} keywords={seoKeywords} />
    <div className="anim-fade-in w-full sm:max-w-3xl sm:mx-auto">
      {(() => {
        const isTech = thread.categories?.slug === TECH_CATEGORY_SLUG
        const parsed = isTech ? parseTechTitle(thread.title) : null
        const crumbs = [{ label: '首页', href: '/' }, { label: '板块列表', href: '/board' }]
        if (isTech && parsed) {
          crumbs.push({ label: '维修案例', href: '/c/tech' })
          crumbs.push({ label: parsed.brandLabel, href: `/c/tech/${encodeURIComponent(parsed.brandEn)}` })
          crumbs.push({ label: parsed.faultLabel, href: `/c/tech/${encodeURIComponent(parsed.brandEn)}/${encodeURIComponent(parsed.faultShort)}` })
          crumbs.push({ label: thread.title.length > 20 ? thread.title.slice(0, 20) + '…' : thread.title })
        } else {
          crumbs.push({ label: thread.categories?.name || '板块', href: `/c/${thread.categories?.slug}` })
          crumbs.push({ label: thread.title.length > 20 ? thread.title.slice(0, 20) + '…' : thread.title })
        }
        return <Breadcrumb crumbs={crumbs} />
      })()}

      {techLocked ? (
        <div className="mt-4 card p-8 text-center anim-up">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">
            {techLockInfo?.reason === 'exhausted' ? '⛔ 查看次数已用完' : (techLockInfo?.reason === 'login' ? '🔒 请先登录' : '💎 需要升级会员')}
          </h2>
          <p className="text-[#888] text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            {techLockInfo?.reason === 'exhausted'
              ? '你的技术帖查看次数已用完，升级钻石会员即可无限次查看维修案例内容。'
              : (techLockInfo?.reason === 'login'
                ? '维修案例仅限钻石会员查看，请登录并升级钻石会员。'
                : '维修案例仅限钻石会员查看，升级钻石会员即可解锁全部内容。')}
          </p>
          <div className="flex flex-col items-center gap-3">
            <a href={techLockInfo?.reason === 'login' ? '/login' : '/lottery/upgrade'}
              className="inline-block px-6 py-2.5 rounded-lg text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}>
              {techLockInfo?.reason === 'login' ? '去登录' : '升级钻石会员'}
            </a>
            {techLockInfo?.reason !== 'login' && (
              <a href="/login" className="text-xs text-[#aaa] hover:text-[#888] transition-colors">已有账户？去登录</a>
            )}
          </div>
        </div>
      ) : (
        <article className="mt-4 card p-6 sm:p-8 anim-up">
          {(thread.profiles?.role === 'admin' || thread.profiles?.role === 'moderator') && (
            <span className="tag mb-3 inline-block"><Crown size={14} className="inline-block align-text-bottom" /> 管理员</span>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] leading-snug">{thread.title}</h1>
          <div className="flex items-center gap-2 mt-3 text-sm text-[#aaa]">
            <Link href={`/profile/${thread.author_id}`} className="w-6 h-6 rounded-full bg-[#c23531] flex items-center justify-center text-[10px] text-white font-bold">
              {(thread.profiles?.display_name || thread.profiles?.username || '?')[0]}
            </Link>
            <Link href={`/profile/${thread.author_id}`} className="text-[#888] hover:text-[#c23531] transition-colors">{thread.profiles?.display_name || thread.profiles?.username}</Link>
            <span>·</span>
            <span>{new Date(thread.created_at).toLocaleString('zh-CN')}</span>
          </div>

          <div className="my-6 h-px bg-[#f0f0f0]" />

          {thread.content?.includes('douyin.com') && (() => {
            const m = thread.content.match(/https:\/\/(?:www\.douyin\.com\/video\/\d+|v\.douyin\.com\/[\w\/]+)/)
            const url = m ? m[0] : null
            return url ? (
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="mb-5 inline-flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition-all">
                <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                  <Play size={16} className="ml-0.5" />
                </span>
                观看抖音维修视频
                <span className="text-xs font-normal opacity-75">点击跳转抖音 ›</span>
              </a>
            ) : null
          })()}

          <div className="text-[#444] leading-7 sm:leading-8 whitespace-pre-wrap text-sm sm:text-base font-mono">{thread.content}</div>

          {thread.images?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {thread.images.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-[45%] sm:w-[30%] group">
                  <img src={url} alt="" className="w-full h-auto max-h-60 object-cover rounded-xl border border-[#f0f0f0] group-hover:opacity-90 transition-all" loading="lazy" />
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#f0f0f0] flex items-center gap-4 text-sm">
            <button onClick={toggleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-all ${liked ? 'text-[#c23531] bg-[#fafafa] border border-[#f0f0f0]' : 'text-[#aaa] border border-[#f0f0f0] hover:text-[#c23531] hover:border-[#e0e0e0]'}`}>
              {liked ? <Heart size={16} className="fill-current inline-block align-text-bottom" /> : <Heart size={16} className="inline-block align-text-bottom" />} <span>{liked ? "已赞" : "点赞"} {likeCount > 0 ? likeCount : ""}</span>
            </button>
            <BookmarkButton threadId={thread.id} />
            <span className="stat"><MessageCircle size={14} className="inline-block align-text-bottom" /> {replies.length} 回复</span>
            <span className="stat"><Eye size={14} className="inline-block align-text-bottom" /> {thread.view_count || 0} 浏览</span>
          </div>
        </article>
      )}

      {!techLocked && (
      <>
      <div className="mt-6 anim-up">
        <h2 className="text-sm font-medium text-[#888] mb-4"><MessageCircle size={14} className="inline-block align-text-bottom" /> 全部回复<span className="font-normal text-[#bbb] ml-1">({replies.length})</span></h2>
        <div className="space-y-3">
          {replies.length === 0 ? (
            <div className="card p-8 text-center"><p className="text-[#bbb] text-sm">暂无回复，来坐沙发吧</p></div>
          ) : replies.map((r, i) => (
            <div key={r.id} className={`card p-4 sm:p-5 anim-scale ${i > 0 ? `anim-delay-${Math.min(i, 3)}` : ''}`}>
              {r.is_deleted ? (
                <p className="text-[#ddd] italic text-sm">[该回复已被删除]</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm text-[#aaa] mb-2">
                    <Link href={`/profile/${r.author_id}`} className="w-5 h-5 rounded-full bg-[#ddd] flex items-center justify-center text-[8px] text-white font-bold">
                      {(r.profiles?.display_name || r.profiles?.username || '?')[0]}
                    </Link>
                    <Link href={`/profile/${r.author_id}`} className="text-[#888] hover:text-[#c23531] transition-colors">{r.profiles?.display_name || r.profiles?.username}</Link>
                    <span>·</span>
                    <span>{new Date(r.created_at).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="text-[#444] leading-7 whitespace-pre-wrap text-sm">{r.content}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {user ? (
        <form onSubmit={handleReply} className="mt-6 card p-5 anim-up">
          <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)}
            className="input min-h-[100px] resize-none" placeholder="写下你的回复..." />
          {error && <p className="text-[#c23531] text-xs mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-[#ccc]">以文会友，友善交流</span>
            <button type="submit" disabled={sending || !replyContent.trim()}
              className="btn-primary disabled:opacity-50"
            >{sending ? '发送中...' : '发表回复'}</button>
          </div>
        </form>
      ) : (
        <div className="mt-6 card p-5 text-center">
          <p className="text-[#aaa] text-sm"><Link href="/login" className="text-[#c23531] hover:underline">登录</Link> 后可以回复</p>
        </div>
      )}
      </>
      )}
    </div>
    </>
  )
}
