import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import ThreadDetail from './_detail'

// 帖子页正文服务端直出（SEO：爬虫直接可见完整 HTML，不再客户端渲染空壳）
// - 维修案例(tech)：非钻石会员 → 公开 ~150 字摘录 + 升级引导（全文绝不进 HTML）
// - 其他板块：全文公开服务端直出
// - 钻石会员 / 公开板块：完整正文 + 全部回复服务端直出，客户端只做交互（回复/点赞/收藏/浏览量）

export const dynamic = 'force-dynamic'

const PREVIEW_LEN = 150

function supabaseService() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

// react cache：同一请求内 metadata 与页面共用一次查询
const getThread = cache(async (id) => {
  if (!id || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  try {
    const { data } = await supabaseService()
      .from('threads')
      .select('id, title, brand, fault, content, images, view_count, reply_count, created_at, categories(name, slug), profiles(username, display_name, role)')
      .eq('id', id)
      .maybeSingle()
    return data
  } catch (e) {
    console.error('getThread error', e)
    return null
  }
})

// 摘录清洗：去链接/分隔线/多余空白（与 meta description 同一套处理）
function cleanText(text) {
  return (text || '').replace(/https?:\/\/\S+/g, '').replace(/━+/g, ' ').replace(/\s+/g, ' ').trim()
}

function makePreview(content) {
  const clean = cleanText(content)
  if (!clean) return ''
  if (clean.length <= PREVIEW_LEN) return clean
  return clean.slice(0, PREVIEW_LEN).trimEnd() + '…'
}

// 统一用新加坡时间格式化，避免服务端/客户端时区不一致导致 hydration 错位
function fmtDate(iso) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(iso))
  } catch {
    return new Date(iso).toISOString().slice(0, 16).replace('T', ' ')
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  if (!id) {
    return { title: '古道论坛' }
  }
  const thread = await getThread(id)
  if (!thread || !thread.title) {
    return { title: { absolute: '帖子 - 古道论坛' } }
  }

  // 标题：帖子标题（截断过长）+ 品牌/故障词
  const cleanTitle = thread.title.replace(/^📱\s*|^📺\s*|^🔧\s*/g, '').trim()
  const brandFault = [thread.brand, thread.fault].filter(Boolean).join(' ')
  const title = `${cleanTitle.slice(0, 50)}${cleanTitle.length > 50 ? '…' : ''}${brandFault ? ` - ${brandFault}` : ''}`
  // 描述：正文前 140 字（去链接），仅做摘要
  const desc = cleanText(thread.content).slice(0, 140)
  const description = desc ? `${desc}${desc.length >= 140 ? '…' : ''} | 古道论坛华人社区` : '古道论坛华人社区帖子。以文会友，以友辅仁，免费注册即刻加入。'
  const canonical = `https://www.gudaoforum.com/t/${id}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonical,
    },
  }
}

export default async function Page({ params }) {
  const { id } = await params
  const thread = await getThread(id)
  if (!thread || !thread.title) notFound()

  const isTech = thread.categories?.slug === 'tech'
  const fullContent = thread.content || ''
  let view = 'full'
  let lockReason = null

  // 维修案例板块：仅钻石会员可见全文（与 /api/thread-content 鉴权一致）
  if (isTech) {
    view = 'locked'
    lockReason = 'login'
    try {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: prof } = await supabaseService()
          .from('profiles').select('membership_level').eq('id', user.id).maybeSingle()
        if (prof?.membership_level === 'diamond') {
          view = 'full'
        } else {
          lockReason = 'diamond_only'
        }
      }
    } catch (e) {
      console.error('thread viewer check error', e)
    }
  }

  // 传给客户端的帖子元信息（绝不包含 content 列 → 锁定视图不会把全文带到客户端）
  const meta = {
    id: thread.id,
    title: thread.title,
    brand: thread.brand,
    fault: thread.fault,
    images: thread.images,
    view_count: thread.view_count || 0,
    reply_count: thread.reply_count || 0,
    createdAtText: fmtDate(thread.created_at),
    categories: thread.categories || { name: '', slug: '' },
    author: thread.profiles
      ? {
          id: thread.author_id,
          username: thread.profiles.username,
          display_name: thread.profiles.display_name,
          role: thread.profiles.role,
        }
      : { id: thread.author_id, username: null, display_name: null, role: null },
  }

  let content = null
  let replies = []
  let likeCount = 0

  if (view === 'full') {
    content = fullContent
    const [rRes, lRes] = await Promise.all([
      supabaseService()
        .from('replies')
        .select('id, author_id, content, is_deleted, created_at, profiles(username, display_name)')
        .eq('thread_id', id)
        .order('created_at'),
      supabaseService()
        .from('thread_likes')
        .select('id', { count: 'exact', head: true })
        .eq('thread_id', id),
    ])
    replies = (rRes.data || []).map((r) => ({
      id: r.id,
      author_id: r.author_id,
      content: r.content,
      is_deleted: r.is_deleted,
      createdAtText: fmtDate(r.created_at),
      author: r.profiles
        ? { username: r.profiles.username, display_name: r.profiles.display_name }
        : null,
    }))
    likeCount = lRes.count || 0
  } else {
    // 锁定视图：公开摘录（与 meta description 同源），全文留在服务端
    content = makePreview(fullContent)
  }

  return <ThreadDetail initial={{ thread: meta, content, replies, likeCount, view, lockReason }} />
}
