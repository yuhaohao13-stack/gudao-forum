import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// 帖子页服务端 metadata（爬虫可见独立标题/描述/canonical）
// 用 service role key 读公开元数据（标题/分类/品牌/故障），正文仍走客户端鉴权（技术帖锁会员）
async function getThreadMeta(id) {
  if (!id) return null
  // 环境变量缺失时静默降级（不抛错，避免整页 500）
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
    const { data } = await supabase
      .from('threads')
      .select('id, title, brand, fault, content')
      .eq('id', id)
      .maybeSingle()
    return data
  } catch (e) {
    return null
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params
  if (!id) {
    return { title: '古道论坛' }
  }
  const thread = await getThreadMeta(id)
  if (!thread || !thread.title) {
    return { title: { absolute: '帖子 - 古道论坛' } }
  }

  // 标题：帖子标题（截断过长）+ 品牌/故障词
  const cleanTitle = thread.title.replace(/^📱\s*|^📺\s*|^🔧\s*/g, '').trim()
  const brandFault = [thread.brand, thread.fault].filter(Boolean).join(' ')
  const title = `${cleanTitle.slice(0, 50)}${cleanTitle.length > 50 ? '…' : ''}${brandFault ? ` - ${brandFault}` : ''}`
  // 描述：正文前 140 字（去链接），不带会员锁内容判断（仅做摘要）
  const desc = (thread.content || '').replace(/https?:\/\/\S+/g, '').replace(/━+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140)
  const description = desc ? `${desc}${desc.length >= 140 ? '…' : ''} | 古道论坛华人社区` : '古道论坛华人社区帖子。以文会友，以友辅仁，免费注册即刻加入。'

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `https://www.gudaoforum.com/t/${id}` },
    openGraph: {
      title: title,
      description,
      type: 'article',
      url: `https://www.gudaoforum.com/t/${id}`,
    },
  }
}

export default function ThreadLayout({ children }) {
  return children
}
