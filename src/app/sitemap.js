import { createClient } from '@/lib/supabase/server'
import POEMS from '@/data/poetry'
import IDIOMS from '@/data/idioms'
import PROVERBS from '@/data/proverbs'
import CLASSICS from '@/data/classics'
import CLASSICS_SEO from '@/data/classics-seo'

const BASE = 'https://www.gudaoforum.com'

// 文学内容详情页（SEO 重点，与各 SSG 路由保持一致）
function literatureRoutes() {
  const routes = []
  const now = new Date()
  for (const p of POEMS) {
    routes.push({ url: `${BASE}/poetry/${p.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
  }
  for (const p of IDIOMS) {
    routes.push({ url: `${BASE}/idioms/${p.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
  }
  for (const p of PROVERBS) {
    routes.push({ url: `${BASE}/proverbs/${p.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
  }
  for (const b of CLASSICS) {
    const chs = CLASSICS_SEO[b.id] || []
    for (const c of chs) {
      routes.push({ url: `${BASE}/classics/${b.id}/${c.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
    }
  }
  return routes
}

// 静态页面路由
const STATIC_ROUTES = [
  // 首页
  { url: BASE, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },

  // 论坛板块
  { url: `${BASE}/board`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },

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

    // 论坛帖子（分页拉取，突破 PostgREST 默认 1000 上限）
    let allThreads = []
    for (let offset = 0; offset < 6000; offset += 1000) {
      const { data: page } = await supabase
        .from('threads')
        .select('id, updated_at')
        .range(offset, offset + 999)
      if (page && page.length) {
        allThreads = allThreads.concat(page)
        if (page.length < 1000) break
      } else break
    }
    if (allThreads.length) {
      dynamicRoutes.push(
        ...allThreads.map(t => ({
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

    // 维修案例 品牌×故障 三级页面（SEO 收录）
    const TECH_CAT = '23e3f4d0-3d28-4b4e-ad17-b0b9cf943cb8'
    const BRAND_KEY = {
      '苹果 Apple': 'Apple', '三星 Samsung': 'Samsung', '华为 Huawei': 'Huawei',
      '小米 Xiaomi': 'Xiaomi', '其他安卓 Other': 'Other%20Android',
      '电脑主板 PC': 'PC', '通用 General': 'General',
    }
    const { data: techThreads } = await supabase
      .from('threads')
      .select('brand, fault')
      .eq('category_id', TECH_CAT)
    if (techThreads) {
      const pairs = new Set()
      for (const t of techThreads) {
        const bk = BRAND_KEY[t.brand]
        if (bk && t.fault) pairs.add(`${bk}::${encodeURIComponent(t.fault)}`)
      }
      for (const p of pairs) {
        const [bk, f] = p.split('::')
        dynamicRoutes.push({
          url: `${BASE}/c/tech/${bk}/${f}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        })
      }
      // 品牌页
      for (const bk of Object.values(BRAND_KEY)) {
        dynamicRoutes.push({
          url: `${BASE}/c/tech/${bk}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    }
  } catch (e) {
    // Supabase 连接失败时，忽略动态路由，只返回静态路由
    console.error('Failed to fetch dynamic routes for sitemap:', e.message)
  }

  return [...STATIC_ROUTES, ...literatureRoutes(), ...dynamicRoutes]
}
