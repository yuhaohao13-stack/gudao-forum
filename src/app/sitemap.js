import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.gudaoforum.com'

// 服务端 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  // 静态页面
  const staticPages = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/chat`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/new-thread`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/messages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
  ]

  // 分类页面 - 从数据库获取
  let categoryPages = []
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
    if (categories) {
      categoryPages = categories.map(cat => ({
        url: `${BASE}/c/${cat.slug}`,
        lastModified: new Date(cat.updated_at || Date.now()),
        changeFrequency: 'daily',
        priority: 0.7,
      }))
    }
  } catch (e) {
    console.error('Sitemap categories fetch error:', e)
  }

  // 帖子页面 - 从数据库获取（最多 1000 条）
  let threadPages = []
  try {
    const { data: threads } = await supabase
      .from('threads')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1000)
    if (threads) {
      threadPages = threads.map(t => ({
        url: `${BASE}/t/${t.id}`,
        lastModified: new Date(t.updated_at || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.6,
      }))
    }
  } catch (e) {
    console.error('Sitemap threads fetch error:', e)
  }

  // 聊天室页面 - 从数据库获取
  let chatPages = []
  try {
    const { data: rooms } = await supabase
      .from('chat_rooms')
      .select('slug, updated_at')
    if (rooms) {
      chatPages = rooms.map(r => ({
        url: `${BASE}/chat/${r.slug}`,
        lastModified: new Date(r.updated_at || Date.now()),
        changeFrequency: 'daily',
        priority: 0.6,
      }))
    }
  } catch (e) {
    console.error('Sitemap chat rooms fetch error:', e)
  }

  return [...staticPages, ...categoryPages, ...threadPages, ...chatPages]
}
