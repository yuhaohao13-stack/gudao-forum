import { createClient } from '@/lib/supabase/server'

const BASE = 'https://www.gudaoforum.com'

// 静态页面路由
const STATIC_ROUTES = [
  // 首页
  { url: BASE, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },

  // 论坛板块
  { url: `${BASE}/c`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },

  // 古典文学
  { url: `${BASE}/classics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/classics/shuihu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/classics/sanguo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/classics/xiyouji`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/classics/hongloumeng`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

  // 唐诗三百首
  { url: `${BASE}/poetry`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

  // 成语故事
  { url: `${BASE}/idioms`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

  // 谚语故事
  { url: `${BASE}/proverbs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

  // 高清壁纸
  { url: `${BASE}/wallpaper`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/wallpaper/magazine`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/space`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/people`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/mountains`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/seasons`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/anime`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/city`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/ocean`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/flowers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/wallpaper/minimal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

  // 音乐
  { url: `${BASE}/music`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

  // 会员
  { url: `${BASE}/members`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },

  // 游戏
  { url: `${BASE}/games`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

  // 英语学习
  { url: `${BASE}/english`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/english/junior`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE}/english/senior`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },

  // 彩票模拟器
  { url: `${BASE}/lottery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
]

export default async function sitemap() {
  let dynamicRoutes = []
  try {
    const supabase = await createClient()

    // 论坛帖子
    const { data: threads } = await supabase
      .from('threads')
      .select('id, updated_at')
    if (threads) {
      dynamicRoutes.push(
        ...threads.map(t => ({
          url: `${BASE}/t/${t.id}`,
          lastModified: new Date(t.updated_at),
          changeFrequency: 'weekly',
          priority: 0.6,
        }))
      )
    }

    // 论坛分类板块
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
    if (categories) {
      dynamicRoutes.push(
        ...categories.map(c => ({
          url: `${BASE}/c/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        }))
      )
    }
  } catch (e) {
    // Supabase 连接失败时，忽略动态路由，只返回静态路由
    console.error('Failed to fetch dynamic routes for sitemap:', e.message)
  }

  return [...STATIC_ROUTES, ...dynamicRoutes]
}
